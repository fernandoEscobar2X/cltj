import Lenis from "lenis";
import { subscribeOverlay, isOverlayOpen } from "./overlay";

// Scroll suave (Lenis) solo con mouse o trackpad. En pantallas táctiles el
// navegador ya tiene inercia nativa y Lenis la empeoraría; con movimiento
// reducido tampoco se activa. Todo lo demás (framer-motion useScroll, anclas)
// sigue leyendo window.scrollY, que Lenis mantiene.
let lenis = null;

export function startSmoothScroll() {
  if (typeof window === "undefined" || lenis) return () => {};
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduce) return () => {};

  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.11,
    wheelMultiplier: 0.95,
    anchors: { offset: -80 },
  });

  const unsubscribe = subscribeOverlay(() => {
    if (isOverlayOpen()) lenis?.stop();
    else lenis?.start();
  });

  return () => {
    unsubscribe();
    lenis?.destroy();
    lenis = null;
  };
}

/** Lleva el scroll a un punto; sin Lenis cae al scroll nativo. */
export function scrollToTarget(target, { immediate = false, offset = -80 } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { immediate, offset, duration: 1.2 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: immediate ? "instant" : "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: immediate ? "instant" : "smooth" });
}
