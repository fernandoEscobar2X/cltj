import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { WhatsappLogo } from "@phosphor-icons/react";
import { siteConfig } from "../../data/siteConfig";

// Botón flotante de WhatsApp (solo móvil). En el estudio de papel picado no
// aparece: ahí la barra inferior ya tiene su propio botón de pedido.
export default function WhatsAppFab() {
  const { pathname } = useLocation();
  const [shown, setShown] = useState(pathname !== "/");

  // En el home el hero ya trae el botón de WhatsApp: el flotante aparece al salir de él.
  useEffect(() => {
    if (pathname !== "/") {
      setShown(true);
      return undefined;
    }
    const sync = () => setShown(window.scrollY > window.innerHeight * 0.85);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, [pathname]);

  if (pathname === "/papel-picado") return null;

  return (
    <a
      className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-[var(--whatsapp)] text-white shadow-[0_14px_34px_-8px_rgba(0,0,0,0.45)] transition-all duration-500 hover:scale-105 lg:hidden ${shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
      href={siteConfig.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Cotizar por WhatsApp al ${siteConfig.phoneDisplay}`}
      aria-hidden={!shown}
      tabIndex={shown ? undefined : -1}
    >
      <WhatsappLogo size={28} weight="fill" />
    </a>
  );
}
