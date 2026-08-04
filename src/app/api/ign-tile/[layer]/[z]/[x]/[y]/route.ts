import { NextResponse } from "next/server";

interface IgnLayerConfig {
  endpoint: string;
  layer: string;
  format: string;
}

/**
 * Definición de las capas IGN accesibles a través de este proxy.
 * Añadir aquí cualquier otra capa WMTS del IGN que se quiera exponer.
 */
const IGN_LAYERS: Record<string, IgnLayerConfig> = {
  base: {
    endpoint: "https://www.ign.es/wmts/ign-base",
    layer: "IGNBaseTodo",
    format: "image/png",
  },
  pnoa: {
    endpoint: "https://www.ign.es/wmts/pnoa-ma",
    layer: "OI.OrthoimageCoverage",
    format: "image/jpeg",
  },
};

/** Tesela 1x1 totalmente transparente, usada como fallback si el IGN no responde una imagen */
const TRANSPARENT_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64"
);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ layer: string; z: string; x: string; y: string }> }
) {
  const { layer, z, x, y } = await params;
  const config = IGN_LAYERS[layer];

  if (!config) {
    return new NextResponse("Capa IGN desconocida", { status: 404 });
  }

  const upstreamUrl =
    `${config.endpoint}?service=WMTS&request=GetTile&version=1.0.0` +
    `&layer=${encodeURIComponent(config.layer)}&style=default` +
    `&format=${encodeURIComponent(config.format)}&tilematrixset=GoogleMapsCompatible` +
    `&tilematrix=${z}&tilerow=${y}&tilecol=${x}`;

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        // El servidor del IGN parece exigir un Referer propio para servir GetTile
        // (GetCapabilities funciona sin él, GetTile devuelve 400 sin él).
        Referer: "https://www.ign.es/",
        "User-Agent": "Mozilla/5.0 (compatible; VisorGPX/1.0; +https://visor-gpx.vercel.app)",
        Accept: "image/*",
      },
      // Revalidar cada día; las teselas cartográficas cambian muy poco.
      next: { revalidate: 60 * 60 * 24 },
    });

    const contentType = upstream.headers.get("content-type") ?? "";

    if (!upstream.ok || !contentType.startsWith("image/")) {
      // El IGN devolvió error (probablemente un XML de ServiceExceptionReport)
      // en vez de una imagen: servimos una tesela transparente para no romper el mapa.
      return new NextResponse(TRANSPARENT_PNG, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=300",
          "X-Ign-Proxy-Upstream-Status": String(upstream.status),
        },
      });
    }

    const bytes = await upstream.arrayBuffer();
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return new NextResponse(TRANSPARENT_PNG, {
      status: 200,
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=60" },
    });
  }
}
