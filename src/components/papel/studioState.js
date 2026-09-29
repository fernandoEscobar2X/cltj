import {
  findColor,
  findDesign,
  findSize,
  formatMXN,
  papelDefaults,
  papelDesigns,
  papelColors,
  papelFonts,
  papelPackages,
  papelPrice,
  papelSizes,
  papelWholesaleFrom,
} from "../../data/papelPicado";

// Estado del estudio en la URL: el diseño se comparte con un enlace y
// sobrevive a recargar. El logo no viaja (es un archivo local del cliente).
const KEYS = { d: "designId", c: "colorId", t: "text", s: "sizeId", p: "pack", m: "mode", f: "font" };

export function readStudioState(search = typeof window !== "undefined" ? window.location.search : "") {
  const state = { ...papelDefaults, font: null };
  const params = new URLSearchParams(search);
  for (const [short, key] of Object.entries(KEYS)) {
    const raw = params.get(short);
    if (raw !== null) state[key] = raw;
  }
  if (!papelDesigns.some((d) => d.id === state.designId)) state.designId = papelDefaults.designId;
  const design = findDesign(state.designId);
  // Sin color en la URL, el diseño llega con el color con el que se dibujó.
  if (!params.get("c")) state.colorId = design.color;
  if (!papelColors.some((c) => c.id === state.colorId)) state.colorId = design.color;
  if (!papelSizes.some((s) => s.id === state.sizeId)) state.sizeId = papelDefaults.sizeId;
  state.pack = state.pack === "mayoreo" ? "mayoreo" : Number(state.pack);
  if (state.pack !== "mayoreo" && !papelPackages.includes(state.pack)) state.pack = papelDefaults.pack;
  state.mode = state.mode === "logo" ? "logo" : "text";
  if (state.font && !papelFonts[state.font]) state.font = null;
  state.text = String(state.text ?? "").slice(0, design.text?.max ?? 22);
  return state;
}

export function studioSearch(state) {
  const params = new URLSearchParams();
  if (state.designId) params.set("d", state.designId);
  if (state.colorId) params.set("c", state.colorId);
  if (state.text) params.set("t", state.text);
  if (state.sizeId) params.set("s", state.sizeId);
  if (state.pack) params.set("p", String(state.pack));
  if (state.mode === "logo") params.set("m", "logo");
  if (state.font) params.set("f", state.font);
  return params.toString();
}

export function studioUrl(state) {
  const q = studioSearch(state);
  return `/papel-picado${q ? `?${q}` : ""}`;
}

export function quoteSummary(state, { hasLogo = false, link = "" } = {}) {
  const design = findDesign(state.designId);
  const color = findColor(state.colorId);
  const size = findSize(state.sizeId);
  const price = papelPrice(state.sizeId, state.pack);
  const personal =
    design.kind === "listo"
      ? "Diseño listo (sin cambios)"
      : state.mode === "logo" && design.kind === "libre"
        ? hasLogo
          ? "Con logo (lo adjunto en este chat)"
          : "Con logo (lo mando por aquí)"
        : `Texto: ${(state.text || design.text?.default || "").trim()}`;
  const qty = state.pack === "mayoreo" ? `Mayoreo (${papelWholesaleFrom}+ piezas)` : `Paquete de ${state.pack} piezas`;
  return [
    "Hola, quiero pedir papel picado personalizado.",
    `Diseño: ${design.name} (${design.id})`,
    personal,
    state.font && state.mode !== "logo" ? `Letra: ${papelFonts[state.font].label}` : null,
    `Color: ${color.label}`,
    `Medida: ${size.label} ${size.dims}`,
    qty,
    price ? `Total: ${formatMXN(price)}` : "Precio: por cotizar",
    "Material: papel de china",
    link ? `Mi diseño: ${link}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
