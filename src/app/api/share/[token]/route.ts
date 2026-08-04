import { NextResponse } from "next/server";
import { getSharedFileByToken } from "@/lib/gpx/store-server";

interface Params {
  params: Promise<{ token: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const { token } = await params;
    const file = await getSharedFileByToken(token);

    if (!file) {
      return NextResponse.json(
        { error: "Este enlace no existe o ya no está compartido." },
        { status: 404 }
      );
    }

    // Solo se devuelven los campos necesarios para mostrar la ruta: nunca
    // el user_id propietario ni cualquier otra columna interna.
    return NextResponse.json({
      file: {
        fileName: file.file_name,
        trackName: file.track_name,
        content: file.content,
        distanceKm: file.distance_km,
      },
    });
  } catch {
    return NextResponse.json({ error: "No se pudo cargar la ruta compartida." }, { status: 500 });
  }
}
