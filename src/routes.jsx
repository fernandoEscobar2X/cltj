import { lazy, Suspense } from "react";

// Páginas en su propio chunk: el home (la mayoría de las visitas) no carga el
// motor de papel picado ni la galería.
//
// Para no parpadear sobre el HTML prerenderizado, main.jsx espera el chunk de
// la ruta de entrada antes del primer render; así la página se pinta de una
// vez, sin pasar por el fallback de Suspense. Las demás se precargan en
// segundo plano en cuanto el navegador queda libre.
const loaders = {
  "/papel-picado": () => import("./pages/PapelPicadoPage"),
  "/galeria": () => import("./pages/GalleryPage"),
  "/privacidad": () => import("./pages/PrivacyPage"),
};

const resolved = {};
const lazies = Object.fromEntries(Object.entries(loaders).map(([path, load]) => [path, lazy(load)]));

export function preloadRoute(path) {
  const load = loaders[path];
  if (!load || resolved[path]) return Promise.resolve();
  return load().then((mod) => {
    resolved[path] = mod.default;
  });
}

export function prefetchRoutes() {
  const run = () => Object.keys(loaders).forEach((path) => preloadRoute(path).catch(() => {}));
  if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 4000 });
  else window.setTimeout(run, 2500);
}

export function RoutePage({ path }) {
  const Ready = resolved[path];
  if (Ready) return <Ready />;
  const Lazy = lazies[path];
  return (
    <Suspense fallback={<div className="min-h-[100svh] bg-[var(--paper)]" />}>
      <Lazy />
    </Suspense>
  );
}
