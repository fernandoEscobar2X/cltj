// Catálogo del motor de papel picado.
//
// Los 20 diseños salen del PDF del taller (assets/papel-picado/disenos.pdf) con
// scripts/papel-from-pdf.py: cada uno es un SVG en public/papel/<id>.svg con el
// papel en negro y los cortes transparentes. El motor lo pinta del color elegido.
//
// Reglas del negocio:
// - Un diseño por pedido: toda la tira lleva el mismo corte.
// - Un color por pedido.
// - Solo papel de china.
//
// Tipos de diseño:
// - "nombre": el diseño trae un texto que se cambia por el del cliente
//   (se quitó del SVG; el motor lo corta en `text`).
// - "libre": tiene un espacio vacío para nombre o logo.
// - "listo": se pide tal cual.
//
// Coordenadas de `text` y `logo`: fracciones del ancho (x, w, size, r) y del
// alto (y, h, cy) del diseño.

// Versión de los SVG de public/papel/: Netlify los sirve con caché inmutable,
// así que al volver a exportar los diseños hay que subir este número.
export const papelAssetVersion = "2609";
export const papelSvg = (id) => `/papel/${id}.svg?v=${papelAssetVersion}`;

export const papelKinds = {
  nombre: { label: "Con nombre", short: "Nombre" },
  libre: { label: "Con nombre o logo", short: "Nombre o logo" },
  listo: { label: "Listo para pedir", short: "Listo" },
};

// Stencil con que se corta el texto del cliente: las letras llevan puentes
// para que los centros (O, A, R, B...) no se caigan del papel.
export const papelFonts = {
  saira: { family: "Saira Stencil", weight: 760, url: "/fonts/saira-stencil.woff2", label: "Moderna" },
  rotulo: { family: "Big Shoulders Stencil", weight: 800, url: "/fonts/big-shoulders-stencil.woff2", label: "Rótulo" },
  stardos: { family: "Stardos Stencil", weight: 700, url: "/fonts/stardos-stencil-700.woff2", label: "Clásica" },
};

export const papelDesigns = [
  { id: "cielito-lindo", name: "Cielito Lindo", occasion: "Fiesta mexicana", kind: "listo", color: "durazno", vb: [516.5, 396.8] },
  { id: "bebe", name: "Bebé", occasion: "Baby shower", kind: "listo", color: "naranja", vb: [516.5, 396.8] },
  {
    id: "charro",
    name: "Charro",
    occasion: "Cumpleaños",
    kind: "nombre",
    color: "cafe",
    vb: [516.5, 396.8],
    // Texto en arco, como el FRANCISCO original.
    text: { type: "arc", cx: 0.4945, cy: 1.186, r: 0.644, size: 0.128, maxAngle: 1.3, font: "saira", default: "FRANCISCO", max: 12, upper: true },
  },
  { id: "paloma", name: "Paloma", occasion: "Bautizo y comunión", kind: "listo", color: "gris", vb: [508.8, 378.4] },
  { id: "baby-shower-palomas", name: "Baby shower palomas", occasion: "Baby shower", kind: "listo", color: "turquesa", vb: [506.9, 395.1] },
  { id: "baby-shower-flores", name: "Baby shower flores", occasion: "Baby shower", kind: "listo", color: "orquidea", vb: [516.5, 396.8] },
  { id: "primera-comunion", name: "Primera comunión", occasion: "Comunión", kind: "listo", color: "rosa", vb: [508.9, 378.4] },
  {
    id: "bautizo",
    name: "Mi bautizo",
    occasion: "Bautizo",
    kind: "nombre",
    color: "cielo",
    vb: [508.8, 378.4],
    text: { type: "line", x: 0.215, y: 0.125, w: 0.57, h: 0.13, font: "stardos", default: "MI BAUTIZO", max: 16, upper: true },
  },
  {
    id: "boda-iniciales",
    name: "Boda iniciales",
    occasion: "Boda",
    kind: "nombre",
    color: "lavanda",
    vb: [506.9, 387.8],
    text: { type: "line", x: 0.385, y: 0.44, w: 0.215, h: 0.2, font: "stardos", default: "J&I", max: 5, upper: true },
  },
  {
    id: "boda-nombres",
    name: "Boda nombres",
    occasion: "Boda",
    kind: "nombre",
    color: "verde",
    vb: [506.9, 387.7],
    text: { type: "line", x: 0.12, y: 0.325, w: 0.76, h: 0.145, font: "saira", default: "Jesús & Isela", max: 20 },
  },
  {
    id: "marco",
    name: "Marco",
    occasion: "Negocio o evento",
    kind: "libre",
    color: "lima",
    vb: [504.5, 377.0],
    text: { type: "fit", x: 0.2, y: 0.39, w: 0.6, h: 0.22, font: "saira", default: "TU NOMBRE", max: 22, upper: true },
    logo: { x: 0.22, y: 0.385, w: 0.56, h: 0.23 },
  },
  {
    id: "fiesta-roja",
    name: "Fiesta",
    occasion: "Día de Muertos o fiesta",
    kind: "libre",
    color: "rojo",
    vb: [504.5, 378.8],
    text: { type: "fit", x: 0.27, y: 0.405, w: 0.46, h: 0.25, font: "saira", default: "TU NOMBRE", max: 18, upper: true },
    logo: { x: 0.33, y: 0.39, w: 0.34, h: 0.29 },
  },
  { id: "dinosaurios", name: "Dinosaurios", occasion: "Cumpleaños infantil", kind: "listo", color: "indigo", vb: [506.9, 387.7] },
  { id: "happy-halloween", name: "Happy Halloween", occasion: "Halloween", kind: "listo", color: "ciruela", vb: [507.0, 371.8] },
  { id: "calabaza", name: "Calabaza", occasion: "Halloween", kind: "listo", color: "naranja", vb: [507.0, 391.2] },
  {
    id: "corazones",
    name: "Corazones",
    occasion: "Boda, XV o aniversario",
    kind: "libre",
    color: "rosa",
    vb: [506.9, 381.8],
    text: { type: "fit", x: 0.22, y: 0.3, w: 0.56, h: 0.27, font: "saira", default: "TU NOMBRE", max: 20, upper: true },
    logo: { x: 0.33, y: 0.285, w: 0.34, h: 0.31 },
  },
  {
    id: "abanicos",
    name: "Abanicos",
    occasion: "Negocio o evento",
    kind: "libre",
    color: "amarillo",
    vb: [508.8, 355.7],
    text: { type: "fit", x: 0.22, y: 0.07, w: 0.56, h: 0.19, font: "saira", default: "TU NOMBRE", max: 18, upper: true },
    logo: { x: 0.37, y: 0.07, w: 0.26, h: 0.5 },
  },
  { id: "catrina", name: "Catrina", occasion: "Día de Muertos", kind: "listo", color: "indigo", vb: [504.5, 373.0] },
  { id: "muneca", name: "Muñeca", occasion: "Fiesta mexicana", kind: "listo", color: "rosa", vb: [506.8, 387.8] },
  { id: "calavera-charra", name: "Calavera charra", occasion: "Día de Muertos", kind: "listo", color: "morado", vb: [509.7, 408.7] },
];

