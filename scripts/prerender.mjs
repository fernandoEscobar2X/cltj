// Prerender de las rutas publicas contra el Chrome del sistema.
//
// El sitio es un SPA: sin esto, el HTML que reciben los crawlers y el primer
// paint del navegador son un <div id="root"> vacio. En vez de migrar la app a
// SSR (que obligaria a volver SSR-safe a framer-motion, al cursor laser y al
// lightbox), se sirve el build, se visita cada ruta con Chrome headless y se
// guarda el DOM ya renderizado.
//
// El cliente sigue montando con createRoot: React reemplaza el markup estatico
// al hidratar. El markup prerenderizado existe para el primer paint y para los
// crawlers que no ejecutan JS.
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import puppeteer from "puppeteer";

const DIST = "dist";
const PORT = 4178;
// La ultima entrada no es una ruta real: se visita una URL inexistente para que
// React monte NotFoundPage y el resultado se guarda como dist/404.html, que es
// lo que Netlify sirve (con status 404 de verdad) ante cualquier ruta que no
// exista. Por eso tampoco hace falta el redirect catch-all del SPA.
const ROUTES = [
  { path: "/", out: "index.html" },
  // galeria.html y no galeria/index.html: con la carpeta, Netlify respondia a
  // /galeria con un 301 hacia /galeria/, mientras el canonical y el sitemap
  // apuntaban a /galeria. Google entraba por una URL que redirigia y encontraba
  // un canonical de vuelta a esa misma. Como archivo suelto responde 200 directo
  // y las tres cosas coinciden.
  { path: "/galeria", out: "galeria.html" },
  { path: "/__404__", out: "404.html" },
];



// El shell se lee UNA vez, antes de escribir nada. Si se releyera del disco en
// cada peticion, /galeria se cargaria sobre el dist/index.html ya prerenderizado
// de la home y heredaria sus etiquetas (canonical de "/", su JSON-LD, etc.).
const shell = await readFile(join(DIST, "index.html"));

const server = createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  const ext = extname(url);

  // Toda navegacion (sin extension o .html) recibe el shell limpio; del disco
  // solo salen assets. Asi un dist/ con sobras de una corrida anterior no puede
  // colarse como shell.
  if (ext === "" || ext === ".html") {
    res.writeHead(200, { "Content-Type": MIME[".html"] });
    res.end(shell);
    return;
  }

  const filePath = join(DIST, url);

  try {
    const body = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[extname(filePath)] ?? "application/octet-stream",
    });
    res.end(body);
  } catch {
    // Fallback SPA: siempre el shell original, nunca lo ya prerenderizado.
    res.writeHead(200, { "Content-Type": MIME[".html"] });
    res.end(shell);
  }
});

await new Promise((resolve) => server.listen(PORT, resolve));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  for (const route of ROUTES) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}${route.path}`, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    // Espera a que React haya montado algo dentro de #root.
    await page.waitForFunction(
      () => document.querySelector("#root")?.childElementCount > 0,
      { timeout: 30000 },
    );

    // framer-motion anima via Web Animations API: el estilo inline se queda con
    // el valor inicial (opacity: 0) aunque en pantalla ya se vea. Si se captura
    // asi, el HTML estatico pinta en blanco y el prerender no sirve de nada.
    // Se recorre la pagina para disparar los whileInView, se terminan todas las
    // animaciones y se fija en el inline el valor ya computado.
    await page.evaluate(async () => {
      const pause = (ms) => new Promise((r) => setTimeout(r, ms));
      const step = Math.round(window.innerHeight * 0.75);

      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await pause(60);
      }

      window.scrollTo(0, 0);
      await pause(120);

      document.getAnimations().forEach((animation) => {
        try {
          animation.finish();
        } catch {
          // Animaciones infinitas (marquee) no se pueden terminar; se dejan.
        }
      });

      await pause(60);

      // index.html trae og:/twitter: estaticos (para crawlers sin JS) y
      // react-helmet añade los suyos por ruta al hidratar, asi que el HTML
      // capturado queda con ambos. En /galeria eso dejaba og:url y og:title
      // duplicados con valores distintos, y los lectores de Open Graph suelen
      // quedarse con el primero: compartir la galeria mostraba la home.
      // Helmet inserta despues, asi que se conserva la ultima de cada clave.
      const seen = new Map();
      for (const meta of document.querySelectorAll(
        'head meta[property^="og:"], head meta[name^="twitter:"]',
      )) {
        const key = meta.getAttribute("property") ?? meta.getAttribute("name");
        if (seen.has(key)) {
          seen.get(key).remove();
        }
        seen.set(key, meta);
      }

      for (const el of document.querySelectorAll("#root [style]")) {
        const computed = getComputedStyle(el);

        if (el.style.opacity !== "") {
          el.style.opacity = computed.opacity;
        }

        if (el.style.transform !== "") {
          el.style.transform =
            computed.transform === "none" ? "none" : computed.transform;
        }

        // Los Reveal que quedaron fuera de vista conservan su estado inicial
        // (opacity 0 + translate). En el HTML estatico eso seria contenido
        // invisible, asi que se fijan en su estado final. El unico origen de
        // opacity inline en esta app es framer-motion, no hay falsos positivos.
        if (el.style.opacity === "0") {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      }
    });

    let html = await page.content();

    // El <link rel=stylesheet> es lo unico que bloquea el primer render: obliga
    // a una ida y vuelta extra antes de pintar nada. Comprimida, la hoja pesa
    // menos que ese round trip, asi que se incrusta y se elimina la peticion.
    // El resto de assets (JS, fuentes, imagenes) no bloquean.
    for (const [, tag, href] of html.matchAll(
      /(<link[^>]+rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>)/g,
    )) {
      const css = await readFile(join(DIST, href), "utf8");
      html = html.replace(tag, `<style>${css}</style>`);
    }

    const outPath = join(DIST, route.out);

    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html);

    console.log(
      `prerender ${route.path.padEnd(12)} -> ${outPath} (${(html.length / 1024).toFixed(0)} KB)`,
    );
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
