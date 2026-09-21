import { siteConfig } from "../data/siteConfig";

export function waUrl(message) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function genericQuoteMessage() {
  return "Hola, quiero cotizar una pieza personalizada.";
}

export function serviceQuoteMessage(serviceTitle) {
  return `Hola, quiero cotizar: ${serviceTitle}.`;
}

export function papelQuoteMessage({ template, text, color, multicolor, size, material, quantity, hasLogo, link }) {
  return [
    "Hola, quiero cotizar papel picado personalizado.",
    `Plantilla: ${template}`,
    `Texto: ${text || "(sin texto)"}`,
    `Color: ${color}${multicolor ? " (tira multicolor)" : " (tira de un color)"}`,
    `Tamaño: ${size}`,
    `Material: ${material}`,
    `Cantidad: ${quantity} ${quantity === 1 ? "tira" : "tiras"}`,
    `Logo: ${hasLogo ? "sí, lo adjunto en el chat" : "sin logo"}`,
    link ? `Diseño: ${link}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
