// Composición de un banderín. Se ejecuta una vez por cambio (diseño, color,
// texto, logo o tamaño en pantalla), nunca por cuadro: la animación solo mueve
// los lienzos que salen de aquí.
//
// Salida por banderín:
// - paper:  el papel ya recortado, con color, textura de papel de china, luz y
//           el doblez superior por donde pasa el hilo.
// - shade:  la misma silueta en negro, para oscurecer el banderín cuando gira.
// - shadow: la sombra difusa que proyecta sobre la pared (con los huecos).
// - glow:   halo de color para la escena de noche (luz a contraluz).
import { papelFonts, papelSvg } from "../../../data/papelPicado";

const designCache = new Map();
const fontCache = new Map();
let grainTile = null;

/** Carga el SVG del diseño como imagen lista para dibujar en canvas. */
export function loadDesign(id) {
  if (!designCache.has(id)) {
    designCache.set(
      id,
      new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = papelSvg(id);
      }),
    );
  }
  return designCache.get(id);
}

/** Registra la fuente stencil una sola vez (no forma parte del CSS global). */
export function loadFont(key) {
  const font = papelFonts[key];
  if (!font || typeof FontFace === "undefined") return Promise.resolve();
  if (!fontCache.has(key)) {
    const face = new FontFace(font.family, `url(${font.url}) format("woff2")`, { weight: String(font.weight) });
    fontCache.set(
      key,
      face.load().then((loaded) => {
        document.fonts.add(loaded);
        return loaded;
      }).catch(() => null),
    );
  }
  return fontCache.get(key);
}

function makeCanvas(w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w));
  canvas.height = Math.max(1, Math.round(h));
  return canvas;
}

// Textura de papel de china: fibras finas + arrugas suaves. Se genera una vez
// en un tile de 256 px y se repite como patrón.
function getGrain() {
  if (grainTile) return grainTile;
  const size = 256;
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext("2d");
  const data = ctx.createImageData(size, size);
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < data.data.length; i += 4) {
    const v = 128 + (rand() - 0.5) * 34;
    data.data[i] = data.data[i + 1] = data.data[i + 2] = v;
    data.data[i + 3] = 255;
  }
  ctx.putImageData(data, 0, 0);
  // Arrugas: trazos largos, muy suaves, en diagonal.
  ctx.globalAlpha = 0.09;
  for (let i = 0; i < 26; i += 1) {
    const light = rand() > 0.5;
    ctx.strokeStyle = light ? "#fff" : "#000";
    ctx.lineWidth = 1 + rand() * 5;
    ctx.beginPath();
    const x = rand() * size;
    const y = rand() * size;
    const a = -0.9 + rand() * 0.6;
    ctx.moveTo(x - Math.cos(a) * 200, y - Math.sin(a) * 200);
    ctx.quadraticCurveTo(x + rand() * 40, y + rand() * 40, x + Math.cos(a) * 200, y + Math.sin(a) * 200);
    ctx.stroke();
  }
  grainTile = canvas;
  return grainTile;
}

function fontString(key, px) {
  const font = papelFonts[key] ?? papelFonts.saira;
  return `${font.weight} ${px}px "${font.family}", "Arial Black", sans-serif`;
}

// Texto recto que llena su caja: una línea, o dos si así queda más grande.
function cutFitText(ctx, layout, text, W, H) {
  const bx = layout.x * W;
  const by = layout.y * H;
  const bw = layout.w * W;
  const bh = layout.h * H;
  const measureAt = 100;
  ctx.font = fontString(layout.font, measureAt);
  const oneLine = ctx.measureText(text).width || 1;
  const single = Math.min(bh * 0.86, (bw / oneLine) * measureAt);

  let lines = [text];
  let size = single;
  const words = text.split(/\s+/);
  if (layout.type !== "arc" && words.length > 1 && single < bh * 0.62) {
    // Partimos donde las dos líneas queden más parejas.
    let best = null;
    for (let i = 1; i < words.length; i += 1) {
      const a = words.slice(0, i).join(" ");
      const b = words.slice(i).join(" ");
      const widest = Math.max(ctx.measureText(a).width, ctx.measureText(b).width) || 1;
      const s = Math.min((bh * 0.86) / 2.05, (bw / widest) * measureAt);
      if (!best || s > best.s) best = { s, lines: [a, b] };
    }
    if (best && best.s > single * 1.08) {
      lines = best.lines;
      size = best.s;
    }
  }

  ctx.font = fontString(layout.font, size);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lineH = size * 1.02;
  const cx = bx + bw / 2;
  const cy = by + bh / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, cx, cy + (i - (lines.length - 1) / 2) * lineH);
  });
}

