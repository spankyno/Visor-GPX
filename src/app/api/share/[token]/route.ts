import { NextResponse } from "next/server";
import { getSharedFileByToken } from "@/lib/gpx/store-server";

interface Params {
  params: Promise<{ token: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { token } = await params;
  const file = await getSharedFileByToken(token);

  if (!file) {
    return NextResponse.json(
      { error: "Este enlace no existe o ya no está compartido." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    file: {
      fileName: file.file_name,
      trackName: file.track_name,
      content: file.content,
      distanceKm: file.distance_km,
    },
  });
}
