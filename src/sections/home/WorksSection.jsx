import { useRef } from "react";
import { Link } from "react-router-dom";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import Img from "../../components/media/Img";
import Lightbox from "../../components/shared/Lightbox";
import useLightbox from "../../hooks/useLightbox";
import { featuredPortfolio } from "../../data/portfolio";

const EASE = [0.16, 1, 0.3, 1];

// Composición editorial (desktop): posición, proporción y velocidad de cada
// pieza. Rompe la cuadrícula a propósito: nada queda alineado al centro.
const LAYOUT = [
  { col: "col-start-1 col-span-7", ratio: "aspect-[4/5]", speed: 0 },
  { col: "col-start-9 col-span-4 mt-48", ratio: "aspect-[3/4]", speed: 70 },
  { col: "col-start-2 col-span-4 mt-24", ratio: "aspect-square", speed: 30 },
  { col: "col-start-7 col-span-6 mt-40", ratio: "aspect-[16/11]", speed: -20 },
  { col: "col-start-1 col-span-5 mt-24", ratio: "aspect-[4/5]", speed: 40 },
  { col: "col-start-7 col-span-5 mt-56", ratio: "aspect-[4/5]", speed: 0 },
  { col: "col-start-3 col-span-4 mt-16", ratio: "aspect-[3/4]", speed: 50 },
  { col: "col-start-8 col-span-5 mt-40", ratio: "aspect-[16/12]", speed: 10 },
  { col: "col-start-5 col-span-7 mt-16", ratio: "aspect-[16/10]", speed: 30 },
];

function Piece({ item, spec, onOpen }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [spec.speed, -spec.speed]);

  return (
    <m.article ref={ref} className={spec.col} style={{ y: reduceMotion ? 0 : y }}>
      <button type="button" onClick={() => onOpen(item.id)} className="group block w-full text-left">
        <m.div
          className={`relative overflow-hidden rounded-[var(--radius-m)] ${spec.ratio}`}
          initial={reduceMotion ? false : { clipPath: "inset(18% 0% 18% 0% round 14px)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 14px)" }}
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <Img
            id={item.media}
            alt={item.alt}
            sizes={spec.col.includes("span-7") || spec.col.includes("span-6") ? "50vw" : "36vw"}
            className="absolute inset-0"
            imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />
          <span className="absolute bottom-4 right-4 grid h-12 w-12 translate-y-3 place-items-center rounded-full bg-[var(--laser)] text-[var(--ink)] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowRight size={20} weight="bold" className="-rotate-45" />
          </span>
        </m.div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="font-statement text-[1.7rem] font-bold leading-none [font-stretch:82%]">{item.title}</h3>
          <p className="shrink-0 text-[1rem] text-[var(--ink-3)]">{item.material}</p>
        </div>
      </button>
    </m.article>
  );
}

// Móvil: tarjetas que se apilan con el scroll (sticky), una encima de otra.
function Stack({ items, onOpen }) {
  return (
    <ol className="m-0 grid gap-4 p-0 md:hidden">
      {items.map((item, i) => (
        <li key={item.id} className="sticky list-none" style={{ top: `calc(var(--header-h) + ${i * 12}px)` }}>
          <button
            type="button"
            onClick={() => onOpen(item.id)}
            className="relative block w-full overflow-hidden rounded-[var(--radius-l)] text-left shadow-[0_-20px_40px_-24px_rgba(0,0,0,0.5)]"
          >
            <Img id={item.media} alt={item.alt} sizes="92vw" className="aspect-[4/5]" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 pt-20 text-[var(--on-night)]">
              <h3 className="font-display text-[2.6rem] font-extrabold uppercase leading-[0.9]">{item.title}</h3>
              <p className="mt-1 text-[1rem] text-[var(--on-night-2)]">{item.material}</p>
            </div>
          </button>
        </li>
      ))}
    </ol>
  );
}

export default function WorksSection() {
  const items = featuredPortfolio.slice(0, LAYOUT.length);
  const lightbox = useLightbox(items);

  return (
    <section id="trabajos" className="bg-[var(--paper)] pb-28 pt-24 md:pb-40 md:pt-36" aria-labelledby="trabajos-titulo">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div>
            <h2 id="trabajos-titulo" className="t-display">
              Trabajos
            </h2>
            <p className="t-script -mt-[0.1em] rotate-[-3deg] text-[clamp(2.4rem,4.6vw,4.4rem)]">reales, no renders</p>
          </div>
          <Link to="/galeria" className="group inline-flex items-center gap-3 pb-3 text-[1.1rem] font-semibold">
            <span className="link-line">Ver toda la galería</span>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--ink)] text-[var(--paper)] transition-transform duration-500 group-hover:translate-x-1">
              <ArrowRight size={18} weight="bold" />
            </span>
          </Link>
        </div>

        <div className="mt-16 hidden grid-cols-12 items-start gap-x-8 gap-y-6 md:grid">
          {items.map((item, i) => (
            <Piece key={item.id} item={item} spec={LAYOUT[i]} onOpen={lightbox.open} />
          ))}
        </div>

        <div className="mt-10">
          <Stack items={items} onOpen={lightbox.open} />
        </div>
      </div>

      <Lightbox
        item={lightbox.activeItem}
        index={lightbox.activeIndex}
        total={items.length}
        onClose={lightbox.close}
        onPrev={lightbox.goPrev}
        onNext={lightbox.goNext}
      />
    </section>
  );
}
