import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  analyticsConfigured,
  bootstrapAnalytics,
  readConsent,
  updateConsent,
} from "../../lib/analytics";

// Banner de consentimiento real: gobierna si GA4 puede escribir cookies.
//
// Va abajo a la IZQUIERDA a proposito. El FAB de WhatsApp ocupa la esquina
// derecha y es el CTA principal del sitio: una barra a todo lo ancho lo taparia
// justo cuando la persona esta por escribir.
//
// No se renderiza nada hasta montar en el cliente, asi que el HTML
// prerenderizado sale limpio y quien ya decidio no ve un parpadeo del banner.
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!analyticsConfigured()) {
      return;
    }

    const decision = readConsent();

    // Solo se carga gtag si la persona acepto. Con "denied" el modo de
    // consentimiento de Google permitiria cargar el script igual y mandar pings
    // sin cookies, pero si alguien pulsa Rechazar lo esperable es que no se
    // contacte a Google en absoluto. Se prefiere perder esa medicion agregada.
    if (decision === "granted") {
      bootstrapAnalytics();
      return;
    }

    if (decision === "denied") {
      return;
    }

    // No se muestra encima del hero. En movil el banner cubria la descripcion y
    // los dos CTA, y el embudo entero de este negocio es tocar el boton de
    // WhatsApp. Como no se instala ninguna cookie mientras no haya respuesta,
    // retrasar la pregunta no afecta el cumplimiento: aparece cuando la persona
    // ya se desplazo o lleva un rato leyendo, lo que ocurra primero.
    let timer = 0;

    const reveal = () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
      setVisible(true);
    };

    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        reveal();
      }
    };

    timer = window.setTimeout(reveal, 8000);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
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
      className="fixed bottom-4 left-4 right-4 z-[60] w-auto border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl sm:right-auto sm:w-[min(24rem,calc(100vw-2rem))] lg:bottom-6 lg:left-6"
    >
      <span
        aria-hidden="true"
        className="mb-4 block h-px w-full bg-gradient-to-r from-[var(--laser)] to-transparent"
      />

      <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--laser)]">
        Privacidad
      </p>

      <h2
        id="cookie-title"
        className="mt-2 font-['Saira_Condensed'] text-[1.75rem] font-extrabold leading-[0.95] tracking-[-0.02em] text-white"
      >
        Cookies de medición
      </h2>

      <p className="mt-3 text-sm leading-6 text-white/60">
        Usamos cookies solo para saber cuánta gente visita el sitio y qué
        trabajos ve. Nada de publicidad ni de venta de datos. Puedes rechazarlas
        y el sitio funciona igual.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => decide(false)}
          className="flex min-h-11 items-center justify-center border border-white/20 bg-white/5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/15"
        >
          Rechazar
        </button>
        <button
          type="button"
          onClick={() => decide(true)}
          className="flex min-h-11 items-center justify-center bg-[var(--laser)] text-xs font-bold uppercase tracking-widest text-black transition-transform hover:scale-[1.03]"
        >
          Aceptar
        </button>
      </div>

      <Link
        // El "!" es necesario: index.css declara `a { color: inherit }` fuera de
        // las capas de Tailwind, y en la cascada una regla sin capa le gana a
        // cualquier utilidad. Sin el, este enlace heredaba el negro del body y
        // quedaba en 1.05:1 sobre el panel oscuro, es decir invisible.
        className="mt-5 inline-block font-mono text-[0.7rem] uppercase tracking-[0.18em] !text-white/60 underline underline-offset-4 transition-colors hover:!text-white"
        to="/privacidad"
      >
        Ver aviso de privacidad
      </Link>
    </div>
  );
}
