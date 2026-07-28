import { useEffect, useRef, useState } from "react";

const HOVER_SELECTOR = "a, button, [role='button'], input, textarea, select, summary, label";

export default function LaserCursor() {
  const dotRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const active = () => fineHover.matches && !reduced.matches;
    const sync = () => setEnabled(active());
    sync();
    fineHover.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      fineHover.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !dotRef.current) return;
    const dot = dotRef.current;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const onMove = (event) => {
      tx = event.clientX;
      ty = event.clientY;
      if (dot.classList.contains("laser-cursor--hide")) {
        dot.classList.remove("laser-cursor--hide");
      }
    };

    const onEnter = (event) => {
      if (event.target instanceof Element && event.target.closest(HOVER_SELECTOR)) {
        dot.classList.add("laser-cursor--hover");
      }
    };

    const onLeave = (event) => {
      if (event.target instanceof Element && event.target.closest(HOVER_SELECTOR)) {
        dot.classList.remove("laser-cursor--hover");
      }
    };

    const onOut = () => dot.classList.add("laser-cursor--hide");

    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onEnter, true);
    document.addEventListener("pointerout", onLeave, true);
    document.addEventListener("pointerleave", onOut);
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onEnter, true);
      document.removeEventListener("pointerout", onLeave, true);
      document.removeEventListener("pointerleave", onOut);
    };
  }, [enabled]);

  if (!enabled) return null;

  return <div ref={dotRef} className="laser-cursor" aria-hidden="true" />;
}
