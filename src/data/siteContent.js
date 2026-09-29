// Cada foto del home se usa una sola vez. Hero: ver siteConfig.heroCollage.
// Trabajos: `featured: true` en portfolio.js. Aquí: una por servicio.
export const services = [
  {
    id: "publicidad",
    title: "Publicidad",
    pieces: ["Letreros de acrílico", "Displays de mostrador", "QR de mesa", "Señalética"],
    image: "/img-featured/display-santiago.webp",
    imageAlt: "Display de mostrador en acrílico negro con códigos QR para Santiago Reyes Studio",
    quote: "Hola, quiero cotizar publicidad para mi negocio: letreros, displays o QR.",
    cta: "Pedir precio",
  },
  {
    id: "regalos",
    title: "Regalos",
    pieces: ["Placas y reconocimientos", "Cuadros grabados", "Llaveros con nombre", "Cajas y detalles"],
    image: "/img-featured/cuadro-mom.webp",
    imageAlt: "Cuadro grabado Love You Mom",
    quote: "Hola, quiero cotizar un regalo personalizado.",
    cta: "Pedir precio",
  },
  {
    id: "eventos",
    title: "Eventos",
    pieces: ["Números y letras", "Recuerdos para invitados", "Centros de mesa", "Letreros de bienvenida"],
    image: "/img-featured/numero-50-dorado.webp",
    imageAlt: "Número 50 dorado para decoración de evento",
    quote: "Hola, quiero cotizar decoración o recuerdos para un evento.",
    cta: "Pedir precio",
  },
];

export const process = {
  title: "Cómo trabajamos",
  steps: [
    {
      title: "Escríbenos",
      body: "Por WhatsApp. Una foto, un logo o la idea en una línea.",
    },
    {
      title: "Precio y muestra en 24 h",
      body: "Te mandamos el costo y una vista digital de la pieza.",
    },
    {
      title: "Producimos y entregamos",
      body: "En Tijuana a domicilio o recoges. Envíos a todo México.",
    },
  ],
  facts: [
    { label: "Mínimo", value: "1 pieza" },
    { label: "Materiales", value: "Acrílico, espejo, madera, MDF, LED" },
    { label: "Entrega", value: "Tijuana y envíos nacionales" },
  ],
};

export const faqs = [
  {
    question: "¿Qué necesito para cotizar?",
    answer:
      "Dinos qué quieres y para cuándo. Si tienes logo en SVG, AI o PDF mejor. Si no, una foto sirve.",
  },
  {
    question: "¿Hacen regalos y eventos, o solo negocios?",
    answer:
      "Las tres. Letreros para el local, regalos con nombre, recuerdos de boda y XV.",
  },
  {
    question: "¿Qué materiales manejan?",
    answer:
      "Acrílico transparente, espejo dorado y plateado, acrílico de color, madera, MDF, y combinaciones con LED o NFC.",
  },
  {
    question: "¿Entregan fuera de Tijuana?",
    answer:
      "En Tijuana a domicilio o pasas a recoger. Fuera de la ciudad enviamos a toda la república.",
  },
];

export const ctaFinal = {
  title: "Cotiza tu pieza",
  // Lo que pasa cuando escribes. Datos reales, sin adjetivos.
  note: "Te contesta el taller. Precio y muestra digital en menos de 24 horas.",
  // Foto opcional de fondo para el cierre: taller, entrega o pieza instalada,
  // horizontal ≥ 2400 px → public/contacto/cierre.webp. Sin foto, el cierre es
  // tipográfico sobre blanco.
  image: null,
};
