import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { X } from "@phosphor-icons/react";
import { siteConfig } from "../../data/siteConfig";
import { setOverlayOpen } from "../../lib/overlay";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function MenuPanel({ onClose }) {
  const panelRef = useRef(null);

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
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[var(--bg)] text-[var(--ink)]"
    >
      <div className="flex min-h-[68px] items-center justify-end px-5">
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center"
          aria-label="Cerrar menú"
        >
          <X size={26} weight="regular" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center gap-4 px-6 pb-10">
        {siteConfig.navItems.map((item) =>
          !item.to.startsWith("/#") ? (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `inline-flex items-center gap-3 text-[2.4rem] font-light leading-[1.05] tracking-tight ${
                  isActive ? "font-semibold" : ""
                }`
              }
            >
              {item.seasonal ? <span className="h-2 w-2 rounded-full bg-[var(--laser)]" aria-hidden="true" /> : null}
              {item.label}
            </NavLink>
          ) : (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="text-[2.4rem] font-light leading-[1.05] tracking-tight"
            >
              {item.label}
            </Link>
          ),
        )}
      </nav>

      <div className="border-t border-[var(--line)] p-6">
        <a
          href={siteConfig.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cut-btn cut-btn--accent cut-btn--lg w-full"
        >
          {siteConfig.ctaLabel}
        </a>
      </div>
    </motion.div>
  );
}

export default function MobileMenu({ isOpen, onClose }) {
  return <AnimatePresence>{isOpen && <MenuPanel onClose={onClose} />}</AnimatePresence>;
}
