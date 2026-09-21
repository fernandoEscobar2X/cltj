import { Outlet } from "react-router-dom";
import CookieConsent from "./CookieConsent";
import PromoModal from "./PromoModal";
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

      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:bg-[var(--ink)] focus:px-4 focus:py-3 focus:text-[var(--bg)]"
        href="#contenido"
      >
        Saltar al contenido
      </a>

      <div className="flex min-h-svh flex-col overflow-x-clip bg-[var(--bg)] selection:bg-[var(--laser)] selection:text-[#111113]">
        <SiteHeader />
        <main id="contenido" className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <WhatsAppFab />
        <PromoModal />
        <CookieConsent />
      </div>
    </>
  );
}
