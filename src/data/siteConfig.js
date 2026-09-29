const whatsappNumber = "526633634237";
const whatsappText = "Hola,%20quiero%20cotizar%20una%20pieza%20personalizada";

import logoLight from "../assets/logo-tj-laser-light.webp";
import logoDark from "../assets/logo-tj-laser-dark.webp";

export const siteUrl = "https://tjlaser.com.mx";

export const siteDescription =
  "Taller de corte láser en Tijuana: letreros de acrílico, displays con QR, vinil, trofeos, regalos y papel picado personalizado. Precio y muestra digital en menos de 24 horas por WhatsApp.";

// Campaña de temporada. El negocio base es publicidad, regalos y eventos; lo
// estacional (papel picado hoy, otra cosa mañana) entra y sale por aquí: nav,
// tarjeta de promoción y la sección del home. Con `active: false` desaparece.
const season = {
  active: true,
  name: "Papel picado",
  title: "Papel picado con tu nombre",
  body: "Elige uno de nuestros 20 diseños, escribe el nombre y míralo cortado al instante.",
  to: "/papel-picado",
  cta: "Diseñar el mío",
  // Tarjeta de promoción: aparece una vez cada `promoDays` días.
  promo: true,
  promoDays: 14,
};

const baseNav = [
  { to: "/#servicios", label: "Servicios" },
  { to: "/#trabajos", label: "Trabajos" },
  { to: "/galeria", label: "Galería" },
];

export const siteConfig = {
  season,
  siteUrl,
  name: "TJ Láser",
  legalName: "TJ Láser",
  alternateName: "CorteLáser TJ",
  tagline: "Corte láser, publicidad y regalos en Tijuana",
  ctaLabel: "Cotizar por WhatsApp",
  ctaShort: "Cotizar",
  location: "Tijuana, Baja California",
  locationShort: "Tijuana, B.C.",
  phoneDisplay: "663 363 4237",
  phoneIntl: "+52 663 363 4237",
  whatsappNumber,
  whatsappUrl: `https://wa.me/${whatsappNumber}?text=${whatsappText}`,
  whatsappWebUrl: `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappText}`,
  whatsappGalleryUrl: `https://wa.me/${whatsappNumber}?text=Hola,%20vi%20las%20piezas%20y%20quiero%20cotizar%20una%20a%20medida`,
  whatsappQr: "/branding/qr-whatsapp.svg",
  social: {
    instagram: "https://www.instagram.com/tj_laser_/",
  },
  analytics: {
    ga4Id: "G-RVDJ10LG2Z",
  },
  logo: {
    src: logoLight,
    dark: logoDark,
    width: 220,
    height: 127,
  },
  shareImage: "/branding/og-cover.png",
  navItems: season.active
    ? [baseNav[0], baseNav[1], { to: season.to, label: season.name, seasonal: true }, baseNav[2]]
    : baseNav,
};
