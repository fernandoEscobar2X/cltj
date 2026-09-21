import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  const decide = (granted) => {
    updateConsent(granted);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed bottom-4 left-4 right-4 z-[60] w-auto rounded-[var(--radius-media)] border border-[var(--line)] bg-[var(--bg-raised)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] sm:right-auto sm:w-[min(24rem,calc(100vw-2rem))] lg:bottom-6 lg:left-6"
    >
      <h2 id="cookie-title" className="m-0 text-xl font-semibold tracking-tight">
        Cookies de medición
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
        Usamos cookies solo para saber cuánta gente visita el sitio y qué trabajos ve. Nada de
        publicidad ni de venta de datos. Puedes rechazarlas y el sitio funciona igual.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => decide(false)} className="cut-btn cut-btn--ghost">
          Rechazar
        </button>
        <button type="button" onClick={() => decide(true)} className="cut-btn cut-btn--accent">
          Aceptar
        </button>
      </div>
      <Link
        className="mt-4 inline-block text-sm text-[var(--ink-mute)] underline underline-offset-4 hover:text-[var(--ink)]"
        to="/privacidad"
      >
        Ver aviso de privacidad
      </Link>
    </div>
  );
}
