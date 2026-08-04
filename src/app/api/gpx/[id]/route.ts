import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { deleteUserFile, getUserFile } from "@/lib/gpx/store-server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const file = await getUserFile(user.userId, id);
  if (!file) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  return NextResponse.json({ file });
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  await deleteUserFile(user.userId, id);
  return NextResponse.json({ ok: true });
}
