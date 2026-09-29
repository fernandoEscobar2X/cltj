import { useEffect, useRef } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import CookieConsent from "./CookieConsent";
import PromoCard from "./PromoCard";
import RouteEffects from "./RouteEffects";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import WhatsAppFab from "./WhatsAppFab";
import { scrollToTarget, startSmoothScroll } from "../../lib/smooth";
import { markNavigated } from "../../lib/intro";

const EASE = [0.76, 0, 0.24, 1];

// Transición entre páginas: una cortina de noche sube y en su borde viaja el
// haz del láser, como si cortara la página nueva. No corre en la primera carga.
function Curtain() {
  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[95] origin-top bg-[var(--night)]"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 0.85, ease: EASE, delay: 0.05 }}
    >
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--laser)] shadow-[0_0_24px_4px_var(--laser-glow)]" />
    </m.div>
  );
}

export default function SiteLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduceMotion = useReducedMotion();
  const navigations = useRef(0);
  const lastPath = useRef(location.pathname);

  useEffect(() => startSmoothScroll(), []);

  if (lastPath.current !== location.pathname) {
    lastPath.current = location.pathname;
    navigations.current += 1;
    markNavigated();
  }

  return (
    <>
      <RouteEffects />

      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-[var(--ink)] focus:px-5 focus:py-3 focus:text-[var(--paper)]"
        href="#contenido"
      >
        Saltar al contenido
      </a>

      <div className="flex min-h-svh flex-col overflow-x-clip bg-[var(--paper)]">
        <SiteHeader />
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => {
            if (!window.location.hash) scrollToTarget(0, { immediate: true, offset: 0 });
          }}
        >
          <m.main
            key={location.pathname}
            id="contenido"
            className="flex-1"
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -24, transition: { duration: 0.35, ease: EASE } }}
          >
            {outlet}
            {navigations.current > 0 && !reduceMotion ? <Curtain /> : null}
          </m.main>
        </AnimatePresence>
        <SiteFooter />
        <WhatsAppFab />
        <PromoCard />
        <CookieConsent />
      </div>
    </>
  );
}
