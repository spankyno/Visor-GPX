import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSharedFileByToken } from "@/lib/gpx/store-server";
import { ShareViewClient } from "./ShareViewClient";

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const file = await getSharedFileByToken(token);
  const title = file ? `${file.track_name || file.file_name} · Ruta compartida` : "Ruta compartida";
  return { title };
}

export default async function SharePage({ params }: PageProps) {
  const { token } = await params;
  const file = await getSharedFileByToken(token);
  if (!file) notFound();

  return (
    <ShareViewClient
      fileName={file.file_name}
      trackName={file.track_name}
      content={file.content}
    />
  );
}
