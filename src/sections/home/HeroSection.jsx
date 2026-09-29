import { m, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, WhatsappLogo } from "@phosphor-icons/react";
import Img from "../../components/media/Img";
import { heroWall } from "../../data/siteContent";
import { siteConfig } from "../../data/siteConfig";
import { useIntro } from "../../lib/intro";

const EASE = [0.16, 1, 0.3, 1];

// Muro de trabajos: columnas de fotos reales que suben y bajan a distinta
// velocidad, inclinadas, con el haz del láser barriendo de vez en cuando.
// Todo es transform (GPU); las fotos son de 360-640 px, así que el titular
// sigue siendo lo más grande de la pantalla (LCP de texto).
function Wall({ columns, pointer }) {
  const reduceMotion = useReducedMotion();
  const x = useTransform(pointer.x, [-1, 1], [18, -18]);
  const y = useTransform(pointer.y, [-1, 1], [12, -12]);
  // El muro llega justo después del primer pintado: el titular se pinta solo
  // (sin competir por ancho de banda con 25 fotos) y el muro entra detrás con
  // un fundido. En el HTML prerenderizado no viaja (data-client-only).
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <m.div
      data-client-only
      className="absolute inset-[-12%] flex rotate-[-7deg] gap-3 transition-opacity duration-[1.4s] ease-out md:gap-4"
      style={{ x, y, opacity: ready ? 1 : 0 }}
      aria-hidden="true"
    >
      {ready
        ? columns.map((ids, col) => (
            <div key={col} className={`relative flex-1 overflow-hidden ${col > 2 ? "hidden md:block" : ""}`}>
              <div
                className={`marquee-y ${col % 2 ? "marquee-y--reverse" : ""}`}
                style={{ "--marquee-speed": `${58 + col * 9}s`, animationPlayState: reduceMotion ? "paused" : "running" }}
              >
                {(reduceMotion ? ids : [...ids, ...ids]).map((id, i) => (
                  <div key={`${id}-${i}`} className="pb-3 md:pb-4">
                    <Img
                      id={id}
                      sizes="(min-width: 768px) 22vw, 36vw"
                      className="aspect-[4/5] rounded-[var(--radius-m)]"
                      eager={i < 3}
                      placeholder={false}
                      alt=""
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        : null}
    </m.div>
  );
}

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  // Sin animación de entrada en la primera carga (el HTML ya viene pintado).
  const animate = useIntro() && !reduceMotion;
  const ref = useRef(null);
  const pointer = { x: useSpring(0, { stiffness: 40, damping: 18 }), y: useSpring(0, { stiffness: 40, damping: 18 }) };
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 140]);
  const wallScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.12]);
  const veil = useTransform(scrollYProgress, [0, 0.8], [0.62, 0.9]);

  useEffect(() => {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return undefined;
    const onMove = (e) => {
      pointer.x.set((e.clientX / window.innerWidth) * 2 - 1);
      pointer.y.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  return (
    <section
      id="hero"
      ref={ref}
      data-header="dark"
      className="relative h-[100svh] min-h-[40rem] overflow-hidden bg-[var(--night)] text-[var(--on-night)]"
    >
      <m.div className="absolute inset-0" style={{ scale: wallScale }}>
        {/* Desktop: cinco columnas. Móvil: las tres primeras, más grandes. */}
        <Wall columns={heroWall} pointer={pointer} />
      </m.div>

      {/* Velo: la foto vive arriba; abajo, donde va el titular, casi negro. */}
      <m.div className="pointer-events-none absolute inset-0 bg-[var(--night)]" style={{ opacity: veil }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--night)]/70 via-transparent via-35% to-[var(--night)]" />

      {/* Haz del láser: una línea que barre el muro cada tanto. */}
      {!reduceMotion ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden" aria-hidden="true">
          <div className="laser-scan absolute inset-x-0 h-px bg-[var(--laser)] shadow-[0_0_18px_3px_var(--laser-glow)]" />
        </div>
      ) : null}

      <m.div className="shell absolute inset-x-0 bottom-0 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-10" style={{ y: copyY }}>
        <div className="relative">
          <m.p
            className="t-script t-script--light absolute -top-[0.2em] right-0 z-10 hidden rotate-[-5deg] text-[clamp(2.6rem,5.2vw,5.6rem)] md:block"
            initial={animate ? { opacity: 0, y: 20, rotate: -12 } : false}
            animate={{ opacity: 1, y: 0, rotate: -5 }}
            transition={{ duration: 1.1, delay: 1.05, ease: EASE }}
          >
            en Tijuana
          </m.p>

          <h1 className="m-0">
            <span className="sr-only">Corte láser en Tijuana: letreros, displays, trofeos, vinil, regalos y papel picado a medida</span>
            <m.span
              aria-hidden="true"
              className="t-mega block text-[31vw] leading-[0.94] md:text-[clamp(4.6rem,17.2vw,19rem)] md:leading-[0.8]"
              initial={animate ? { clipPath: "inset(0 0 100% 0)", y: 60 } : false}
              animate={{ clipPath: "inset(-20% 0 0% 0)", y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
            >
              Corte <span className="md:hidden"><br /></span>láser
            </m.span>
          </h1>
          <m.p
            className="t-script t-script--light -mt-[0.1em] rotate-[-4deg] text-[3rem] md:hidden"
            initial={animate ? { opacity: 0, x: -12 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: EASE }}
            aria-hidden="true"
          >
            en Tijuana
          </m.p>
        </div>

        <m.div
          className="mt-5 grid gap-5 border-t border-[var(--line-night)] pt-5 md:mt-7 md:grid-cols-[1fr_auto] md:items-end md:gap-10 md:pt-7"
          initial={animate ? { opacity: 0, y: 18 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
        >
          <p className="t-lead max-w-[36ch] text-[var(--on-night-2)]">
            Letreros, displays con QR, trofeos, vinil, regalos y papel picado a medida.{" "}
            <span className="text-[var(--on-night)]">Precio y muestra digital en menos de 24 horas.</span>
          </p>
          <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
            <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn--laser btn--lg">
              <WhatsappLogo size={20} weight="fill" />
              {siteConfig.ctaLabel}
            </a>
            <Link to="/papel-picado" className="btn btn--ghost-light btn--lg">
              Diseña tu papel picado
              <ArrowUpRight size={18} weight="bold" />
            </Link>
          </div>
        </m.div>
      </m.div>
    </section>
  );
}
