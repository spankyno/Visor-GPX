import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase para uso EXCLUSIVO en el servidor (API routes,
 * Server Components, Server Actions). Usa la service role key, que tiene
 * permisos totales sobre la base de datos, así que la autorización
 * (quién puede leer/escribir qué fila) la controlamos siempre a mano en
 * nuestro propio código a partir del userId de Clerk — nunca confiamos en
 * Row Level Security de Supabase para esto.
 *
 * IMPORTANTE: no importar este archivo desde ningún componente marcado
 * con "use client".
 */
function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Faltan las variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

let cached: ReturnType<typeof getSupabaseAdmin> | null = null;

export function supabaseAdmin() {
  if (!cached) cached = getSupabaseAdmin();
  return cached;
}
