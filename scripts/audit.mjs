// Corre Lighthouse contra el dist ya servido y resume categorias y metricas.
// Uso: node scripts/audit.mjs [url] [mobile|desktop]
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import puppeteer from "puppeteer";

const url = process.argv[2] ?? "http://localhost:4179/";
const preset = process.argv[3] ?? "mobile";

// Se usa el Chromium que ya trae puppeteer, para no depender de la ruta de
// instalacion del Chrome del sistema.
const chrome = await chromeLauncher.launch({
  chromePath: await puppeteer.executablePath(),
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

const desktopConfig = {
  extends: "lighthouse:default",
  settings: {
    formFactor: "desktop",
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
    },
  },
};

try {
  const result = await lighthouse(
    url,
    { port: chrome.port, output: "json", logLevel: "error" },
    preset === "desktop" ? desktopConfig : undefined,
  );

  const { categories, audits } = result.lhr;

  console.log(`\n  ${url}  [${preset}]`);
  console.log("  " + "-".repeat(48));
  for (const key of ["performance", "accessibility", "best-practices", "seo"]) {
    const category = categories[key];
    if (!category) continue;
    console.log(
      `  ${category.title.padEnd(18)} ${String(Math.round(category.score * 100)).padStart(3)}`,
    );
  }

  console.log("  " + "-".repeat(48));
  for (const id of [
    "first-contentful-paint",
    "largest-contentful-paint",
    "total-blocking-time",
    "cumulative-layout-shift",
    "speed-index",
  ]) {
    if (audits[id]) {
      console.log(`  ${audits[id].title.padEnd(28)} ${audits[id].displayValue}`);
    }
  }

  const failed = Object.values(audits).filter(
    (a) =>
      a.score !== null &&
      a.score < 1 &&
      a.scoreDisplayMode !== "informative" &&
      a.scoreDisplayMode !== "notApplicable",
  );

  const lcpElement = audits["largest-contentful-paint-element"];
  if (lcpElement?.details?.items?.[0]?.items?.[0]?.node) {
    console.log(
      `\n  Elemento LCP: ${lcpElement.details.items[0].items[0].node.snippet?.slice(0, 140)}`,
    );
  }

  const blocking = audits["render-blocking-resources"] ?? audits["render-blocking-insight"];
  if (blocking?.details?.items?.length) {
    console.log("\n  Bloquea el render:");
    for (const item of blocking.details.items.slice(0, 6)) {
      console.log(`   - ${item.url ?? item.name ?? JSON.stringify(item).slice(0, 90)}`);
    }
  }

  const contrast = audits["color-contrast"];
  if (contrast?.details?.items?.length) {
    console.log("\n  Contraste insuficiente:");
    for (const item of contrast.details.items.slice(0, 6)) {
      console.log(`   - ${item.node?.snippet?.slice(0, 120)}`);
      console.log(`     ${item.node?.explanation ?? ""}`);
    }
  }

  if (failed.length) {
    console.log("\n  Auditorias con puntos pendientes:");
    for (const a of failed) {
      const saving = a.details?.overallSavingsMs
        ? ` (~${Math.round(a.details.overallSavingsMs)} ms)`
        : "";
      console.log(`   - [${a.id}] ${a.title}${saving}`);
    }
  }
} finally {
  try {
    await chrome.kill();
  } catch {
    // En Windows el borrado del perfil temporal a veces falla; no importa.
  }
}
