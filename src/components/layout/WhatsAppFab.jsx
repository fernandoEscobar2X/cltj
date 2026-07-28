import { Monitor, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "../../data/siteConfig";

// En movil el FAB abre WhatsApp directo; en escritorio ofrece QR o WhatsApp Web.
const DESKTOP_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

function WhatsAppGlyph({ size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.83 9.83 0 0 1 2.892 6.994c-.003 5.45-4.437 9.884-9.884 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413" />
    </svg>
  );
}

export default function WhatsAppFab() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setIsDesktop(query.matches);

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setOpen(false);
    }
  }, [isDesktop]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const onPointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const bubbleClass =
    "grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_14px_34px_rgba(37,211,102,0.42)] outline-offset-4 transition hover:scale-105 hover:bg-[#1fb455] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] active:scale-95";

  return (
    <div
      ref={containerRef}
      className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-4 z-50 flex flex-col items-end gap-3 lg:bottom-6 lg:right-6"
    >
      {open ? (
        <div
          id="whatsapp-fab-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Contactar por WhatsApp"
          className="w-[min(18rem,calc(100vw-2rem))] bg-[#0a0a0a] border border-white/10 p-6 shadow-2xl"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="grid gap-1">
               <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[#25d366]">Contacto</span>
               <h3 className="text-lg font-bold text-white tracking-tight">WhatsApp</h3>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar opciones de WhatsApp"
              className="text-white/40 hover:text-[#25d366] transition-colors"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          <div className="bg-white p-3 w-fit mb-4">
             <img
               src={siteConfig.whatsappQr}
               alt={`Código QR para abrir el chat de WhatsApp de ${siteConfig.name} al ${siteConfig.phoneDisplay}`}
               width="120"
               height="120"
               className="w-28 h-28"
             />
          </div>
          
          <p className="text-xs text-white/50 mb-6 leading-relaxed pr-4">
            Escanea con tu cámara o usa los enlaces debajo para abrir el chat.
          </p>

          <div className="grid gap-2">
            <a
              className="flex items-center justify-center gap-2 w-full min-h-[40px] bg-[#25d366] text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
              href={siteConfig.whatsappWebUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Monitor size={14} strokeWidth={2.5} />
              WhatsApp Web
            </a>
            <a
              className="flex items-center justify-center w-full min-h-[40px] text-xs font-bold uppercase tracking-widest text-white transition-colors border border-white/20 hover:bg-white hover:text-black"
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              App Escritorio
            </a>
          </div>
        </div>
      ) : null}

      {isDesktop ? (
        <button
          type="button"
          className={bubbleClass}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="whatsapp-fab-panel"
          aria-label={
            open ? "Cerrar opciones de WhatsApp" : "Cotizar por WhatsApp"
          }
          title="Cotizar por WhatsApp"
        >
          <WhatsAppGlyph />
        </button>
      ) : (
        <a
          className={bubbleClass}
          href={siteConfig.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Cotizar por WhatsApp al ${siteConfig.phoneDisplay}`}
          title="Cotizar por WhatsApp"
        >
          <WhatsAppGlyph />
        </a>
      )}
    </div>
  );
}
