import { Link, useLocation } from "react-router-dom";
import Button from "../ui/Button";
import { siteConfig } from "../../data/siteConfig";

export default function MobileDock() {
  const location = useLocation();
  const onGallery = location.pathname.startsWith("/galeria");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[rgba(243,234,215,0.94)] px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
      <div className="layout-shell grid gap-3">
        {onGallery ? (
          <Link className="cut-btn cut-btn--ghost cut-btn--sm" to="/">
            Volver al inicio
          </Link>
        ) : null}
        <Button href={siteConfig.whatsappUrl} size="sm" variant="laser" className="w-full">
          Cotizar por WhatsApp
        </Button>
      </div>
    </div>
  );
}
