import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin, Tag } from "lucide-react";
import Button from "../../components/ui/Button";
import { siteConfig } from "../../data/siteConfig";

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[var(--bg)] pb-16 pt-28 text-[var(--ink)] lg:min-h-svh lg:pb-24 lg:pt-36">
      <div className="pointer-events-none absolute -right-28 top-24 h-72 w-72 rounded-full bg-[var(--hazard)]/75 blur-[1px]" />
      <div className="pointer-events-none absolute left-[42%] top-20 h-[2px] w-[48vw] -rotate-6 bg-[var(--laser)] shadow-[0_0_18px_var(--laser-glow)]" />

      <div className="layout-shell relative z-10 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20"
        >
          <a
            href={siteConfig.whatsappTagsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 inline-flex items-center gap-3 border-b border-[var(--ink)] pb-2 text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:text-[var(--laser-deep)]"
          >
            <Tag size={17} strokeWidth={1.8} />
            Temporada: tags para mochilas
            <ArrowUpRight size={16} />
          </a>

          <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-[var(--ink-mute-strong)]">
            <MapPin size={17} strokeWidth={1.8} />
            Diseñamos y fabricamos en Tijuana
          </p>

          <h1 className="m-0 max-w-[9.5ch] font-['Saira_Condensed'] text-[clamp(4.2rem,8.2vw,8.8rem)] font-black leading-[0.79] tracking-[-0.045em]">
            Haz que tu negocio
            <span className="block text-[var(--laser-deep)]">se haga ver.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--ink-soft)] md:text-xl">
            Letreros, señalética, displays y personalizados en acrílico, MDF y
            vinil. Convertimos tu idea en una pieza lista para usar, instalar o
            regalar.
          </p>

          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row">
            <Button href={siteConfig.whatsappUrl} variant="laser" size="lg">
              Cuéntanos tu idea
              <ArrowUpRight size={20} strokeWidth={2} />
            </Button>
            <Button to="/galeria" variant="ghost" size="lg">
              Ver trabajos reales
            </Button>
          </div>

          <p className="mt-5 text-sm text-[var(--ink-mute-strong)]">
            No necesitas tener el diseño listo. Una foto o referencia es suficiente.
          </p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, x: 24 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[31rem] md:min-h-[40rem]"
        >
          <figure className="absolute inset-x-0 top-0 ml-auto w-[90%] overflow-hidden rounded-[1.2rem] bg-[var(--ink)] shadow-[0_28px_70px_rgba(20,16,13,0.2)] md:w-[82%]">
            <img
              src="/img-featured/letrero-wafflix.webp"
              alt="Letrero comercial de Wafflix fabricado por TJ Láser"
              width="1280"
              height="960"
              fetchPriority="high"
              className="h-[25rem] w-full object-cover md:h-[34rem]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 bg-gradient-to-t from-black/80 to-transparent p-5 text-white md:p-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">Señalética comercial</p>
                <p className="mt-1 text-xl font-bold">Wafflix · Acrílico espejo</p>
              </div>
              <span className="hidden text-xs font-medium text-white/70 sm:block">Trabajo real</span>
            </figcaption>
          </figure>

          <figure className="absolute bottom-0 left-0 w-[44%] overflow-hidden rounded-[1rem] border-[6px] border-[var(--bg)] bg-white shadow-[0_20px_44px_rgba(20,16,13,0.22)] md:w-[42%]">
            <img
              src="/img-featured/display-shulas.webp"
              alt="Display de mostrador para Shulas Boutique"
              width="960"
              height="1280"
              className="aspect-[4/5] w-full object-cover"
            />
            <figcaption className="bg-white px-4 py-3 text-sm font-semibold text-[var(--ink)]">
              Displays para tu mostrador
            </figcaption>
          </figure>

          <div className="absolute bottom-5 right-0 max-w-[12rem] rotate-2 rounded-[0.65rem] bg-[var(--hazard)] px-4 py-3 text-sm font-bold leading-5 shadow-lg md:bottom-8 md:right-3">
            Tu logo, tu espacio y tu estilo.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
