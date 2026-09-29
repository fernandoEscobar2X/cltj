import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, InstagramLogo, Phone, X } from "@phosphor-icons/react";
import { siteConfig } from "../../data/siteConfig";
import { setOverlayOpen } from "../../lib/overlay";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
const EASE = [0.76, 0, 0.24, 1];
// El círculo nace del botón de menú (arriba a la derecha).
const ORIGIN = "calc(100% - 3.2rem) 2.25rem";

function MenuPanel({ onClose }) {
  const panelRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setOverlayOpen(true);
    return () => {
      document.body.style.overflow = previousOverflow;
      setOverlayOpen(false);
    };
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;
    const previouslyFocused = document.activeElement;
    const getFocusable = () => Array.from(panel.querySelectorAll(FOCUSABLE));
    getFocusable()[0]?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) return;
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
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose]);

  const links = [{ to: "/", label: "Inicio" }, ...siteConfig.navItems];

  return (
    <m.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[var(--night)] text-[var(--on-night)]"
      initial={reduceMotion ? { opacity: 0 } : { clipPath: `circle(0% at ${ORIGIN})` }}
      animate={reduceMotion ? { opacity: 1 } : { clipPath: `circle(150% at ${ORIGIN})` }}
      exit={reduceMotion ? { opacity: 0 } : { clipPath: `circle(0% at ${ORIGIN})`, transition: { duration: 0.5, ease: EASE } }}
      transition={{ duration: 0.75, ease: EASE }}
    >
      <div className="shell flex h-[var(--header-h)] shrink-0 items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          className="flex h-12 items-center gap-3 rounded-full bg-white/10 pl-4 pr-2 text-[0.98rem] font-semibold"
          aria-label="Cerrar menú"
        >
          Cerrar
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--laser)] text-[var(--ink)]">
            <X size={16} weight="bold" />
          </span>
        </button>
      </div>

      <nav className="shell flex flex-1 flex-col justify-center gap-1 py-6" aria-label="Menú móvil">
        {links.map((item, index) => (
          <div key={item.to} className="overflow-hidden">
            <m.div
              initial={reduceMotion ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={item.to}
                onClick={onClose}
                className="flex items-baseline gap-3 font-display text-[clamp(3.2rem,15vw,5.5rem)] font-extrabold uppercase leading-[1.02]"
              >
                {item.label}
                {item.seasonal ? <span className="t-script text-[1.9rem] normal-case text-[var(--laser)]">nuevo</span> : null}
              </Link>
            </m.div>
          </div>
        ))}
      </nav>

      <m.div
        className="shell grid gap-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn--laser btn--lg w-full">
          {siteConfig.ctaLabel}
          <ArrowUpRight size={18} weight="bold" />
        </a>
        <div className="flex items-center justify-between gap-4 border-t border-[var(--line-night)] pt-4 text-[var(--on-night-2)]">
          <a href={`tel:${siteConfig.phoneIntl.replace(/\s/g, "")}`} className="inline-flex items-center gap-2">
            <Phone size={18} />
            {siteConfig.phoneDisplay}
          </a>
          <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
            <InstagramLogo size={18} />
            Instagram
          </a>
        </div>
      </m.div>
    </m.div>
  );
}

export default function MobileMenu({ isOpen, onClose }) {
  return <AnimatePresence>{isOpen && <MenuPanel onClose={onClose} />}</AnimatePresence>;
}
