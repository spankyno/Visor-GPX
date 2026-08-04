import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { maxFilesForPlan } from "@/lib/plans";
import { countUserFiles, insertUserFile, listUserFiles } from "@/lib/gpx/store-server";

// Un GPX de decenas de miles de puntos ronda 1-3 MB de texto. 8 MB da
// margen de sobra sin permitir abusos que agoten la cuota de 500 MB/1 GB
// del plan gratuito de Supabase.
const MAX_CONTENT_BYTES = 8 * 1024 * 1024;
const MAX_FILE_NAME_LENGTH = 255;
const MAX_TRACK_NAME_LENGTH = 120;

/**
 * Comprobación superficial de que el contenido es realmente un GPX (XML con
 * un elemento <gpx>), no un archivo arbitrario. No es un parser completo
 * (eso ya lo hace el navegador al cargarlo) — solo evita que esta cuenta se
 * use como alojamiento genérico de archivos de cualquier tipo.
 */
function looksLikeGpx(content: string): boolean {
  const head = content.slice(0, 1000).toLowerCase();
  return head.includes("<gpx");
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const files = await listUserFiles(user.userId);
    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ error: "No se pudieron cargar tus rutas." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const fileName = typeof body?.fileName === "string" ? body.fileName.slice(0, MAX_FILE_NAME_LENGTH) : null;
  const trackName =
    typeof body?.trackName === "string" ? body.trackName.slice(0, MAX_TRACK_NAME_LENGTH) : null;
  const content = typeof body?.content === "string" ? body.content : null;
  const distanceKm =
    typeof body?.distanceKm === "number" && Number.isFinite(body.distanceKm)
      ? body.distanceKm
      : null;

  if (!fileName || !content) {
    return NextResponse.json(
      { error: "Faltan datos del archivo (fileName, content)." },
      { status: 400 }
    );
  }

  if (Buffer.byteLength(content, "utf8") > MAX_CONTENT_BYTES) {
    return NextResponse.json(
      { error: "El archivo GPX supera el tamaño máximo permitido (8 MB)." },
      { status: 413 }
    );
  }

  if (!looksLikeGpx(content)) {
    return NextResponse.json(
      { error: "El contenido no parece un archivo GPX válido." },
      { status: 400 }
    );
  }

  try {
    const limit = maxFilesForPlan(user.plan);
    if (limit !== null) {
      const current = await countUserFiles(user.userId);
      if (current >= limit) {
        return NextResponse.json(
          {
            error:
              user.plan === "registered"
                ? `Has alcanzado el límite de ${limit} archivos guardados de tu cuenta. Pasa a Pro para almacenamiento ilimitado.`
                : "Has alcanzado el límite de archivos guardados.",
            code: "QUOTA_EXCEEDED",
          },
          { status: 403 }
        );
      }
    }

    const file = await insertUserFile({
      userId: user.userId,
      fileName,
      trackName,
      content,
      distanceKm,
    });

    return NextResponse.json({ file }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar la ruta." }, { status: 500 });
  }
}
