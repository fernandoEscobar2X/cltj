import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import Button from "../../components/ui/Button";
import { siteConfig } from "../../data/siteConfig";

const heroWorks = [
  {
    src: "/img-featured/letrero-wafflix.webp",
    alt: "Letrero comercial de Wafflix fabricado por TJ Láser",
    label: "Letreros para negocio",
    className: "col-span-2 aspect-[4/3] sm:row-span-2 sm:aspect-auto",
  },
  {
    src: "/img-featured/tags-mochila.webp",
    alt: "Tags de acrílico personalizados con nombres",
    label: "Tags con nombre",
    className: "aspect-square",
  },
  {
    src: "/img-featured/display-shulas.webp",
    alt: "Display acrílico para Shulas Boutique",
    label: "Displays para mostrador",
    className: "aspect-square",
  },
];

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-white pb-10 pt-24 text-[var(--ink)] sm:pt-28 lg:pb-20 lg:pt-32">
      <div className="layout-shell">
        <div className="grid gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <p className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-mute-strong)]">
              <MapPin size={15} strokeWidth={2} /> Hecho en Tijuana
            </p>

            <h1 className="max-w-[11ch] text-[clamp(3.55rem,12vw,7.2rem)] font-bold leading-[0.88] tracking-[-0.065em]">
              Tu idea,
              <span className="block text-[var(--laser-deep)]">hecha para verse.</span>
            </h1>

            <p className="mt-6 max-w-lg text-[1.05rem] leading-7 text-[var(--ink-soft)] sm:text-xl sm:leading-8">
              Letreros, señalética, displays y piezas personalizadas en acrílico,
              MDF y vinil. Diseñamos contigo y fabricamos aquí.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={siteConfig.whatsappUrl} variant="laser" size="lg" className="w-full sm:w-auto">
                Cotizar una idea <ArrowUpRight size={19} />
              </Button>
              <Button to="/galeria" variant="ghost" size="lg" className="w-full sm:w-auto">
                Ver trabajos
              </Button>
            </div>

            <a
              href={siteConfig.whatsappTagsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-3 border-b border-[var(--laser)] pb-1.5 text-sm font-semibold"
            >
              Ahora: tags para mochilas <ArrowUpRight size={16} />
            </a>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -left-3 top-5 z-20 -rotate-3 bg-[var(--laser)] px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white shadow-lg sm:left-4 sm:top-8">
              Trabajo real · Sin renders
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1.2fr_0.8fr] sm:grid-rows-2 sm:gap-3">
              {heroWorks.map((work, index) => (
                <figure key={work.label} className={`group relative overflow-hidden bg-[#ece9ef] ${work.className}`}>
                  <img
                    src={work.src}
                    alt={work.alt}
                    width="1280"
                    height="960"
                    fetchPriority={index === 0 ? "high" : "auto"}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-black/78 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm sm:px-4 sm:py-3">
                    {work.label}
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="pointer-events-none absolute -bottom-3 -right-3 h-12 w-1/2 bg-[var(--laser)] sm:-bottom-4 sm:-right-4" />
            <div className="pointer-events-none absolute -bottom-3 right-[12%] h-12 w-1/3 bg-white sm:-bottom-4" />
          </motion.div>
        </div>
      </div>

      <div className="mt-12 overflow-hidden border-y border-black/10 bg-[var(--ink)] py-3 text-white lg:mt-20">
        <p className="whitespace-nowrap text-center text-[0.7rem] font-bold uppercase tracking-[0.17em] sm:text-xs">
          Letreros&nbsp;&nbsp;·&nbsp;&nbsp; Señalética&nbsp;&nbsp;·&nbsp;&nbsp; Displays&nbsp;&nbsp;·&nbsp;&nbsp; Acrílico&nbsp;&nbsp;·&nbsp;&nbsp; MDF&nbsp;&nbsp;·&nbsp;&nbsp; Vinil&nbsp;&nbsp;·&nbsp;&nbsp; Personalizados
        </p>
      </div>
    </section>
  );
}
