-- Visor GPX — esquema de Supabase
--
-- Guardamos el contenido de cada GPX directamente como texto en Postgres
-- (en vez de en un bucket de Storage aparte). Los archivos GPX son XML de
-- texto y normalmente pesan pocos KB — cientos o miles de ellos caben de
-- sobra en los 500 MB de base de datos del plan gratuito de Supabase, y
-- así evitamos gestionar buckets, políticas de acceso y URLs firmadas por
-- separado: una sola tabla, una sola fuente de verdad.
--
-- La autorización NO se hace con Row Level Security: las API routes de
-- Next.js usan la service role key y comprueban ellas mismas el userId de
-- Clerk contra la columna user_id antes de leer/escribir/borrar.
--
-- Ejecuta este script una vez en el SQL Editor de tu proyecto de Supabase.

create table if not exists gpx_files (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,               -- id de usuario de Clerk (p.ej. "user_2abc...")
  file_name text not null,             -- nombre original del archivo subido
  track_name text,                     -- nombre de la ruta extraído del GPX
  content text not null,               -- XML del GPX completo
  size_bytes integer not null default 0,
  distance_km numeric,
  share_token text unique,             -- solo se rellena si el usuario (pro) activa compartir
  share_enabled boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists gpx_files_user_id_idx on gpx_files (user_id);
create index if not exists gpx_files_share_token_idx on gpx_files (share_token);

comment on table gpx_files is 'Archivos GPX almacenados por usuarios registrados/pro de Visor GPX.';
