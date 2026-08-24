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

    const previouslyFocused = document.activeElement;
    setOverlayOpen(true);
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") dismiss();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
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
          className="fixed inset-0 z-[80] flex overflow-y-auto bg-black/76 p-2 backdrop-blur-sm sm:items-center sm:p-6"
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
            className="relative my-auto min-h-[calc(100dvh-1rem)] w-full max-w-[58rem] overflow-hidden bg-[#111] text-white shadow-[0_32px_100px_rgba(0,0,0,0.5)] sm:min-h-[34rem] sm:rounded-[0.8rem]"
          >
            <img
              src={seasonalTags}
              alt="Tags y llaveros personalizados con nombres"
              width="1280"
              height="960"
              className="absolute inset-0 h-full w-full object-cover object-[58%_center] sm:object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,10,0.03)_20%,rgba(8,7,10,0.96)_82%)] sm:bg-[linear-gradient(90deg,rgba(8,7,10,0.94)_0%,rgba(8,7,10,0.62)_54%,rgba(8,7,10,0.06)_100%)]" />
            <div className="pointer-events-none absolute left-0 top-[38%] h-1 w-[72%] -rotate-3 bg-[var(--laser)] shadow-[0_0_16px_var(--laser-glow)]" />

            <button
              ref={closeRef}
              type="button"
              onClick={dismiss}
              className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center bg-black/72 text-white backdrop-blur transition-colors hover:bg-white hover:text-black sm:right-4 sm:top-4"
              aria-label="Cerrar promoción"
            >
              <X size={21} strokeWidth={1.8} />
            </button>

            <div className="relative z-10 flex min-h-[calc(100dvh-1rem)] max-w-[36rem] flex-col justify-end p-5 pb-7 sm:min-h-[34rem] sm:justify-center sm:p-10 lg:p-12">
              <p className="mb-4 w-fit bg-[var(--laser)] px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.17em] text-white">
                Temporada escolar
              </p>
              <h2
                id="seasonal-promo-title"
                className="max-w-[9ch] text-[clamp(3.15rem,13vw,6.3rem)] font-bold leading-[0.86] tracking-[-0.06em]"
              >
                Su mochila, <span className="text-[var(--laser-bright)]">su nombre.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/78 sm:mt-6 sm:text-lg sm:leading-7">
                Tags y llaveros personalizados en acrílico. Tú eliges el nombre,
                los colores y el estilo; nosotros lo hacemos en Tijuana.
              </p>

              <div className="mt-6 flex flex-col items-start gap-4 sm:mt-7 sm:flex-row sm:items-center">
                <a
                  href={siteConfig.whatsappTagsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-14 w-full items-center justify-center gap-3 bg-white px-5 text-sm font-bold !text-black transition-transform hover:-translate-y-0.5 sm:w-auto"
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
