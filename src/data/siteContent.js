// Contenido del home. Cada foto es un trabajo real entregado por el taller
// (ids de src/data/media.json). El copy responde lo que alguien busca en
// Google o le pregunta a un asistente: qué hacen, en qué material, dónde,
// cuánto tarda y cómo se pide.

// Hero: muro de trabajos. Columnas que se desplazan en sentidos opuestos.
export const heroWall = [
  ["letrero-wafflix", "trofeo-mejor-portero", "papel-picado-bon-dia", "display-custom-dogs", "llavero-ana"],
  ["iman-dia-de-muertos", "display-santiago", "vinil-felica", "placa-resenas-google", "mapa-mundi-led"],
  ["llaveros-nombres", "letrero-agara", "reloj-turbo", "papel-picado-logo", "trofeo-mejor-tirador"],
  ["display-shulas", "imanes-halloween", "cuadro-mom", "placas-halcon", "display-barber"],
  ["papel-picado-logo", "llavero-espejo", "iman-dia-de-muertos", "trofeo-mejor-portero", "letrero-wafflix"],
];

// Clientes cuyo trabajo aparece en el sitio.
export const clients = [
  "Plátanos Turbo",
  "Shulas Boutique",
  "Santiago Reyes Studio",
  "Wafflix",
  "Agara",
  "Halcón Helados",
  "Custom Dogs",
  "Felica Lounge",
  "Cantera Penalty",
  "Bon Día Panadería",
  "Ana Riesco",
];

export const services = [
  {
    id: "letreros",
    title: "Letreros",
    long: "Letreros y señalética",
    description:
      "Letreros de acrílico espejo, color o transparente, con separadores o luz LED. Para fachada, recepción o mostrador.",
    tags: ["Acrílico espejo", "LED", "Fachadas"],
    media: "letrero-wafflix",
    alt: "Letrero de acrílico espejo dorado con logotipo de Wafflix en pared de concreto",
    quote: "Hola, quiero cotizar un letrero para mi negocio.",
  },
  {
    id: "displays",
    title: "Displays y QR",
    long: "Displays de mostrador con QR y NFC",
    description:
      "Tu Instagram, WhatsApp, pagos y reseñas de Google en una pieza de mostrador. Con código QR o NFC para acercar el teléfono.",
    tags: ["QR", "NFC", "Reseñas de Google"],
    media: "display-custom-dogs",
    alt: "Display de acrílico blanco para Custom Dogs con códigos QR de Facebook, WhatsApp, Google y datos de pago",
    quote: "Hola, quiero cotizar un display con QR para mi mostrador.",
  },
  {
    id: "vinil",
    title: "Vinil e imanes",
    long: "Vinil para vidrio e imanes para auto",
    description:
      "Vinil de corte e impresión para escaparates, instalado. Imanes para auto con tu marca: se quitan sin dejar pegamento y aguantan agua.",
    tags: ["Escaparates", "Imanes para auto", "Instalación"],
    media: "vinil-felica",
    alt: "Vinil de corte en el cristal de Felica Lounge Selfcare con logotipos de las especialistas y códigos QR",
    quote: "Hola, quiero cotizar vinil o imanes para mi negocio.",
  },
  {
    id: "trofeos",
    title: "Trofeos",
    long: "Trofeos y reconocimientos",
    description:
      "Trofeos en capas de acrílico espejo y reconocimientos grabados para torneos, empresas y graduaciones. Desde una pieza.",
    tags: ["Acrílico espejo", "Grabado", "Torneos"],
    media: "trofeo-mejor-portero",
    alt: "Trofeo Mejor Portero de la Cantera Penalty Cup 2026 en acrílico negro y espejo dorado",
    quote: "Hola, quiero cotizar trofeos o reconocimientos.",
  },
  {
    id: "regalos",
    title: "Regalos",
    long: "Regalos personalizados",
    description:
      "Llaveros con nombre, cuadros grabados, relojes y lámparas. Un detalle con nombre, fecha o logo, hecho en Tijuana.",
    tags: ["Llaveros con nombre", "Grabado", "Desde 1 pieza"],
    media: "llaveros-nombres",
    alt: "Llaveros de acrílico con nombres Chelo, Olivia, Roberto, Jorge y Sandra",
    quote: "Hola, quiero cotizar un regalo personalizado.",
  },
  {
    id: "eventos",
    title: "Papel picado",
    long: "Papel picado y eventos",
    description:
      "Papel picado con nombre o logo, toppers de pastel y letreros para bodas, XV, bautizos y negocios.",
    tags: ["Con nombre o logo", "Bodas y XV", "Negocios"],
    media: "papel-picado-bon-dia",
    alt: "Papel picado blanco cortado con el logotipo de Bon Día Panadería Artesanal",
    quote: "Hola, quiero cotizar papel picado o decoración para un evento.",
    to: "/papel-picado",
  },
];

