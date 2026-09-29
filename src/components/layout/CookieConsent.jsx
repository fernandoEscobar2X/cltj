import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { setBannerOpen } from "../../lib/overlay";
import {
  analyticsConfigured,
  bootstrapAnalytics,
  readConsent,
  updateConsent,
} from "../../lib/analytics";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!analyticsConfigured()) {
      return;
    }

    const decision = readConsent();

    if (decision === "granted") {
      bootstrapAnalytics();
      return;
    }

    if (decision === "denied") {
      return;
    }

    let timer = 0;
    let observer;

    const reveal = () => {
      observer?.disconnect();
      window.clearTimeout(timer);
      setVisible(true);
    };

    timer = window.setTimeout(reveal, 8000);

    const firstSection = document.querySelector("#contenido > *");
    if (firstSection) {
      let seenInView = false;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          if (entry.intersectionRatio >= 0.4) {
            seenInView = true;
            return;
          }
          if (seenInView) {
            reveal();
          }
        },
        { threshold: [0, 0.4, 1] },
      );
      observer.observe(firstSection);
    }

    return () => {
      observer?.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    setBannerOpen(visible);
  }, [visible]);

  const decide = (granted) => {
    updateConsent(granted);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  // Compacto: una línea de texto y dos botones. En móvil ocupa el borde
  // inferior sin tapar el contenido; en desktop, una tarjeta a la izquierda.
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-3 bottom-3 z-[60] rounded-[var(--radius-l)] bg-[var(--night)] p-4 text-[var(--on-night)] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] sm:inset-x-auto sm:left-5 sm:bottom-5 sm:w-[25rem] sm:p-5"
    >
      <h2 id="cookie-title" className="sr-only">
        Cookies de medición
      </h2>
      <p className="text-[0.98rem] leading-snug text-[var(--on-night-2)]">
        Usamos cookies solo para medir visitas. Sin publicidad.{" "}
        <Link className="underline underline-offset-4 hover:text-[var(--on-night)]" to="/privacidad">
          Aviso de privacidad
        </Link>
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => decide(false)} className="btn btn--ghost-light btn--sm">
          Rechazar
        </button>
        <button type="button" onClick={() => decide(true)} className="btn btn--laser btn--sm">
          Aceptar
        </button>
      </div>
    </div>
  );
}
