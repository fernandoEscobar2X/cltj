import { siteUrl } from "../data/siteConfig";

// Se resuelve siempre contra el dominio canonico y no contra el host actual,
// para que los deploy previews de Netlify no publiquen canonical ni og:image
// apuntando a su propia URL temporal.
export function toAbsoluteUrl(path = "/") {
  if (!path) {
    return path;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return new URL(path, siteUrl).toString();
}
