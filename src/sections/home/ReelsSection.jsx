import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, InstagramLogo } from "@phosphor-icons/react";
import InstagramReel from "../../components/media/InstagramReel";
import LoopVideo from "../../components/media/LoopVideo";
import Reveal from "../../components/shared/Reveal";
import { reels } from "../../data/siteContent";
import { siteConfig } from "../../data/siteConfig";

// Así se ve en la calle: el video del vinil instalado (se reproduce solo) y el
// reel de los imanes, en marcos de teléfono. Desktop: dos alturas con
// parallax. Móvil: carrusel con el dedo.
function Phone({ children, className = "" }) {
  return <div className={`rounded-[2.3rem] bg-[var(--night-3)] p-2 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] ${className}`}>{children}</div>;
}

function VideoCard() {
  return (
    <figure className="relative m-0 overflow-hidden rounded-[2rem] bg-black ring-1 ring-white/10">
      <LoopVideo id="vinil-felica" label="Video del vinil instalado en el cristal de Felica Lounge" className="aspect-[9/16] h-full w-full object-cover" />
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 pt-16 text-white">
        <span className="block font-display text-[2rem] font-extrabold uppercase leading-[0.9]">Instalado</span>
        <span className="mt-2 block text-[1rem] text-white/80">Vinil de corte en cristal, alineado en sitio.</span>
      </figcaption>
    </figure>
  );
}

export default function ReelsSection() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const a = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const b = useTransform(scrollYProgress, [0, 1], [140, -40]);
  const handle = siteConfig.social.instagram.replace(/\/$/, "").split("/").pop();

  return (
    <section ref={ref} className="defer-render overflow-hidden bg-[var(--night)] py-24 text-[var(--on-night)] md:py-36" data-header="dark" aria-labelledby="reels-titulo">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
        <Reveal className="lg:col-span-4">
          <h2 id="reels-titulo" className="t-h2">
            Así se ve en la calle
          </h2>
          <p className="t-script t-script--light mt-2 rotate-[-3deg] text-[clamp(2.4rem,4vw,3.6rem)]">no en un render</p>
          <p className="t-lead mt-6 max-w-[34ch] text-[var(--on-night-2)]">
            Instalamos lo que cortamos. Mira las piezas puestas en su lugar y síguenos para ver lo que sale del taller cada semana.
          </p>
          <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn--light btn--lg mt-8">
            <InstagramLogo size={20} weight="fill" />@{handle}
            <ArrowUpRight size={18} weight="bold" />
          </a>
        </Reveal>

        {/* Desktop: dos marcos a distinta altura. */}
        <div className="relative hidden grid-cols-2 gap-10 lg:col-span-7 lg:col-start-6 lg:grid">
          <m.div style={{ y: reduceMotion ? 0 : a }} className="w-full max-w-[21rem] justify-self-end">
            <Phone>
              <VideoCard />
            </Phone>
          </m.div>
          <m.div style={{ y: reduceMotion ? 0 : b }} className="mt-28 w-full max-w-[21rem]">
            <Phone>
              <InstagramReel {...reels[0]} />
            </Phone>
          </m.div>
        </div>
      </div>

      {/* Móvil: carrusel con el dedo. */}
      <ul className="snap-x-mandatory hide-scrollbar m-0 mt-12 flex gap-4 overflow-x-auto px-[clamp(1.1rem,4vw,3.5rem)] pb-4 lg:hidden">
        <li className="w-[76vw] max-w-[22rem] shrink-0 snap-center list-none">
          <Phone>
            <VideoCard />
          </Phone>
        </li>
        <li className="w-[76vw] max-w-[22rem] shrink-0 snap-center list-none">
          <Phone>
            <InstagramReel {...reels[0]} sizes="76vw" />
          </Phone>
        </li>
      </ul>
    </section>
  );
}