// Texto en arco (diseño Charro): cada letra sobre el círculo, girada.
function cutArcText(ctx, layout, text, W, H) {
  const cx = layout.cx * W;
  const cy = layout.cy * H;
  const r = layout.r * W;
  let size = layout.size * W;
  ctx.font = fontString(layout.font, size);
  const spacing = size * 0.04;
  const widths = [...text].map((ch) => ctx.measureText(ch).width + spacing);
  let total = widths.reduce((a, b) => a + b, 0);
  let angle = total / r;
  if (angle > layout.maxAngle) {
    const k = layout.maxAngle / angle;
    size *= k;
    ctx.font = fontString(layout.font, size);
    widths.forEach((_, i) => {
      widths[i] *= k;
    });
    total *= k;
    angle = layout.maxAngle;
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let acc = -angle / 2;
  [...text].forEach((ch, i) => {
    const a = acc + widths[i] / 2 / r;
    ctx.save();
    ctx.translate(cx + r * Math.sin(a), cy - r * Math.cos(a));
    ctx.rotate(a);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
    acc += widths[i] / r;
  });
}

/**
 * Silueta de corte a partir del logo del cliente. Si la imagen trae
 * transparencia, se corta lo opaco; si no, lo que contrasta con el fondo
 * (se detecta el fondo por los bordes). `invert` fuerza lo contrario.
 */
export async function logoSilhouette(file, invert = false) {
  const bitmap = await createImageBitmap(file).catch(async () => {
    // SVG: createImageBitmap no siempre lo acepta, pasamos por <img>.
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await img.decode();
    URL.revokeObjectURL(url);
    return img;
  });
  const max = 700;
  const k = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * k));
  const h = Math.max(1, Math.round(bitmap.height * k));
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0, w, h);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;

  let transparent = 0;
  let borderLum = 0;
  let borderCount = 0;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = (y * w + x) * 4;
      if (d[i + 3] < 200) transparent += 1;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) {
        borderLum += (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
        borderCount += 1;
      }
    }
  }
  const hasAlpha = transparent > w * h * 0.02;
  const darkBackground = borderLum / borderCount < 0.5;

  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;
  for (let i = 0; i < d.length; i += 4) {
    const lum = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
    let cut;
    if (hasAlpha) cut = d[i + 3] / 255;
    else {
      const contrast = darkBackground ? lum : 1 - lum;
      cut = Math.min(1, Math.max(0, (contrast - 0.35) / 0.25));
    }
    if (invert) cut = hasAlpha ? (d[i + 3] > 20 ? 1 - cut : 0) : 1 - cut;
    const a = Math.round(cut * 255);
    d[i] = d[i + 1] = d[i + 2] = 0;
    d[i + 3] = a;
    if (a > 40) {
      const p = i / 4;
      const x = p % w;
      const y = (p / w) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  ctx.putImageData(img, 0, 0);
  if (maxX <= minX || maxY <= minY) return null;
  // Recorta al contenido para que el logo llene su zona.
  const out = makeCanvas(maxX - minX + 1, maxY - minY + 1);
  out.getContext("2d").drawImage(canvas, -minX, -minY);
  return out;
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Compone el banderín a `width` px de ancho.
 * @returns {{paper, shade, shadow, glow, w, h, pad}}
 */
export function composePanel({ design, image, color, text, font, logo, logoScale = 1, mode = "text", width, night = false }) {
  const [vw, vh] = design.vb;
  const W = Math.round(width);
  const H = Math.round((width * vh) / vw);

  // 1. Silueta del diseño (papel opaco, cortes transparentes).
  const paper = makeCanvas(W, H);
  const ctx = paper.getContext("2d");
  ctx.drawImage(image, 0, 0, W, H);

  // 2. Cortes del cliente.
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "#000";
  const layout = design.text ? { ...design.text, font: font || design.text.font } : null;
  const showLogo = design.kind === "libre" && mode === "logo" && logo && design.logo;
  if (showLogo) {
    const box = design.logo;
    const bw = box.w * W * logoScale;
    const bh = box.h * H * logoScale;
    const k = Math.min(bw / logo.width, bh / logo.height);
    const lw = logo.width * k;
    const lh = logo.height * k;
    const cx = (box.x + box.w / 2) * W;
    const cy = (box.y + box.h / 2) * H;
    ctx.drawImage(logo, cx - lw / 2, cy - lh / 2, lw, lh);
  } else if (layout) {
    const raw = (text ?? "").trim() || layout.default;
    const value = layout.upper ? raw.toUpperCase() : raw;
    if (value) {
      if (layout.type === "arc") cutArcText(ctx, layout, value, W, H);
      else cutFitText(ctx, layout, value, W, H);
    }
  }

  // Copia de la silueta final: se usa para re-enmascarar tras la textura.
  const silhouette = makeCanvas(W, H);
  silhouette.getContext("2d").drawImage(paper, 0, 0);

  // 3. Color.
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = color.hex;
  ctx.fillRect(0, 0, W, H);

  // 4. Textura de papel de china y luz: arriba más claro, abajo más denso.
  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = ctx.createPattern(getGrain(), "repeat");
  ctx.save();
  ctx.scale(W / 900, W / 900);
  ctx.fillRect(0, 0, 900, (H * 900) / W);
  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "soft-light";
  const light = ctx.createLinearGradient(0, 0, W * 0.25, H);
  light.addColorStop(0, "rgba(255,255,255,0.55)");
  light.addColorStop(0.55, "rgba(255,255,255,0)");
  light.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, W, H);

  // 5. Doblez superior: franja por donde pasa el hilo, con su pliegue.
  const fold = H * 0.045;
  ctx.globalCompositeOperation = "source-atop";
  const band = ctx.createLinearGradient(0, 0, 0, fold * 1.6);
  band.addColorStop(0, "rgba(0,0,0,0.26)");
  band.addColorStop(0.62, "rgba(0,0,0,0.06)");
  band.addColorStop(0.64, "rgba(255,255,255,0.28)");
  band.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, W, fold * 1.6);

  // Re-enmascarar: overlay/soft-light no deben pintar en los huecos.
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(silhouette, 0, 0);
  ctx.globalCompositeOperation = "source-over";

  // 6. Silueta negra para sombrear cuando el banderín gira.
  const shade = makeCanvas(W, H);
  const sctx = shade.getContext("2d");
  sctx.drawImage(silhouette, 0, 0);
  sctx.globalCompositeOperation = "source-in";
  sctx.fillStyle = "#000";
  sctx.fillRect(0, 0, W, H);

  // 7. Sombra proyectada: silueta tintada del color del papel (el papel de
  // china deja pasar luz) y difuminada. Se usa shadowBlur, que funciona en
  // todos los navegadores (ctx.filter no en Safari viejo).
  const blur = Math.max(2, W * 0.012);
  const pad = Math.ceil(blur * 3);
  const shadow = makeCanvas(W + pad * 2, H + pad * 2);
  const shctx = shadow.getContext("2d");
  const [r, g, b] = hexToRgb(color.hex);
  shctx.shadowColor = `rgba(${Math.round(r * 0.25)},${Math.round(g * 0.22)},${Math.round(b * 0.25)},0.9)`;
  shctx.shadowBlur = blur;
  shctx.shadowOffsetX = W + pad * 4;
  shctx.drawImage(silhouette, pad - (W + pad * 4), pad);

  // 8. Halo para la escena de noche.
  let glow = null;
  if (night) {
    const gpad = Math.ceil(W * 0.08);
    glow = makeCanvas(W + gpad * 2, H + gpad * 2);
    const gctx = glow.getContext("2d");
    gctx.shadowColor = `rgba(${r},${g},${b},0.85)`;
    gctx.shadowBlur = W * 0.06;
    gctx.shadowOffsetX = W + gpad * 4;
    gctx.drawImage(silhouette, gpad - (W + gpad * 4), gpad);
  }

  return { paper, shade, shadow, glow, w: W, h: H, pad, gpad: glow ? Math.ceil(W * 0.08) : 0 };
}
