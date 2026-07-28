import { Outlet } from "react-router-dom";
import LaserCursor from "../ui/LaserCursor";
import NoiseOverlay from "../ui/NoiseOverlay";
import MobileDock from "./MobileDock";
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
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-none focus:bg-[var(--ink)] focus:px-4 focus:py-3 focus:text-[var(--bg)]"
        href="#contenido"
      >
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsAppFab />
      <MobileDock />
    </>
  );
}
