import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "@phosphor-icons/react";
import PapelTira from "../papel/PapelTira";
import { papelDefaults } from "../../data/papelPicado";
import { siteConfig } from "../../data/siteConfig";
import { setOverlayOpen } from "../../lib/overlay";

const KEY = "tj-promo-seen";
const DAYS = 30;
const DELAY_MS = 2500;
const EASE = [0.16, 1, 0.3, 1];
const season = siteConfig.season;

function seenRecently() {
  try {
    const at = Number(localStorage.getItem(KEY) || 0);
    return at && Date.now() - at < DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* sin storage: se mostrará otra vez */
  }
}

// Aviso de temporada. Se muestra una vez en la primera visita y no vuelve a
// salir en 30 días. Cierra con Esc, con la X o tocando fuera.
//
// Sin foto: la tira de papel picado real del simulador cae colgada desde el
// borde superior de la pantalla, con la frase de campaña debajo. Con foto
// (season.image): la foto es la pieza, con la frase encima.
export default function PromoModal() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const active = season?.active && season.modal && location.pathname === "/";

  useEffect(() => {
    if (!active || seenRecently()) return undefined;
    const timer = window.setTimeout(() => {
      setOpen(true);
      setOverlayOpen(true);
    }, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [active]);

  const close = () => {
    markSeen();
    setOverlayOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white md:right-8 md:top-6"
          >
            <X size={22} />
          </button>

          <div
            role="dialog"
            aria-modal="true"
            aria-label={season.title}
            className="absolute inset-x-0 top-0 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {season.image ? (
              <motion.div
                className="relative mx-4 mt-[12dvh] aspect-[4/5] max-h-[70dvh] overflow-hidden rounded-[var(--radius-media)] sm:mx-auto sm:aspect-[16/10] sm:w-[40rem]"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <img src={season.image} alt="" className="h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <Caption onClose={close} dark />
              </motion.div>
            ) : (
              <>
                {/* La tira cae desde arriba; el hilo queda pegado al borde de la pantalla. */}
                <motion.div
                  className="pointer-events-none -mt-[0.75rem] text-white/85"
                  initial={reduceMotion ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0, transition: { duration: 0.45, ease: "easeIn" } }}
                  transition={{ duration: 1.1, ease: EASE }}
                >
                  {/* El hilo cruza toda la pantalla: 7 paneles en desktop, 3 en móvil. */}
                  <div className="hidden lg:block">
                    <PapelTira templateId={papelDefaults.templateId} colorId={papelDefaults.colorId} text={papelDefaults.text} panels={5} zoom={1.3} />
                  </div>
                  <div className="hidden sm:block lg:hidden">
                    <PapelTira templateId={papelDefaults.templateId} colorId={papelDefaults.colorId} text={papelDefaults.text} panels={5} />
                  </div>
                  <div className="sm:hidden">
                    <PapelTira templateId={papelDefaults.templateId} colorId={papelDefaults.colorId} text={papelDefaults.text} panels={3} zoom={1.1} />
                  </div>
                </motion.div>
                <motion.div
                  className="mx-auto mt-10 w-fit"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
                >
                  <Caption onClose={close} />
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// Frase de campaña + acción. Una línea en desktop.
function Caption({ onClose, dark = false }) {
  return (
    <div
      className={
        dark
          ? "absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 text-white"
          : "flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 text-center text-white"
      }
    >
      <div>
        <p className="m-0 text-xs font-medium uppercase tracking-[0.18em] text-white/60">{season.label}</p>
        <p className="m-0 mt-1 text-[clamp(1.4rem,3vw,2rem)] font-semibold leading-tight tracking-tight">{season.title}</p>
      </div>
      <Link to={season.to} onClick={onClose} className="cut-btn cut-btn--accent">
        {season.cta}
      </Link>
    </div>
  );
}
