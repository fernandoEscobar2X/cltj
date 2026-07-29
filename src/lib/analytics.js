import { siteConfig } from "../data/siteConfig";

// GA4 detras de consentimiento explicito.
//
// GA4 escribe cookies (_ga, _ga_*), asi que el script no se carga hasta que la
// persona acepta. Google ofrece el Consent Mode, que permite cargar gtag con
// "denied" y seguir mandando pings sin cookies; aqui se decidio NO hacer eso:
// si alguien pulsa Rechazar, no se contacta a Google en absoluto. Se pierde esa
// medicion agregada a cambio de que el boton signifique lo que dice.
//
// Aun asi se declara el consentimiento por defecto en denied antes de cargar
// gtag, para que ni el intervalo entre la aceptacion y la carga del script
// escriba nada sin permiso.
//
// El ID vive en siteConfig. Si esta vacio, todo esto queda inerte: ni se
// inyecta el script ni aparece el banner.

const STORAGE_KEY = "tjlaser:consent";

export const measurementId = siteConfig.analytics?.ga4Id ?? "";

/** Hosts donde NO se envia nada a Google: desarrollo y prerender. */
const EXCLUDED_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * Si hay un ID configurado. Gobierna que se MUESTRE el banner.
 * A proposito no mira el host: si tambien lo hiciera, el banner seria invisible
 * en `npm run dev` y no habria forma de revisarlo antes de publicar.
 */
export function analyticsConfigured() {
  return Boolean(measurementId) && typeof window !== "undefined";
}

/**
 * Si ademas se puede ENVIAR. En localhost el banner se ve pero no se carga
 * gtag, para que ni el prerender ni las pruebas locales inflen las metricas.
 */
export function analyticsAvailable() {
  if (!analyticsConfigured()) {
    return false;
  }

  return !EXCLUDED_HOSTS.has(window.location.hostname);
}

export function readConsent() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    // Modo privado o almacenamiento bloqueado: se trata como sin decision.
    return null;
  }
}

export function storeConsent(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Si no se puede guardar, la eleccion vale solo para esta sesion.
  }
}

function gtag() {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

let bootstrapped = false;

/** Inyecta gtag con el consentimiento por defecto en denegado. */
export function bootstrapAnalytics() {
  if (bootstrapped || !analyticsAvailable()) {
    return;
  }

  bootstrapped = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = gtag;

  // Este bloque tiene que ejecutarse ANTES de cargar el script de Google.
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });

  if (readConsent() === "granted") {
    gtag("consent", "update", { analytics_storage: "granted" });
  }

  gtag("js", new Date());
  // send_page_view en false: es un SPA, las vistas se mandan a mano en cada
  // cambio de ruta. Si se dejara en true, solo contaria la primera carga.
  gtag("config", measurementId, {
    send_page_view: false,
    anonymize_ip: true,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Vista inicial. RouteEffects solo reporta CAMBIOS de ruta, y al montarse
  // gtag todavia no existe (o no habia consentimiento), asi que esa primera
  // vista se perdia: quien aceptaba en la home y se iba quedaba registrado con
  // cero paginas vistas. gtag encola en dataLayer, asi que llamarlo aqui
  // funciona aunque el script aun no haya terminado de cargar.
  trackPageView(window.location.pathname + window.location.hash);
}

export function updateConsent(granted) {
  storeConsent(granted ? "granted" : "denied");

  // Al rechazar no se hace nada mas: si gtag nunca se cargo, no hay a quien
  // avisar, y cargarlo solo para decirle "denegado" contradice la decision.
  if (!granted || !analyticsAvailable()) {
    return;
  }

  bootstrapAnalytics();
  window.gtag?.("consent", "update", { analytics_storage: "granted" });
}

export function trackPageView(path, title) {
  if (!analyticsAvailable() || !window.gtag) {
    return;
  }

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: title ?? document.title,
  });
}
