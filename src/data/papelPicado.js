// Motor de papel picado.
//
// Cada plantilla se dibuja a partir de un asset real: un PNG con fondo
// transparente en `public/papel/<id>.png` (proporción 900x560, ideal
// 1800x1120). Los pixeles opacos son papel; los transparentes son corte. El
// color del pixel no importa, el motor lo pinta con el color elegido. Texto y
// logo se recortan (quedan como hueco) dentro de las zonas definidas en
// coordenadas 900x560.
//
// Mientras una plantilla no tenga `image`, el motor genera su corte de forma
// procedimental (papelPatterns.jsx) respetando las mismas zonas. Al pegar el
// PNG real solo cambia `image`; todo lo demás (texto, logo, colores, tira,
// exportación, cotización) es el mismo código.

export const papelColors = [
  { id: "rojo", label: "Rojo", hex: "#d3212d" },
  { id: "rosa", label: "Rosa mexicano", hex: "#e4007c" },
  { id: "naranja", label: "Naranja", hex: "#f26b21" },
  { id: "amarillo", label: "Amarillo", hex: "#f2c200" },
  { id: "verde", label: "Verde", hex: "#1c9c4a" },
  { id: "azul", label: "Azul", hex: "#1b6fc2" },
  { id: "morado", label: "Morado", hex: "#6f2da8" },
  { id: "blanco", label: "Blanco", hex: "#f6f3ee" },
  { id: "negro", label: "Negro", hex: "#1a1a1a" },
  { id: "oro", label: "Oro", hex: "#c9a24e" },
];

// Colores que acompañan al panel central cuando la tira es multicolor.
export const papelTiraPalette = ["rosa", "amarillo", "verde", "azul", "naranja", "morado"];

export const papelTemplates = [
  {
    id: "fiesta",
    name: "Fiesta",
    use: "XV, bodas y celebraciones",
    image: null,
    textBox: { x: 120, y: 360, w: 660, h: 100 },
    logoBox: { x: 375, y: 120, w: 150, h: 150 },
  },
  {
    id: "negocio",
    name: "Negocio",
    use: "Logo al centro, para el local o la feria",
    image: null,
    textBox: { x: 150, y: 380, w: 600, h: 96 },
    logoBox: { x: 300, y: 110, w: 300, h: 210 },
  },
  {
    id: "corazon",
    name: "Corazón",
    use: "Aniversarios, mamá, un detalle",
    image: null,
    textBox: { x: 150, y: 410, w: 600, h: 90 },
    logoBox: { x: 380, y: 170, w: 140, h: 120 },
  },
  {
    id: "celebracion",
    name: "Celebración",
    use: "Cumpleaños, graduación, la fecha",
    image: null,
    textBox: { x: 110, y: 200, w: 680, h: 170 },
    logoBox: { x: 400, y: 420, w: 100, h: 80 },
  },
];

export const papelSizes = [
  { id: "chico", label: "Chico", dims: "20 × 30 cm" },
  { id: "mediano", label: "Mediano", dims: "30 × 40 cm" },
  { id: "grande", label: "Grande", dims: "40 × 60 cm" },
];

export const papelMaterials = [
  { id: "papel", label: "Papel de china", note: "Interior" },
  { id: "plastico", label: "Plástico", note: "Exterior, aguanta agua" },
];

export const papelDefaults = {
  templateId: "fiesta",
  colorId: "rojo",
  text: "TU MARCA",
  sizeId: "mediano",
  materialId: "papel",
  quantity: 5,
  multicolor: true,
  logoScale: 1,
};

export const papelLimits = {
  maxChars: 22,
  minQuantity: 1,
  maxQuantity: 200,
  logoMaxBytes: 4 * 1024 * 1024,
  logoTypes: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
};