// Colores de papel de china: los del PDF del taller + blanco y negro.
export const papelColors = [
  { id: "rosa", label: "Rosa mexicano", hex: "#ec008c" },
  { id: "rojo", label: "Rojo", hex: "#ed1c24" },
  { id: "naranja", label: "Naranja", hex: "#f5821f" },
  { id: "durazno", label: "Durazno", hex: "#f9a870" },
  { id: "amarillo", label: "Amarillo", hex: "#ffc707" },
  { id: "lima", label: "Verde limón", hex: "#a6ce38" },
  { id: "verde", label: "Verde", hex: "#00a650" },
  { id: "turquesa", label: "Turquesa", hex: "#55c5d0" },
  { id: "cielo", label: "Azul cielo", hex: "#00aeef" },
  { id: "indigo", label: "Azul rey", hex: "#2e3092" },
  { id: "lavanda", label: "Lila", hex: "#c7c4e2" },
  { id: "orquidea", label: "Orquídea", hex: "#c656a0" },
  { id: "morado", label: "Morado", hex: "#a54786" },
  { id: "ciruela", label: "Uva", hex: "#5d1c57" },
  { id: "cafe", label: "Café", hex: "#a25642" },
  { id: "gris", label: "Gris", hex: "#a7a9ac" },
  { id: "blanco", label: "Blanco", hex: "#f7f4ee" },
  { id: "negro", label: "Negro", hex: "#1c1b1f" },
];

// Tabulador del taller. Precio por paquete, en MXN.
export const papelSizes = [
  { id: "chico", label: "Chico", dims: "45 × 35 cm", prices: { 25: 200, 50: 300, 100: 550 } },
  { id: "grande", label: "Grande", dims: "65 × 45 cm", prices: { 25: 250, 50: 400, 100: 650 } },
];

export const papelPackages = [25, 50, 100];
export const papelWholesaleFrom = 500;

export const papelDefaults = {
  designId: "charro",
  colorId: "cafe",
  text: "",
  sizeId: "chico",
  pack: 50,
  logoScale: 1,
  mode: "text", // en diseños "libre": "text" | "logo"
};

export const papelLimits = {
  logoMaxBytes: 6 * 1024 * 1024,
  logoTypes: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
};

export const findDesign = (id) => papelDesigns.find((d) => d.id === id) ?? papelDesigns[0];
export const findColor = (id) => papelColors.find((c) => c.id === id) ?? papelColors[0];
export const findSize = (id) => papelSizes.find((s) => s.id === id) ?? papelSizes[0];

/** Precio del paquete, o null si es mayoreo (se cotiza aparte). */
export function papelPrice(sizeId, pack) {
  if (pack === "mayoreo") return null;
  return findSize(sizeId).prices[pack] ?? null;
}

export const formatMXN = (value) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value);
