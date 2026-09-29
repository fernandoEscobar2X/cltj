import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../../lib/analytics";
import { scrollToTarget } from "../../lib/smooth";

export default function RouteEffects() {
  const location = useLocation();

  // En un SPA la navegacion no recarga la pagina, asi que GA4 solo registraria
  // la primera vista. Cada cambio de ruta se reporta a mano. Si falta el ID o
  // no hay consentimiento, trackPageView no hace nada.
  useEffect(() => {
    trackPageView(location.pathname + location.hash);
  }, [location.pathname, location.hash]);

  // Con hash (#servicios) se baja a la sección cuando la página nueva ya se
  // montó; sin hash, SiteLayout sube al inicio al terminar la transición.
  useEffect(() => {
    if (!location.hash) return undefined;
    const timer = window.setTimeout(() => scrollToTarget(location.hash), 80);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return null;
}
