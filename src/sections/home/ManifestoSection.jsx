import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Img from "../../components/media/Img";
import Reveal from "../../components/shared/Reveal";

// Manifiesto: qué se corta y para qué. Dos experiencias distintas:
// - Desktop: la frase con fotos reales metidas en el texto; las palabras se
//   encienden con el scroll y las fotos crecen al pasar el cursor.
// - Móvil y tablet: acordeón de franjas (ver MobileMaterials).
const phrase = [
  { t: "Cortamos" },
  { img: "letrero-agara", alt: "Letrero de acrílico espejo dorado" },
  { t: "acrílico," },
  { img: "mapa-mundi-led", alt: "Mapamundi de madera con luz LED" },
  { t: "madera," },
  { img: "vinil-felica", alt: "Vinil en cristal de escaparate" },
  { t: "vinil" },
  { t: "y" },
  { img: "papel-picado-logo", alt: "Papel picado con logotipo" },
  { t: "papel" },
  { t: "para" },
  { t: "que" },
  { t: "tu" },
  { t: "marca" },
  { t: "se" },
  { t: "vea" },
  { t: "en" },
  { t: "la" },
  { t: "calle," },
  { t: "en" },
  { t: "el" },
  { t: "mostrador" },
  { t: "y" },
  { t: "en" },
  { t: "la" },
  { t: "fiesta.", accent: true },
];

const facts = [
  { value: "24 h", label: "para recibir precio y muestra digital" },
  { value: "1", label: "pieza mínima en letreros, trofeos y regalos" },
  { value: "20", label: "diseños de papel picado listos para tu nombre" },
];

// Materiales del acordeón móvil: cada uno con su trabajo real.
const materials = [
  { word: "acrílico", media: "letrero-wafflix", alt: "Letrero de acrílico espejo de Wafflix", note: "Espejo, color o transparente. Letreros, displays y trofeos." },
  { word: "espejo", media: "display-shulas", alt: "Display de acrílico espejo dorado de Shulas Boutique", note: "Dorado o plateado, para que la marca brille en el mostrador." },
  { word: "madera", media: "mapa-mundi-led", alt: "Mapamundi de madera con luz LED", note: "Cortada y grabada; con luz LED si la pides." },
  { word: "vinil", media: "vinil-felica", alt: "Vinil en el cristal de Felica Lounge", note: "Para cristales y fachadas, instalado en sitio." },
  { word: "papel", media: "papel-picado-bon-dia", alt: "Papel picado con el logotipo de Bon Día Panadería", note: "Papel picado con tu nombre o tu logo." },
];

// Las palabras pasan de gris a tinta. El gris de partida conserva contraste
// de texto grande (3:1 sobre el papel), así que se lee aun sin animación.
const FROM = "#8b857e";
const TO_INK = "#141215";
const TO_ACCENT = "#8a2ac9";
const EASE = [0.16, 1, 0.3, 1];

function Word({ children, progress, range, accent }) {
  const color = useTransform(progress, range, [FROM, accent ? TO_ACCENT : TO_INK]);
  return (
    <m.span style={{ color }} className={accent ? "t-script text-[1.25em] leading-none" : undefined}>
      {children}
    </m.span>
  );
}

function InlineShot({ id, alt, progress, range }) {
  const scale = useTransform(progress, range, [0.6, 1]);
  return (
    <m.span
      style={{ scale }}
      className="group relative mx-[0.08em] inline-block h-[0.78em] w-[1.35em] -translate-y-[0.04em] align-baseline transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:w-[2.4em]"
    >
      <Img id={id} alt={alt} sizes="16vw" className="absolute inset-0 rounded-full" />
    </m.span>
  );
}

function DesktopPhrase() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const total = phrase.length;

  return (
    <p
      ref={ref}
      className="hidden max-w-[26ch] font-statement text-[clamp(2.3rem,5.6vw,5.8rem)] font-bold leading-[1.02] tracking-[-0.02em] lg:block"
    >
      {phrase.map((item, i) => {
        const start = i / total;
        const range = reduceMotion ? [0, 0] : [start * 0.9, start * 0.9 + 0.12];
        return item.img ? (
          <InlineShot key={i} id={item.img} alt={item.alt} progress={scrollYProgress} range={range} />
        ) : (
          <span key={i}>
            <Word progress={scrollYProgress} range={range} accent={item.accent}>
              {item.t}
            </Word>{" "}
          </span>
        );
      })}
    </p>
  );
}

// ─── Móvil: acordeón de franjas ───────────────────────────────────────────
// Cinco franjas con trabajos reales; la activa se abre a color con su nota y
// las demás quedan como rendijas en gris. Se cambia tocando una franja o
// deslizando de lado (el scroll vertical nunca se bloquea). Mientras está a la
// vista avanza solo, con una línea láser que marca el tiempo; si la persona
// interactúa, se detiene un rato.

const AUTO_MS = 3400;

