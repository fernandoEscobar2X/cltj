import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { siteConfig } from "../../data/siteConfig";
import { setOverlayOpen } from "../../lib/overlay";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// El panel vive en su propio componente para que montarse y desmontarse
// coincida con abrir y cerrar: asi el bloqueo de scroll y el foco se limpian
// solos, sin depender de que alguien acuerde deshacerlos.
function MenuPanel({ onClose }) {
  const panelRef = useRef(null);

  // Antes esto corria durante el render y sin limpieza: si el menu llegaba a
  // desmontarse abierto, el body se quedaba bloqueado y la pagina ya no
  // scrolleaba. Se guarda el valor previo en vez de asumir "unset", para no
  // pisar el bloqueo que aplica el lightbox.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Apaga las animaciones decorativas del fondo mientras el panel esta arriba,
    // para que la transicion de apertura tenga la maquina para ella sola.
    setOverlayOpen(true);

    return () => {
      document.body.style.overflow = previousOverflow;
      setOverlayOpen(false);
    };
  }, []);

  // Escape para cerrar y foco atrapado dentro del panel: es un dialogo a
  // pantalla completa, y sin esto el teclado sigue navegando la pagina de atras.
  useEffect(() => {
    const panel = panelRef.current;

    if (!panel) {
      return undefined;
    }

    const previouslyFocused = document.activeElement;
    const getFocusable = () => Array.from(panel.querySelectorAll(FOCUSABLE));

    getFocusable()[0]?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = getFocusable();

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);

      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [onClose]);

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      className="fixed inset-0 z-[100] flex flex-col bg-[#050505] text-white overflow-y-auto"
    >
      {/* Header Area inside Menu */}
      <div className="flex min-h-[76px] items-center justify-end px-6 md:px-12 py-3 border-b border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white transition-all hover:bg-[var(--laser)] hover:text-black hover:scale-110 active:scale-95"
          aria-label="Cerrar menú"
        >
          <X size={24} strokeWidth={2} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col justify-center px-8 md:px-16 gap-6 py-10">
        <p className="font-mono text-sm tracking-[0.3em] text-[var(--laser)] uppercase mb-4">
          Navegación
        </p>
        {siteConfig.navItems.map((item, i) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
          >
            {item.to.startsWith("/galeria") ? (
              <NavLink
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `block font-['Saira_Condensed'] text-[clamp(3.5rem,10vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.02em] transition-all active:scale-95 ${
                    isActive
                      ? "text-[var(--laser)]"
                      : "text-white hover:text-white/70"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <Link
                to={item.to}
                onClick={onClose}
                className="block font-['Saira_Condensed'] text-[clamp(3.5rem,10vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.02em] text-white hover:text-white/70 transition-all active:scale-95"
              >
                {item.label}
              </Link>
            )}
          </motion.div>
        ))}
      </nav>

      {/* Footer Area inside Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="p-8 md:p-16 border-t border-white/10"
      >
        <a
          href={siteConfig.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full h-16 items-center justify-center gap-2 rounded-full bg-[var(--laser)] text-black text-sm font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(198,91,255,0.3)] transition-all active:scale-95"
        >
          Cotizar por WhatsApp
        </a>
      </motion.div>
    </motion.div>
  );
}

export default function MobileMenu({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && <MenuPanel onClose={onClose} />}
    </AnimatePresence>
  );
}
