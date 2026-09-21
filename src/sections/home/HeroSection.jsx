import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Button from "../../components/ui/Button";
import { siteConfig } from "../../data/siteConfig";

const EASE = [0.16, 1, 0.3, 1];
const SLIDE_MS = 5600;

const { hero } = siteConfig;

function Line({ text, light = false, offset = 0 }) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={`block ${light ? "font-light" : ""}`}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={reduceMotion ? false : { y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.4 + (offset + index) * 0.07, ease: EASE }}
          >
            {word}
            {index < words.length - 1 ? "\u00a0" : null}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Slides({ index, scale }) {
  const reduceMotion = useReducedMotion();
  const slide = hero.slides[index];

  if (hero.video) {
    return (
      <motion.video
        className="absolute inset-0 h-full w-full object-cover"
        style={{ scale }}
        src={hero.video}
        poster={hero.slides[0]?.image}
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
    );
  }

  return (
    <motion.div className="absolute inset-0" style={{ scale }}>
      <AnimatePresence initial={false}>
        <motion.img
          key={slide.image}
          className={`absolute inset-0 h-full w-full object-cover ${reduceMotion ? "" : "hero-drift"}`}
          src={slide.image}
          srcSet={slide.small ? `${slide.small} 1200w, ${slide.image} 2400w` : undefined}
          sizes="100vw"
          alt={slide.alt}
          fetchPriority={index === 0 ? "high" : "auto"}
          decoding="async"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
      </AnimatePresence>
    </motion.div>
  );
}

// Presentación: foto a pantalla completa (slideshow o video), titular en dos
// líneas y un solo Cotizar. El header, transparente encima, no repite el botón.
export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const [slide, setSlide] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const drift = reduceMotion ? 0 : 1;
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1 + 0.12 * drift]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 120 * drift]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const slides = hero.slides.length;
  const topWords = hero.titleTop.split(" ").length;

  useEffect(() => {
    if (reduceMotion || hero.video || slides < 2) return undefined;
    const id = window.setInterval(() => setSlide((s) => (s + 1) % slides), SLIDE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, slides]);

  // Precarga las demás fotos para que el crossfade no parpadee.
  useEffect(() => {
    hero.slides.slice(1).forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  const current = hero.slides[slide];

  return (
    <section id="hero" ref={ref} className="relative h-[100dvh] min-h-[34rem] overflow-hidden bg-[#111113] text-white">
      <Slides index={slide} scale={mediaScale} />

      {/* Velo: oscurece arriba para el header y abajo para el titular; deja el centro limpio. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/5 to-black/80" />

      <motion.div
        className="layout-shell absolute inset-x-0 bottom-0 grid gap-8 pb-[max(2rem,env(safe-area-inset-bottom))] lg:grid-cols-12 lg:items-end lg:pb-12"
        style={{ y: copyY, opacity: copyOpacity }}
      >
        <div className="lg:col-span-10">
          <h1 className="m-0 text-[clamp(2.8rem,6.4vw,6rem)] font-semibold leading-[0.94] tracking-tight [text-shadow:0_2px_30px_rgba(0,0,0,0.35)]">
            <Line text={hero.titleTop} />
            <Line text={hero.titleBottom} light offset={topWords} />
          </h1>
          <motion.div
            className="mt-8"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: EASE }}
          >
            <Button href={siteConfig.whatsappUrl} variant="accent" size="lg">
              {siteConfig.ctaLabel}
            </Button>
          </motion.div>
        </div>

        {/* Pie de foto: qué pieza y de quién. Cambia con el slide. */}
        {!hero.video ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={current.client}
              className="m-0 hidden text-sm text-white/70 lg:col-span-2 lg:block lg:text-right"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.3 } }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="text-white">{current.client}</span>
              <br />
              {current.piece}
            </motion.p>
          </AnimatePresence>
        ) : null}
      </motion.div>
    </section>
  );
}
