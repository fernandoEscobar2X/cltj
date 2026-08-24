import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import seasonalTags from "../../assets/seasonal-tags.webp";
import { siteConfig } from "../../data/siteConfig";
import { setOverlayOpen } from "../../lib/overlay";

const STORAGE_KEY = "tjlaser:seasonal-tags-dismissed";
const REAPPEAR_AFTER = 7 * 24 * 60 * 60 * 1000;

function shouldShowPromo() {
  if (new URLSearchParams(window.location.search).get("promo") === "1") {
    return true;
  }

  try {
    const dismissedAt = Number(window.localStorage.getItem(STORAGE_KEY));
    return !dismissedAt || Date.now() - dismissedAt > REAPPEAR_AFTER;
  } catch {
    return true;
  }
}

export default function SeasonalPromo() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!shouldShowPromo()) return undefined;
    const timer = window.setTimeout(() => setOpen(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    setOverlayOpen(true);
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") dismiss();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      setOverlayOpen(false);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open]);

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // Si localStorage no esta disponible, el cierre vale durante esta vista.
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] grid place-items-center bg-black/72 p-3 backdrop-blur-sm sm:p-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) dismiss();
          }}
        >
          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 26, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="seasonal-promo-title"
            className="relative min-h-[36rem] w-full max-w-[64rem] overflow-hidden rounded-[1rem] bg-[#111] text-white shadow-[0_32px_100px_rgba(0,0,0,0.5)] sm:min-h-[34rem]"
          >
            <img
              src={seasonalTags}
              alt="Tags y llaveros personalizados con nombres"
              width="1280"
              height="960"
              className="absolute inset-0 h-full w-full object-cover object-[58%_center] sm:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/72 to-black/10 sm:bg-gradient-to-r sm:from-black/95 sm:via-black/65 sm:to-black/5" />
            <div className="pointer-events-none absolute -left-16 top-[22%] h-[2px] w-[80%] -rotate-6 bg-[var(--laser)] shadow-[0_0_16px_var(--laser-glow)]" />

            <button
              ref={closeRef}
              type="button"
              onClick={dismiss}
              className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/45 bg-black/35 text-white backdrop-blur transition-colors hover:bg-white hover:text-black"
              aria-label="Cerrar promoción"
            >
              <X size={21} strokeWidth={1.8} />
            </button>

            <div className="relative z-10 flex min-h-[36rem] max-w-[38rem] flex-col justify-end p-6 sm:min-h-[34rem] sm:justify-center sm:p-12 lg:p-14">
              <p className="mb-5 w-fit border border-[var(--hazard)] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--hazard)]">
                Regreso a clases
              </p>
              <h2
                id="seasonal-promo-title"
                className="font-['Saira_Condensed'] text-[clamp(3.8rem,7vw,6.8rem)] font-black uppercase leading-[0.78] tracking-[-0.035em]"
              >
                Su mochila.
                <span className="block">Su nombre.</span>
                <span className="block text-[var(--laser-bright)]">Su estilo.</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-white/78 sm:text-lg">
                Tags y llaveros personalizados en acrílico, hechos en Tijuana.
                Elige nombre, color y estilo.
              </p>

              <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <a
                  href={siteConfig.whatsappTagsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-[0.65rem] bg-white px-6 text-sm font-bold uppercase tracking-[0.08em] text-black transition-transform hover:-translate-y-0.5"
                >
                  Ver modelos y cotizar
                  <ArrowUpRight size={19} strokeWidth={2} />
                </a>
                <button
                  type="button"
                  onClick={dismiss}
                  className="border-b border-white/55 pb-1 text-sm font-semibold text-white/75 transition-colors hover:text-white"
                >
                  Seguir viendo
                </button>
              </div>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