function MobileMaterials() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { amount: 0.45 });
  const [active, setActive] = useState(0);
  const [pausedUntil, setPausedUntil] = useState(0);
  const touch = useRef(null);
  const n = materials.length;
  const running = inView && !reduceMotion && Date.now() >= pausedUntil;

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % n), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [running, active, n]);

  // Tras una pausa por interacción, se reanuda solo.
  useEffect(() => {
    if (!pausedUntil) return undefined;
    const id = window.setTimeout(() => setPausedUntil(0), Math.max(0, pausedUntil - Date.now()));
    return () => window.clearTimeout(id);
  }, [pausedUntil]);

  const choose = (i) => {
    setActive((i + n) % n);
    setPausedUntil(Date.now() + 9000);
  };

  const onPointerDown = (e) => {
    touch.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) choose(active + (dx < 0 ? 1 : -1));
  };

  const current = materials[active];

  return (
    <div ref={ref} className="pb-4 pt-20 lg:hidden">
      <div className="shell">
        <p className="sr-only">Cortamos {materials.map((x) => x.word).join(", ")}.</p>
        <p aria-hidden="true" className="font-display text-[17vw] font-extrabold uppercase leading-[0.88] md:text-[12vw]">
          Cortamos
        </p>
        {/* El material activo entra como un rótulo que se cambia: sube el nuevo, sale el viejo. */}
        <div aria-hidden="true" className="relative h-[1em] overflow-hidden font-display text-[17vw] font-extrabold uppercase leading-[1] text-[var(--laser-ink)] md:text-[12vw]">
          <AnimatePresence initial={false} mode="popLayout">
            <m.span
              key={current.word}
              className="absolute inset-x-0 top-0 block"
              initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
              animate={{ y: "0%", opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { y: "-100%" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {current.word}
            </m.span>
          </AnimatePresence>
        </div>
      </div>

      <div
        className="mt-6 flex h-[min(58svh,34rem)] touch-pan-y gap-1.5 px-[clamp(1.1rem,4vw,3.5rem)]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          touch.current = null;
        }}
        role="group"
        aria-label="Materiales"
      >
        {materials.map((item, i) => {
          const on = i === active;
          return (
            <m.button
              key={item.word}
              type="button"
              onClick={() => choose(i)}
              aria-pressed={on}
              aria-label={`${item.word}: ${item.note}`}
              className="relative min-w-0 overflow-hidden rounded-[var(--radius-l)] bg-[var(--paper-3)]"
              style={{ flexBasis: 0 }}
              initial={false}
              animate={{ flexGrow: on ? 7 : 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.75, ease: EASE }}
            >
              <Img
                id={item.media}
                alt=""
                sizes="88vw"
                className="absolute inset-0"
                imgClassName={`transition-[filter,transform] duration-700 ${on ? "scale-100 grayscale-0" : "scale-110 grayscale brightness-90"}`}
              />
              <span
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`}
                aria-hidden="true"
              />
              <AnimatePresence>
                {on ? (
                  <m.span
                    key="note"
                    className="absolute inset-x-0 bottom-0 block p-5 text-left text-[1.05rem] leading-snug text-white"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
                    aria-hidden="true"
                  >
                    {item.note}
                  </m.span>
                ) : null}
              </AnimatePresence>
            </m.button>
          );
        })}
      </div>

      {/* Tiempo del avance automático: una línea láser que se llena. */}
      <div className="shell mt-4">
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-[var(--line)]">
          {running ? (
            <m.div
              key={`${active}-${pausedUntil}`}
              className="h-full origin-left bg-[var(--laser)]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
            />
          ) : null}
        </div>
        <p className="mt-10 font-statement text-[clamp(2rem,8.4vw,3.4rem)] leading-[1.04]">
          para que tu marca se vea en la calle, en el mostrador y en la{" "}
          <span className="t-script text-[1.3em] leading-none">fiesta.</span>
        </p>
      </div>
    </div>
  );
}

export default function ManifestoSection() {
  return (
    <section className="bg-[var(--paper)]" aria-labelledby="manifiesto">
      <h2 id="manifiesto" className="sr-only">
        Qué hacemos
      </h2>
      <MobileMaterials />
      <div className="defer-render shell pb-20 pt-10 lg:py-36">
        <DesktopPhrase />

        {/* Datos: en móvil, filas con el número a la izquierda; en desktop, tres columnas. */}
        <dl className="m-0 grid lg:mt-24 lg:grid-cols-3 lg:gap-10 lg:border-t lg:border-[var(--line-2)] lg:pt-10">
          {facts.map((fact, i) => (
            <Reveal
              key={fact.value}
              delay={i * 0.08}
              className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] items-center gap-5 border-b border-[var(--line-2)] py-6 lg:block lg:border-0 lg:py-0"
            >
              <dt className="t-display text-[clamp(3.6rem,18vw,5.5rem)] text-[var(--ink)] lg:text-[clamp(4rem,9vw,8rem)]">{fact.value}</dt>
              <dd className="m-0 text-[1.08rem] leading-snug text-[var(--ink-2)] lg:mt-3 lg:max-w-[22ch]">{fact.label}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
