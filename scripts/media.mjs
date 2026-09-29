// Pipeline de imágenes y video del sitio.
//
// Toma los originales de assets/originales-img-featured/ y genera, por foto,
// AVIF + WebP en varios anchos (public/media/<slug>-<ancho>.<ext>). Escribe
// src/data/media.json con lo que el componente <Img> necesita para no provocar
// saltos de layout ni pedir de más: dimensiones reales, anchos disponibles, un
// LQIP (miniatura borrosa en base64) y el color dominante.
//
// El video se recomprime a H.264 sin audio con faststart (arranca a reproducir
// antes de descargarse completo) y se extrae su póster.
//
// Los nombres llevan un hash del original (<slug>-<ancho>.<hash>.<ext>): si la
// foto cambia, cambia el nombre, así que Netlify puede servirlas con caché
// inmutable de un año sin riesgo de mostrar una versión vieja.
//
// Uso: node scripts/media.mjs            (solo lo que falte)
//      node scripts/media.mjs --force    (regenera todo)
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";

const SRC = "assets/originales-img-featured";
const VIDEO_SRC = "assets/originales-video";
const OUT = "public/media";
const MANIFEST = "src/data/media.json";
const WIDTHS = [360, 640, 960, 1280, 1600, 2000];
const FORCE = process.argv.includes("--force");

// Correcciones por foto: orientación mal guardada por WhatsApp, etc.
const FIX = {
  "papel-picado-logo": (img) => img.rotate(270),
};

await mkdir(OUT, { recursive: true });

const manifest = {};
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();

for (const file of files) {
  const slug = parse(file).name;
  const source = await readFile(join(SRC, file));
  const v = createHash("sha1").update(source).update(String(FIX[slug] ?? "")).digest("hex").slice(0, 8);
  let base = sharp(source).rotate(); // respeta EXIF
  if (FIX[slug]) base = FIX[slug](base);
  const buffer = await base.toBuffer();
  const meta = await sharp(buffer).metadata();
  const { width, height } = meta;

  const widths = WIDTHS.filter((w) => w < width);
  if (!widths.length || width - widths.at(-1) > 120) widths.push(width);

  for (const w of widths) {
    const avif = join(OUT, `${slug}-${w}.${v}.avif`);
    const webp = join(OUT, `${slug}-${w}.${v}.webp`);
    if (FORCE || !existsSync(avif)) {
      await sharp(buffer).resize({ width: w }).avif({ quality: 52, effort: 6, chromaSubsampling: "4:2:0" }).toFile(avif);
    }
    if (FORCE || !existsSync(webp)) {
      await sharp(buffer).resize({ width: w }).webp({ quality: 74, effort: 6, smartSubsample: true }).toFile(webp);
    }
  }

  const lqip = await sharp(buffer).resize({ width: 20 }).blur(0.6).webp({ quality: 40 }).toBuffer();
  const { dominant } = await sharp(buffer).stats();
  const hex = `#${[dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

  manifest[slug] = {
    v,
    w: width,
    h: height,
    widths,
    color: hex,
    lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
  };
  console.log(`  ${slug.padEnd(24)} ${width}x${height}  [${widths.join(", ")}]`);
}

// Video: H.264 + póster. ffmpeg aplica la rotación del teléfono por defecto.
if (existsSync(VIDEO_SRC)) {
  for (const file of (await readdir(VIDEO_SRC)).filter((f) => /\.(mp4|mov)$/i.test(f))) {
    const slug = parse(file).name;
    const source = await readFile(join(VIDEO_SRC, file));
    const v = createHash("sha1").update(source).digest("hex").slice(0, 8);
    const mp4 = join(OUT, `${slug}.${v}.mp4`);
    if (FORCE || !existsSync(mp4)) {
      execFileSync("ffmpeg", [
        "-v", "error", "-y", "-i", join(VIDEO_SRC, file),
        "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "25", "-profile:v", "high",
        "-pix_fmt", "yuv420p", "-vf", "scale='min(720,iw)':-2", "-movflags", "+faststart", mp4,
      ]);
    }
    const poster = join(OUT, `${slug}-poster.${v}.webp`);
    if (FORCE || !existsSync(poster)) {
      const frame = execFileSync("ffmpeg", ["-v", "error", "-ss", "0.4", "-i", mp4, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"]);
      await sharp(frame).webp({ quality: 70 }).toFile(poster);
    }
    const info = await sharp(poster).metadata();
    manifest[`video:${slug}`] = { w: info.width, h: info.height, src: `/media/${slug}.${v}.mp4`, poster: `/media/${slug}-poster.${v}.webp` };
    console.log(`  video ${slug}  ${info.width}x${info.height}`);
  }
}

// Limpia versiones viejas: todo lo que no esté en el manifiesto nuevo.
const keep = new Set();
for (const [key, m] of Object.entries(manifest)) {
  if (key.startsWith("video:")) {
    keep.add(m.src.split("/").pop());
    keep.add(m.poster.split("/").pop());
  } else {
    m.widths.forEach((w) => ["avif", "webp"].forEach((ext) => keep.add(`${key}-${w}.${m.v}.${ext}`)));
  }
}
for (const file of await readdir(OUT)) {
  if (!keep.has(file)) await unlink(join(OUT, file));
}

await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 1)}\n`);
console.log(`\n  ${Object.keys(manifest).length} entradas -> ${MANIFEST}`);
