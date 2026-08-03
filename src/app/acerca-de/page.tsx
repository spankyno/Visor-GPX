import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Compass,
  Map,
  Share2,
  UserRound,
  Crown,
} from "lucide-react";
import {
  AUTHOR_CONTACT_URL,
  AUTHOR_NAME,
  SITE_NAME,
} from "@/lib/constants/site";
import { ANONYMOUS_MAX_TRACKS, REGISTERED_MAX_FILES } from "@/lib/plans";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Acerca de",
  description:
    "Qué es Visor GPX, cómo funciona y qué diferencia a los planes sin registro, registrado y Pro.",
};

const PLANS = [
  {
    icon: Map,
    name: "Sin registro",
    price: "Gratis",
    tagline: "Para probar la app o visualizar una ruta puntual.",
    features: [
      `Sube y visualiza hasta ${ANONYMOUS_MAX_TRACKS} archivos GPX a la vez`,
      "Estadísticas, perfil de elevación y animación de reproducción",
      "Exportación a GPX y GeoJSON",
      "Nada se guarda en el servidor: al cerrar la pestaña, se pierde",
    ],
  },
  {
    icon: UserRound,
    name: "Registrado",
    price: "Gratis",
    tagline: "Crea una cuenta para no perder tus rutas.",
    features: [
      `Guarda hasta ${REGISTERED_MAX_FILES} archivos GPX en tu cuenta`,
      "Accede a tus rutas guardadas desde cualquier dispositivo",
      "Todo lo del plan sin registro, sin el límite de 3 a la vez",
    ],
    highlight: true,
  },
  {
    icon: Crown,
    name: "Pro",
    price: "A solicitud",
    tagline: "Para quien comparte sus rutas con otras personas.",
    features: [
      "Almacenamiento de archivos GPX ilimitado",
      "Comparte cualquier ruta con una URL pública de solo lectura",
      "El enlace muestra el mapa (OpenStreetMap) y la ruta, sin necesidad de cuenta para quien lo abre",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <header className="flex h-14 items-center border-b border-neutral-800 px-4">
        <Link href="/" className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200">
          <ArrowLeft className="size-4" />
          Volver al visor
        </Link>
      </header>

      <main className="mx-auto max-w-3xl space-y-10 px-4 py-10">
        <section className="space-y-3 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
            <Compass className="size-7" />
          </div>
          <h1 className="font-display text-3xl font-semibold">Acerca de {SITE_NAME}</h1>
          <p className="mx-auto max-w-xl text-sm text-neutral-400">
            {SITE_NAME} es una aplicación web para visualizar, analizar y comparar
            archivos GPX sobre mapas interactivos (OpenStreetMap, IGN y Google), con
            estadísticas de distancia, desnivel y velocidad, perfil de elevación y
            animación de la ruta. Puedes usarla sin crear ninguna cuenta.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Planes de uso</h2>
          <p className="text-sm text-neutral-400">
            El almacenamiento de rutas y la compartición por URL son opcionales.
            Estos son los tres niveles disponibles:
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "flex flex-col gap-3 rounded-2xl border p-4",
                  plan.highlight
                    ? "border-amber-500/40 bg-amber-500/5"
                    : "border-neutral-800 bg-neutral-900/40"
                )}
              >
                <div className="flex items-center gap-2">
                  <plan.icon className="size-5 text-amber-400" />
                  <h3 className="font-semibold">{plan.name}</h3>
                </div>
                <p className="text-xs text-neutral-500">{plan.tagline}</p>
                <p className="text-lg font-semibold text-neutral-100">{plan.price}</p>
                <ul className="space-y-1.5 text-xs text-neutral-400">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-1.5">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-500">
            El plan Pro no se autoconcede: se solicita a {AUTHOR_NAME}, autor de la
            aplicación, a través de la{" "}
            <a
              href={AUTHOR_CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              página de contacto
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <Share2 className="size-5 text-amber-400" />
            Compartir una ruta
          </h2>
          <p className="text-sm text-neutral-400">
            Si tienes el plan Pro, cada ruta guardada en tu cuenta puede convertirse en
            un enlace público (<code className="text-neutral-300">/compartir/…</code>).
            Quien lo abra verá el mapa con la capa base de OpenStreetMap y el trazado de
            la ruta, sin necesidad de tener cuenta ni de instalar nada — un visor de solo
            lectura pensado para enviar por WhatsApp, email o publicar en una web.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold">Privacidad y datos</h2>
          <p className="text-sm text-neutral-400">
            Los archivos GPX de las cuentas registradas y Pro se almacenan de forma
            privada; solo son visibles públicamente si su propietario activa
            explícitamente la compartición de esa ruta en concreto. Los usuarios sin
            registro no almacenan ningún dato en el servidor: todo ocurre en el propio
            navegador.
          </p>
        </section>
      </main>
    </div>
  );
}
