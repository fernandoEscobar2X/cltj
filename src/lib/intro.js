import { useState } from "react";

// En la primera carga el HTML viene prerenderizado y ya está pintado: volver a
// animar la entrada encima (ocultar y mostrar de nuevo) solo retrasa el
// contenido y provoca un parpadeo. Las entradas se reservan para cuando se
// llega navegando desde otra página.
export function markPrerendered() {
  if (typeof document === "undefined") return;
  window.__TJ_PRERENDERED__ = (document.getElementById("root")?.childElementCount ?? 0) > 0;
}

export function markNavigated() {
  if (typeof window !== "undefined") window.__TJ_NAVIGATED__ = true;
}

/** true si este montaje debe reproducir su animación de entrada. */
export function useIntro() {
  const [intro] = useState(() => typeof window === "undefined" || !window.__TJ_PRERENDERED__ || Boolean(window.__TJ_NAVIGATED__));
  return intro;
}
