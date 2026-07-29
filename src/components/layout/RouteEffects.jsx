import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../../lib/analytics";

export default function RouteEffects() {
  const location = useLocation();

  // En un SPA la navegacion no recarga la pagina, asi que GA4 solo registraria
  // la primera vista. Cada cambio de ruta se reporta a mano. Si falta el ID o
  // no hay consentimiento, trackPageView no hace nada.
  useEffect(() => {
    trackPageView(location.pathname + location.hash);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);

      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }

      return;
    }

    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return null;
}
