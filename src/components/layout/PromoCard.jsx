import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "@phosphor-icons/react";
import { siteConfig } from "../../data/siteConfig";
import { useBannerOpen } from "../../lib/overlay";

// El motor se descarga solo cuando la tarjeta va a mostrarse.
const PapelScene = lazy(() => import("../papel/engine/PapelScene"));

const KEY = "tj-promo-seen";
const season = siteConfig.season;

function seenRecently() {
  try {
    const at = Number(localStorage.getItem(KEY) || 0);
    return at && Date.now() - at < season.promoDays * 24 * 60 * 60 * 1000;
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

// Aviso de temporada, sin bloquear la página: tarjeta en la esquina en
// desktop y hoja inferior (se descarta deslizando) en móvil. Aparece una vez
// cada `promoDays` días, después de que la persona empezó a recorrer el home,
// y nunca encima del aviso de cookies.
export default function PromoCard() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const bannerOpen = useBannerOpen();
  const [open, setOpen] = useState(false);
  const eligible = season?.active && season.promo && location.pathname === "/";

  useEffect(() => {
    if (!eligible || bannerOpen || seenRecently()) return undefined;
    let fired = false;
    const show = () => {
      if (fired) return;
      fired = true;
      setOpen(true);
      markSeen();
    };
    const timer = window.setTimeout(show, 9000);
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 1.2) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [eligible, bannerOpen]);

  useEffect(() => {
    if (!eligible) setOpen(false);
  }, [eligible]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <AnimatePresence>
      {open ? (
        <m.aside
          aria-label={season.title}
          className="fixed inset-x-2 bottom-2 z-[65] overflow-hidden rounded-[1.75rem] bg-[var(--night)] text-[var(--on-night)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[23rem]"
          initial={reduceMotion ? { opacity: 0 } : { y: "110%", rotate: 2 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: "115%", transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] } }}
          transition={{ type: "spring", stiffness: 140, damping: 20 }}
          drag={reduceMotion ? false : "y"}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 90 || info.velocity.y > 500) close();
          }}
        >
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-white/20 sm:hidden" aria-hidden="true" />
          <div className="wall-night relative h-40 sm:h-44">
            <Suspense fallback={null}>
              <PapelScene
                designId="corazones"
                colorId="rosa"
                text="Ximena"
                panels={3}
                zoom={1.18}
                top={0.14}
                sag={0.12}
                night
                className="absolute inset-0"
                label="Tira de papel picado rosa con el nombre Ximena, colgada de noche"
              />
            </Suspense>
          </div>
          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/60"
            aria-label="Cerrar aviso"
          >
            <X size={18} />
          </button>
          <div className="p-5 pt-4">
            <p className="t-script text-[1.9rem] text-[var(--laser)]">nuevo en el taller</p>
            <h2 className="mt-1 font-display text-[2.3rem] font-extrabold uppercase leading-[0.9]">
              {season.title}
            </h2>
            <p className="mt-2 text-[1rem] leading-snug text-[var(--on-night-2)]">{season.body}</p>
            <Link to={season.to} onClick={close} className="btn btn--laser mt-4 w-full">
              {season.cta}
              <ArrowUpRight size={18} weight="bold" />
            </Link>
          </div>
        </m.aside>
      ) : null}
    </AnimatePresence>
  );
}
