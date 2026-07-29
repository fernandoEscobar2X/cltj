import { portfolioItems } from "./portfolio";
import { services } from "./siteContent";
import { siteConfig } from "./siteConfig";
import { toAbsoluteUrl } from "../lib/url";

// Fuente unica de los datos estructurados.
//
// Antes cada pagina declaraba su propio LocalBusiness suelto, asi que Google y
// los motores de respuesta veian dos negocios distintos sin relacion. Aqui se
// define la entidad UNA vez con un @id estable y el resto de las paginas la
// referencian por ese @id. Esa consolidacion es lo que permite que un motor
// generativo (Gemini, ChatGPT, Perplexity) resuelva "quien hace corte laser en
// Tijuana" hacia una sola ficha coherente en vez de fragmentos sueltos.

export const businessId = `${toAbsoluteUrl("/")}#business`;
export const websiteId = `${toAbsoluteUrl("/")}#website`;

/** Referencia ligera a la entidad de negocio, para enlazar desde otras paginas. */
export const businessRef = { "@id": businessId };

const businessDescription =
  "Corte y grabado láser en Tijuana. Displays acrílicos, llaveros, señalética y piezas personalizadas con entrega express.";

export const businessSchema = {
  "@type": "LocalBusiness",
  "@id": businessId,
  name: siteConfig.name,
  alternateName: siteConfig.legalName,
  url: toAbsoluteUrl("/"),
  logo: toAbsoluteUrl(siteConfig.shareImage),
  telephone: siteConfig.phoneIntl,
  description: businessDescription,
  inLanguage: "es-MX",
  currenciesAccepted: "MXN",
  areaServed: [
    { "@type": "City", name: "Tijuana" },
    { "@type": "State", name: "Baja California" },
    { "@type": "Country", name: "México" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tijuana",
    addressRegion: "Baja California",
    addressCountry: "MX",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteConfig.phoneIntl,
    contactType: "customer service",
    areaServed: "MX",
    availableLanguage: ["es"],
  },
  // sameAs es lo que le permite a Google unir este sitio con los perfiles
  // sociales y tratarlos como una sola entidad. Solo perfiles verificados: una
  // URL equivocada aqui asocia el negocio con una cuenta ajena.
  sameAs: Object.values(siteConfig.social),
  // Fotos reales de trabajos entregados: refuerzan la ficha local con
  // evidencia visual en vez de solo la imagen de portada.
  image: portfolioItems
    .filter((item) => item.featured)
    .slice(0, 6)
    .map((item) => toAbsoluteUrl(item.src)),
  // Lo que el negocio VENDE. Antes se declaraban piezas del portafolio como
  // Product, pero esas son trabajos ya entregados, no oferta disponible:
  // describir el catalogo real es lo que contesta "que servicios ofrecen".
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: `Servicios de ${siteConfig.name}`,
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        areaServed: { "@type": "City", name: "Tijuana" },
        provider: businessRef,
      },
    })),
  },
  // Señal tematica explicita para motores generativos.
  knowsAbout: [
    "Corte láser",
    "Grabado láser",
    "Displays de acrílico",
    "Señalética comercial",
    "Llaveros personalizados",
    "Llaveros NFC",
    "Reconocimientos y placas grabadas",
    "Decoración personalizada",
    ...new Set(portfolioItems.map((item) => item.material)),
  ],
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": websiteId,
  url: toAbsoluteUrl("/"),
  name: siteConfig.name,
  description: businessDescription,
  inLanguage: "es-MX",
  publisher: businessRef,
};

/** Construye un BreadcrumbList a partir de pares [nombre, ruta]. */
export function breadcrumbSchema(trail) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: toAbsoluteUrl(path),
    })),
  };
}
