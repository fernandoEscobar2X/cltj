import media from "../../data/media.json";

// Imagen del pipeline (scripts/media.mjs): <picture> con AVIF y WebP en varios
// anchos, dimensiones reales (sin saltos de layout) y un LQIP borroso de fondo
// mientras llega la foto. `sizes` debe describir el ancho real en pantalla
// para que el navegador pida el archivo justo.
export default function Img({
  id,
  alt = "",
  sizes = "100vw",
  className = "",
  imgClassName = "",
  priority = false,
  eager = false,
  fit = "cover",
  placeholder = true,
  style,
  ...rest
}) {
  const m = media[id];
  if (!m) return null;
  const srcset = (ext) => m.widths.map((w) => `${mediaUrl(id, w, ext)} ${w}w`).join(", ");
  const fallback = m.widths.find((w) => w >= 960) ?? m.widths.at(-1);

  return (
    <picture
      className={`media-frame ${className}`}
      style={{ ...(placeholder ? { "--lqip": `url(${m.lqip})` } : null), backgroundColor: m.color, ...style }}
    >
      <source type="image/avif" srcSet={srcset("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
      <img
        src={mediaUrl(id, fallback)}
        alt={alt}
        width={m.w}
        height={m.h}
        loading={priority || eager ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${imgClassName}`}
        {...rest}
      />
    </picture>
  );
}

export function mediaInfo(id) {
  return media[id];
}

/** URL de una versión de la foto (por defecto la más grande, en WebP). */
export function mediaUrl(id, width, ext = "webp") {
  const m = media[id];
  if (!m) return "";
  const w = width ?? m.widths.at(-1);
  return `/media/${id}-${w}.${m.v}.${ext}`;
}
