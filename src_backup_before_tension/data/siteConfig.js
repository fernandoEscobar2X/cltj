// El texto de estas URLs debe permanecer identico al que se publica en Google
// Business y en el QR estatico (public/branding/qr-whatsapp.svg).
const whatsappNumber = "526633634237";
const whatsappText =
  "Hola,%20quiero%20cotizar%20un%20proyecto%20con%20CorteL%C3%A1ser%20TJ";

// Dominio canonico. Al migrar a dominio propio se cambia aqui y ademas en
// index.html, public/robots.txt y public/sitemap.xml.
export const siteUrl = "https://cltj.netlify.app";

export const siteConfig = {
  siteUrl,
  name: "CorteLáser TJ",
  legalName: "TJ Láser",
  tagline: "Corte & grabado láser en Tijuana",
  heroKicker: "Tijuana, Baja California",
  heroTitleTop: "corte & grabado",
  heroTitleBottom: "LÁSER",
  heroDescription:
    "Displays acrílicos, llaveros, señalética y piezas personalizadas hechas con precisión láser para tu negocio.",
  location: "Tijuana, Baja California",
  locationShort: "Tijuana, B.C.",
  phoneDisplay: "663 363 4237",
  phoneIntl: "+52 663 363 4237",
  whatsappNumber,
  whatsappUrl: `https://wa.me/${whatsappNumber}?text=${whatsappText}`,
  whatsappWebUrl: `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappText}`,
  whatsappGalleryUrl:
    "https://wa.me/526633634237?text=Hola,%20vi%20su%20galer%C3%ADa%20y%20quiero%20cotizar%20un%20proyecto%20con%20CorteL%C3%A1ser%20TJ",
  whatsappQr: "/branding/qr-whatsapp.svg",
  logo: {
    src: "/branding/logo-tj-laser.png",
    width: 1090,
    height: 654,
  },
  shareImage: "/branding/og-cover.png",
  navItems: [
    { to: "/#servicios", label: "Servicios" },
    { to: "/#trabajos", label: "Trabajos" },
    { to: "/#proceso", label: "Proceso" },
    { to: "/galeria", label: "Galería" },
  ],
};
