import { randomBytes } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/server";

export interface GpxFileRow {
  id: string;
  user_id: string;
  file_name: string;
  track_name: string | null;
  content: string;
  size_bytes: number;
  distance_km: number | null;
  share_token: string | null;
  share_enabled: boolean;
  created_at: string;
}

export type GpxFileMeta = Omit<GpxFileRow, "content">;

const METADATA_COLUMNS =
  "id, user_id, file_name, track_name, size_bytes, distance_km, share_token, share_enabled, created_at";

export async function countUserFiles(userId: string): Promise<number> {
  const { count, error } = await supabaseAdmin()
    .from("gpx_files")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) throw error;
  return count ?? 0;
}

export async function listUserFiles(userId: string): Promise<GpxFileMeta[]> {
  const { data, error } = await supabaseAdmin()
    .from("gpx_files")
    .select(METADATA_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as GpxFileMeta[];
}

export async function getUserFile(
  userId: string,
  id: string
): Promise<GpxFileRow | null> {
  const { data, error } = await supabaseAdmin()
    .from("gpx_files")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as GpxFileRow) ?? null;
}

export async function insertUserFile(input: {
  userId: string;
  fileName: string;
  trackName: string | null;
  content: string;
  distanceKm: number | null;
}): Promise<GpxFileMeta> {
  const { data, error } = await supabaseAdmin()
    .from("gpx_files")
    .insert({
      user_id: input.userId,
      file_name: input.fileName,
      track_name: input.trackName,
      content: input.content,
      size_bytes: Buffer.byteLength(input.content, "utf8"),
      distance_km: input.distanceKm,
    })
    .select(METADATA_COLUMNS)
    .single();
  if (error) throw error;
  return data as unknown as GpxFileMeta;
}

export async function deleteUserFile(userId: string, id: string): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("gpx_files")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function renameUserFile(
  userId: string,
  id: string,
  trackName: string
): Promise<GpxFileMeta | null> {
  const { data, error } = await supabaseAdmin()
    .from("gpx_files")
    .update({ track_name: trackName })
    .eq("id", id)
    .eq("user_id", userId)
    .select(METADATA_COLUMNS)
    .single();
  if (error) throw error;
  return (data as unknown as GpxFileMeta) ?? null;
}

export async function setShareForUserFile(
  userId: string,
  id: string,
  enabled: boolean
): Promise<GpxFileMeta | null> {
  if (enabled) {
    const token = randomBytes(9).toString("base64url");
    const { data, error } = await supabaseAdmin()
      .from("gpx_files")
      .update({ share_enabled: true, share_token: token })
      .eq("id", id)
      .eq("user_id", userId)
      .select(METADATA_COLUMNS)
      .single();
    if (error) throw error;
    return data as unknown as GpxFileMeta;
  }

  const { data, error } = await supabaseAdmin()
    .from("gpx_files")
    .update({ share_enabled: false })
    .eq("id", id)
    .eq("user_id", userId)
    .select(METADATA_COLUMNS)
    .single();
  if (error) throw error;
  return data as unknown as GpxFileMeta;
}

export async function getSharedFileByToken(
  token: string
): Promise<GpxFileRow | null> {
  const { data, error } = await supabaseAdmin()
    .from("gpx_files")
    .select("*")
    .eq("share_token", token)
    .eq("share_enabled", true)
    .maybeSingle();
  if (error) throw error;
  return (data as GpxFileRow) ?? null;
}
