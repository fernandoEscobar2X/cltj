import { useSyncExternalStore } from "react";

// Señales compartidas entre capas que se pisan en pantalla.
// - overlay: hay algo a pantalla completa (menú, lightbox). Las animaciones
//   decorativas de fondo se pausan y el scroll suave se detiene.
// - banner: el aviso de cookies está visible; la tarjeta de promoción espera
//   a que se cierre para no apilar dos avisos.
function createSignal(initial = false) {
  let value = initial;
  const listeners = new Set();
  return {
    set(next) {
      if (value === next) return;
      value = next;
      listeners.forEach((listener) => listener());
    },
    get: () => value,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const overlay = createSignal(false);
const banner = createSignal(false);

export const setOverlayOpen = (value) => overlay.set(value);
export const setBannerOpen = (value) => banner.set(value);
export const isOverlayOpen = () => overlay.get();
export const subscribeOverlay = overlay.subscribe;

// El snapshot del servidor es false: durante el prerender no hay capas.
export function useOverlayOpen() {
  return useSyncExternalStore(overlay.subscribe, overlay.get, () => false);
}

export function useBannerOpen() {
  return useSyncExternalStore(banner.subscribe, banner.get, () => false);
}
