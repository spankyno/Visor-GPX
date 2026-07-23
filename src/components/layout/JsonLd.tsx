import {
  AUTHOR_BLOG_URL,
  AUTHOR_CONTACT_JSONLD_URL,
  AUTHOR_HUB_URL,
  AUTHOR_NAME,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants/site";

/**
 * Structured data (schema.org) para que buscadores y asistentes entiendan qué
 * es la app, quién la mantiene y dónde encontrar más información/contacto.
 */
export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (Web)",
    inLanguage: "es",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: AUTHOR_BLOG_URL,
      sameAs: [AUTHOR_BLOG_URL, AUTHOR_HUB_URL],
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    contactPoint: {
      "@type": "ContactPoint",
      url: AUTHOR_CONTACT_JSONLD_URL,
      contactType: "customer support",
      availableLanguage: ["Spanish"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
