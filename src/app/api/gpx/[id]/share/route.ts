import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getUserFile, setShareForUserFile } from "@/lib/gpx/store-server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(_req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  if (user.plan !== "pro") {
    return NextResponse.json(
      {
        error:
          "Compartir rutas es una función del plan Pro. Solicítalo al autor de la aplicación.",
        code: "PRO_REQUIRED",
      },
      { status: 403 }
    );
  }

  const { id } = await params;
  const existing = await getUserFile(user.userId, id);
  if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const file = await setShareForUserFile(user.userId, id, true);
  return NextResponse.json({ file });
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const existing = await getUserFile(user.userId, id);
  if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const file = await setShareForUserFile(user.userId, id, false);
  return NextResponse.json({ file });
}
