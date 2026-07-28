import { useSyncExternalStore } from "react";

// Señal compartida de "hay una capa a pantalla completa abierta" (menu movil,
// lightbox). Sirve para que las animaciones decorativas del fondo se detengan
// mientras algo las tapa: seguir animando debajo de una capa opaca no se ve, y
// en movil le roba cuadros a la transicion que si se ve.
let open = false;
const listeners = new Set();

export function setOverlayOpen(value) {
  if (open === value) {
    return;
  }

  open = value;
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOverlayOpen() {
  // El snapshot del servidor es false: durante el prerender no hay capas.
  return useSyncExternalStore(
    subscribe,
    () => open,
    () => false,
  );
}