// Reels de Instagram del taller. Se muestran con póster propio y el iframe de
// Instagram solo carga al dar play (no pesa en la carga inicial).
export const reels = [
  {
    id: "DchASu1Bd1V",
    poster: "reel-vinil-felica",
    title: "Vinil para Felica Lounge",
    caption: "Fachada que trabaja 24/7: marca, especialistas y QR para agendar.",
  },
  {
    id: "Dd0DqNKi-fg",
    poster: "reel-imanes",
    title: "Imanes para auto",
    caption: "Tu marca o tu temporada en el carro, sin pegamento y a prueba de agua.",
  },
];

export const process = [
  {
    word: "Escríbenos",
    body: "Por WhatsApp: una foto, tu logo o la idea en una línea. Te contesta el taller, no un bot.",
  },
  {
    word: "Aprueba",
    body: "En menos de 24 horas recibes precio y una muestra digital de la pieza. Nada se corta sin tu visto bueno.",
  },
  {
    word: "Recibe",
    body: "Producimos en Tijuana. Entregamos en la ciudad o enviamos a todo México.",
  },
];

// Preguntas como las escribe la gente. Alimentan el FAQPage del JSON-LD.
export const faqs = [
  {
    question: "¿Dónde hacen corte láser en Tijuana?",
    answer:
      "TJ Láser es un taller de corte y grabado láser en Tijuana, Baja California. Fabricamos letreros, displays, trofeos, vinil, regalos y papel picado a medida. Se cotiza por WhatsApp al 663 363 4237 y entregamos en Tijuana o enviamos a todo México.",
  },
  {
    question: "¿Cuánto cuesta un letrero de acrílico?",
    answer:
      "Depende de la medida, el tipo de acrílico (espejo, color o transparente), las capas y si lleva luz. Mándanos tu logo y una medida aproximada por WhatsApp y te damos precio y muestra digital en menos de 24 horas.",
  },
  {
    question: "¿Cuánto cuesta el papel picado personalizado?",
    answer:
      "En papel de china, el paquete de 25 piezas chico (45 × 35 cm) cuesta $200 y el grande (65 × 45 cm) $250. Hay paquetes de 50 y 100 piezas, y precio de mayoreo desde 500 piezas. Puedes armar el tuyo en tjlaser.com.mx/papel-picado.",
  },
  {
    question: "¿Hacen piezas desde una unidad?",
    answer:
      "Sí. Llaveros, trofeos, letreros y regalos se hacen desde una pieza. El papel picado se vende por paquete desde 25 piezas.",
  },
  {
    question: "¿Qué necesito para cotizar?",
    answer:
      "Qué quieres, para cuándo y, si lo tienes, tu logo en SVG, AI o PDF. Si no, una foto sirve: te decimos qué hace falta antes de producir.",
  },
  {
    question: "¿Qué materiales manejan?",
    answer:
      "Acrílico transparente, de color y espejo dorado o plateado, MDF, madera, vinil de corte e impresión, imanes y papel de china. También combinamos piezas con LED o NFC.",
  },
  {
    question: "¿Cuánto tardan?",
    answer:
      "La cotización y la muestra digital llegan en menos de 24 horas. La fabricación se confirma al aprobar, según tamaño, material y cantidad.",
  },
  {
    question: "¿Envían fuera de Tijuana?",
    answer:
      "Sí. En Tijuana entregamos o pasas a recoger, y enviamos a toda la república.",
  },
];

export const ctaFinal = {
  title: "Cotiza hoy",
  script: "y apruébala mañana",
  note: "Precio y muestra digital en menos de 24 horas. Te contesta el taller.",
};
