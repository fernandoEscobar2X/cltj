import { useRef } from "react";
import { m, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import Img from "../../components/media/Img";
import Reveal from "../../components/shared/Reveal";

// Manifiesto: qué se corta y para qué. Dos experiencias distintas:
// - Desktop: la frase con fotos reales metidas en el texto; las palabras se
//   encienden con el scroll y las fotos crecen al pasar el cursor.
// - Móvil y tablet: la frase se cuenta con el pulgar (ver MobileStory).
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

// Materiales de la historia móvil: cada uno con su trabajo real de fondo.
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

// ─── Móvil: historia fija ─────────────────────────────────────────────────
// La sección se fija a pantalla completa. "Cortamos" se queda y debajo pasa
// una rueda de materiales (el activo en violeta láser). Cada material cambia
// la foto de fondo, con un acercamiento lento, y trae una línea de qué se hace
// con él. Al final entra el cierre de la frase.

const ROW = 1.08; // alto de cada palabra de la rueda, en em

function StoryPhoto({ item, i, n, progress }) {
  const step = 1 / (n - 1);
  const c = i * step;
  const last = i === n - 1;
  const opacity = useTransform(
    progress,
    [c - step * 0.7, c - step * 0.2, c + step * 0.2, c + step * 0.7],
    [i === 0 ? 1 : 0, 1, 1, last ? 1 : 0],
  );
  const scale = useTransform(progress, [c - step, c + step], [1.16, 1.02]);
  return (
    <m.div className="absolute inset-0" style={{ opacity, scale }}>
      <Img id={item.media} alt={item.alt} sizes="100vw" className="absolute inset-0" />
    </m.div>
  );
}

function StoryWord({ item, i, n, progress }) {
  const step = 1 / (n - 1);
  const c = i * step;
  const opacity = useTransform(progress, [c - step, c, c + step], [0.3, 1, 0.3]);
  const color = useTransform(progress, [c - step * 0.5, c, c + step * 0.5], ["#f3efe8", "#d98bff", "#f3efe8"]);
  return (
    <m.li className="list-none" style={{ opacity, color, height: `${ROW}em` }}>
      {item.word}
    </m.li>
  );
}

function StoryNote({ item, i, n, progress }) {
  const step = 1 / (n - 1);
  const c = i * step;
  const opacity = useTransform(progress, [c - step * 0.45, c, c + step * 0.45], [0, 1, 0]);
  const y = useTransform(progress, [c - step * 0.45, c, c + step * 0.45], [14, 0, -14]);
  return (
    <m.p className="absolute inset-x-0 top-0 max-w-[30ch] text-[1.12rem] leading-snug text-[var(--on-night)]" style={{ opacity, y }}>
      {item.note}
    </m.p>
  );
}

const fade = "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)";

function MobileStory() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // El scroll táctil llega a saltos; el resorte lo vuelve continuo.
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const n = materials.length;
  // Los materiales ocupan hasta el 70% del recorrido; el cierre, el resto.
  const wheel = useTransform(smooth, [0.03, 0.7], [0, 1], { clamp: true });
  const wheelY = useTransform(wheel, [0, 1], ["0em", `${-(n - 1) * ROW}em`]);
  const storyOpacity = useTransform(smooth, [0.72, 0.8], [1, 0]);
  const endOpacity = useTransform(smooth, [0.76, 0.86], [0, 1]);
  const endY = useTransform(smooth, [0.76, 0.86], [40, 0]);
  const veil = useTransform(smooth, [0.7, 0.86], [0.5, 0.8]);

  if (reduceMotion) {
    return (
      <div className="bg-[var(--night)] px-[clamp(1.1rem,4vw,3.5rem)] py-20 text-[var(--on-night)] lg:hidden" data-header="dark">
        <p className="font-display text-[15vw] font-extrabold uppercase leading-[0.9]">Cortamos</p>
        <ul className="m-0 mt-2 p-0 font-display text-[15vw] font-extrabold uppercase leading-[0.95] text-[var(--laser)]">
          {materials.map((item) => (
            <li key={item.word} className="list-none">
              {item.word}
            </li>
          ))}
        </ul>
        <p className="mt-8 font-statement text-[2rem] leading-tight">para que tu marca se vea en la calle, en el mostrador y en la fiesta.</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative lg:hidden" style={{ height: `${100 + n * 60 + 70}svh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[var(--night)] text-[var(--on-night)]" data-header="dark">
        {materials.map((item, i) => (
          <StoryPhoto key={item.word} item={item} i={i} n={n} progress={wheel} />
        ))}
        <m.div className="absolute inset-0 bg-[var(--night)]" style={{ opacity: veil }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--night)]/70 via-transparent to-[var(--night)]/90" />

        <m.div className="absolute inset-0 flex flex-col justify-center px-[clamp(1.1rem,4vw,3.5rem)]" style={{ opacity: storyOpacity }}>
          <p className="font-display text-[17vw] font-extrabold uppercase leading-[0.9] md:text-[12vw]">Cortamos</p>
          {/* Rueda: una ventana de tres palabras con la activa al centro. */}
          <div
            className="relative mt-1 overflow-hidden font-display text-[17vw] font-extrabold uppercase leading-[1.08] md:text-[12vw]"
            style={{ height: `${ROW * 3}em`, maskImage: fade, WebkitMaskImage: fade }}
          >
            <m.ul className="m-0 p-0" style={{ y: wheelY, paddingTop: `${ROW}em` }}>
              {materials.map((item, i) => (
                <StoryWord key={item.word} item={item} i={i} n={n} progress={wheel} />
              ))}
            </m.ul>
          </div>
          <div className="relative mt-5 h-[5.5rem]">
            {materials.map((item, i) => (
              <StoryNote key={item.word} item={item} i={i} n={n} progress={wheel} />
            ))}
          </div>
        </m.div>

        <m.div
          className="absolute inset-0 flex flex-col justify-end px-[clamp(1.1rem,4vw,3.5rem)] pb-[max(3.5rem,env(safe-area-inset-bottom))]"
          style={{ opacity: endOpacity, y: endY }}
        >
          <p className="font-statement text-[clamp(2.4rem,10vw,4rem)] leading-[1.02]">
            para que tu marca se vea en la calle, en el mostrador y en la{" "}
            <span className="t-script t-script--light text-[1.3em] leading-none">fiesta.</span>
          </p>
        </m.div>
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
      <MobileStory />
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
