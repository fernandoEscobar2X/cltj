// Servidor estatico que imita a Netlify sobre dist/: sirve archivos reales,
// resuelve /ruta como /ruta/index.html, aplica las cabeceras de netlify.toml y
// devuelve 404.html con status 404 real. Sirve para auditar con Lighthouse el
// mismo comportamiento que habra en produccion.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { promisify } from "node:util";
import { brotliCompress, gzip } from "node:zlib";

const brotli = promisify(brotliCompress);
const gz = promisify(gzip);

// Netlify comprime todo lo textual. Sin esto la medicion local castiga con
// bytes que en produccion nunca viajan.
const COMPRESSIBLE = new Set([
  ".html",
  ".js",
  ".css",
  ".svg",
  ".xml",
  ".txt",
  ".json",
]);

const DIST = "dist";
export const PORT = Number(process.env.PORT ?? 4179);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

const IMMUTABLE = ["/assets/", "/fonts/"];

function cacheFor(url) {
  if (IMMUTABLE.some((prefix) => url.startsWith(prefix))) {
    return "public, max-age=31536000, immutable";
  }
  if (url.startsWith("/img-featured/") || url.startsWith("/branding/")) {
    return "public, max-age=86400, stale-while-revalidate=2592000";
  }
  return "public, max-age=0, must-revalidate";
}

// Las cabeceras se leen de netlify.toml en vez de copiarse aqui.
//
// Estaban duplicadas y se desincronizaron: al abrir la CSP para GA4 en
// netlify.toml, este servidor seguia con la politica vieja y bloqueaba el
// script de Google. La prueba local decia que la analitica no cargaba cuando en
// produccion si iba a cargar. Un servidor de pruebas que miente es peor que no
// tenerlo, asi que ahora hay una sola fuente de verdad.
const netlifyToml = await readFile("netlify.toml", "utf8");
const globalHeaderBlock =
  netlifyToml.split('for = "/*"')[1]?.split("[[")[0] ?? "";

const SECURITY = Object.fromEntries(
  [...globalHeaderBlock.matchAll(/^\s*([A-Za-z-]+)\s*=\s*"([^"]*)"/gm)].map(
    ([, key, value]) => [key, value],
  ),
);

const server = createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  const candidates = extname(url)
    ? [join(DIST, url)]
    : [join(DIST, url, "index.html"), join(DIST, `${url}.html`)];

  const accepts = req.headers["accept-encoding"] ?? "";

  const send = async (status, body, ext) => {
    const headers = {
      ...SECURITY,
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Cache-Control": cacheFor(url),
    };

    let payload = body;

    if (COMPRESSIBLE.has(ext)) {
      if (accepts.includes("br")) {
        payload = await brotli(body);
        headers["Content-Encoding"] = "br";
      } else if (accepts.includes("gzip")) {
        payload = await gz(body);
        headers["Content-Encoding"] = "gzip";
      }
    }

    headers["Content-Length"] = payload.length;
    res.writeHead(status, headers);
    res.end(payload);
  };

  for (const candidate of candidates) {
    try {
      const body = await readFile(candidate);
      await send(200, body, extname(candidate));
      return;
    } catch {
      // Se prueba el siguiente candidato.
    }
  }

  try {
    await send(404, await readFile(join(DIST, "404.html")), ".html");
  } catch {
    // dist/ puede estar a medio reconstruir; no se tira el servidor por eso.
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404");
  }
});

server.listen(PORT, () => {
  console.log(`dist servido en http://localhost:${PORT}`);
});
