import { Outlet } from "react-router-dom";
import CookieConsent from "./CookieConsent";
import LaserCursor from "../ui/LaserCursor";
import NoiseOverlay from "../ui/NoiseOverlay";
import RouteEffects from "./RouteEffects";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import WhatsAppFab from "./WhatsAppFab";

export default function SiteLayout() {
  return (
    <>
      <RouteEffects />
      <NoiseOverlay />
      <LaserCursor />

      {/* Salto al contenido: sin el, quien navega con teclado o lector de
          pantalla tiene que recorrer todo el header en cada pagina (WCAG 2.4.1).
          Solo se hace visible al recibir foco. */}
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:bg-[var(--ink)] focus:px-4 focus:py-3 focus:text-[var(--bg)]"
        href="#contenido"
      >
        Saltar al contenido
      </a>

      <div className="flex min-h-svh flex-col overflow-hidden bg-[var(--bg)] selection:bg-[var(--laser)] selection:text-[var(--ink)]">
        <SiteHeader />
        <main id="contenido" className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <WhatsAppFab />
        <CookieConsent />
      </div>
    </>
  );
}
