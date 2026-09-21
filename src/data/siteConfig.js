const whatsappNumber = "526633634237";
const whatsappText = "Hola,%20quiero%20cotizar%20una%20pieza%20personalizada";

import logoLight from "../assets/logo-tj-laser-light.webp";
import logoDark from "../assets/logo-tj-laser-dark.webp";

export const siteUrl = "https://tjlaser.com.mx";

export const siteDescription =
  "Taller en Tijuana de publicidad, regalos y piezas a medida. Cotiza por WhatsApp y recibe precio en menos de 24h.";

// Campaña de temporada. El negocio base es publicidad, regalos y eventos;
// lo estacional (papel picado hoy, otra cosa mañana) entra y sale por aquí:
// nav, banda en el home y modal de entrada. Con `active: false` desaparece todo.
const season = {
  active: true,
  label: "Temporada",
  name: "Papel picado",
  title: "Papel picado con tu marca",
  to: "/papel-picado",
  cta: "Arma el tuyo",
  // Foto real de la tira colgada en un evento → public/promo/papel-picado.webp
  // (horizontal ≥ 2400 px). Mientras sea null, el modal muestra la tira del
  // simulador sobre fondo oscuro.
  image: null,
  modal: true,
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
  tagline: "Publicidad y regalos a medida en Tijuana",
  // Hero a pantalla completa. Titular fijo en dos líneas.
  // Fondo: slideshow de fotos (crossfade) o un video en loop.
  // - slides: 3 fotos horizontales ≥ 2400 px → public/hero/01.webp, 02.webp, 03.webp
  //   (+ versión -small a 1200 px). Cada una es una pieza instalada en su lugar
  //   real, con el cliente identificable en el caption.
  // - video: opcional, 1920×1080 mp4 H.264 sin audio, 8–15 s en loop, ≤ 6 MB
  //   → public/hero/hero.mp4. Si hay video, se usa en lugar del slideshow y
  //   slides[0] es su poster.
  // TEMPORAL: mientras no existan los assets se usan fotos del portafolio.
  hero: {
    titleTop: "Publicidad y regalos",
    titleBottom: "que se lucen.",
    video: null,
    slides: [
      {
        image: "/img-featured/display-shulas.webp",
        small: "/img-featured/display-shulas-small.webp",
        alt: "Display de mostrador en acrílico espejo dorado para Shulas Boutique",
        client: "Shulas Boutique",
        piece: "Display de mostrador",
      },
      {
        image: "/img-featured/reloj-turbo.webp",
        small: "/img-featured/reloj-turbo-small.webp",
        alt: "Reloj de escritorio en acrílico grabado e iluminado para Plátanos Turbo",
        client: "Plátanos Turbo",
        piece: "Reloj grabado con luz",
      },
      {
        image: "/img-featured/llavero-espejo.webp",
        small: "/img-featured/llavero-espejo-small.webp",
        alt: "Llavero en acrílico espejo plateado",
        client: "Llaveros",
        piece: "Acrílico espejo, desde 1 pieza",
      },
    ],
  },
  ctaLabel: "Cotizar",
  ctaSecondary: "Ver piezas",
  ctaStudio: "Arma el tuyo",
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
    width: 512,
    height: 309,
  },
  shareImage: "/branding/og-cover.png",
  navItems: season.active ? [...baseNav, { to: season.to, label: season.name, seasonal: true }] : baseNav,
};
