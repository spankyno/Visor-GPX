/**
 * Planes de usuario de Visor GPX.
 *
 * - anonymous: sin cuenta. Puede subir y ver hasta ANONYMOUS_MAX_TRACKS
 *   archivos a la vez en el visor, pero nada se guarda en el servidor.
 * - registered: cuenta creada con Clerk (plan por defecto al registrarse).
 *   Puede almacenar hasta REGISTERED_MAX_FILES archivos GPX en su cuenta.
 * - pro: plan superior. Se activa a mano desde el dashboard de Clerk,
 *   fijando `publicMetadata.plan = "pro"` en el usuario. Almacenamiento
 *   ilimitado y puede compartir cualquier ruta con una URL pública.
 */
export type Plan = "anonymous" | "registered" | "pro";

export const ANONYMOUS_MAX_TRACKS = 3;
export const REGISTERED_MAX_FILES = 10;

export const PLAN_LABELS: Record<Plan, string> = {
  anonymous: "Sin registro",
  registered: "Registrado",
  pro: "Pro",
};

/**
 * A partir de los metadatos públicos de Clerk, determina el plan.
 * `publicMetadata.plan` es el único campo que consultamos; cualquier
 * usuario autenticado sin ese campo (o con un valor distinto de "pro")
 * se considera "registered".
 */
export function planFromPublicMetadata(publicMetadata: unknown): Plan {
  if (
    typeof publicMetadata === "object" &&
    publicMetadata !== null &&
    "plan" in publicMetadata &&
    (publicMetadata as { plan?: unknown }).plan === "pro"
  ) {
    return "pro";
  }
  return "registered";
}

export function maxFilesForPlan(plan: Plan): number | null {
  if (plan === "pro") return null; // sin límite
  if (plan === "registered") return REGISTERED_MAX_FILES;
  return 0; // el plan anónimo no almacena nada en servidor
}
