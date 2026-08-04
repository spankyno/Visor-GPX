import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { deleteUserFile, getUserFile, renameUserFile } from "@/lib/gpx/store-server";

interface Params {
  params: Promise<{ id: string }>;
}

const MAX_NAME_LENGTH = 120;

export async function GET(_req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const { id } = await params;
    const file = await getUserFile(user.userId, id);
    if (!file) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    return NextResponse.json({ file });
  } catch {
    return NextResponse.json({ error: "No se pudo cargar la ruta." }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;

  const body = await req.json().catch(() => null);
  const trackName = typeof body?.trackName === "string" ? body.trackName.trim() : "";

  if (!trackName) {
    return NextResponse.json({ error: "El nombre no puede estar vacío." }, { status: 400 });
  }
  if (trackName.length > MAX_NAME_LENGTH) {
    return NextResponse.json(
      { error: `El nombre no puede superar los ${MAX_NAME_LENGTH} caracteres.` },
      { status: 400 }
    );
  }

  try {
    const existing = await getUserFile(user.userId, id);
    if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const file = await renameUserFile(user.userId, id, trackName);
    return NextResponse.json({ file });
  } catch {
    return NextResponse.json({ error: "No se pudo renombrar la ruta." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const { id } = await params;
    await deleteUserFile(user.userId, id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo borrar la ruta." }, { status: 500 });
  }
}
