import { useEffect, useRef, useState } from "react";
import media from "../../data/media.json";

// Video corto en bucle, sin audio. No descarga nada hasta acercarse a la
// pantalla y se pausa al salir de ella. Con movimiento reducido queda el póster.
export default function LoopVideo({ id, label, className = "" }) {
  const ref = useRef(null);
  const visible = useRef(false);
  const [near, setNear] = useState(false);
  const info = media[`video:${id}`];

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting && !reduce;
        if (entry.isIntersecting) {
          setNear(true);
          if (visible.current && el.src) el.play?.().catch(() => {});
        } else {
          el.pause?.();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Al asignar el src por primera vez, arranca si ya está a la vista.
  useEffect(() => {
    if (near && visible.current) ref.current?.play?.().catch(() => {});
  }, [near]);

  if (!info) return null;

  return (
    <video
      ref={ref}
      className={className}
      src={near ? info.src : undefined}
      poster={info.poster}
      width={info.w}
      height={info.h}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );
}
