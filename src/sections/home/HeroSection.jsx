import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, MapPin, Nfc, Zap } from "lucide-react";
import { useRef } from "react";
import Button from "../../components/ui/Button";
import Sticker from "../../components/ui/Sticker";
import { portfolioItems } from "../../data/portfolio";
import { siteConfig } from "../../data/siteConfig";

const heroVisual =
  portfolioItems.find((item) => item.id === "letrero-agara") ?? portfolioItems[0];

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const stickerRotate = useTransform(scrollYProgress, [0, 1], [-8, 4]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[var(--bg)] pb-10 pt-6 lg:pb-16 lg:pt-10"
    >
      <div className="bleed-shell grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-10">
        {/* LEFT — Typography block */}
        <div className="relative grid gap-8">
          <div className="flex flex-wrap items-center gap-3">
            <Sticker variant="ghost" icon={MapPin}>
              {siteConfig.heroKicker}
            </Sticker>
            <Sticker variant="laser" icon={Nfc}>
              NFC Ready
            </Sticker>
            <Sticker variant="hazard" icon={Zap}>
              24H Express
            </Sticker>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="m-0 text-giant"
          >
            <span className="block text-[var(--ink)]">corte</span>
            <span className="block">
              <span className="text-outline">&amp; grabado</span>
            </span>
            <span className="block laser-text">LÁSER</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="m-0 max-w-xl text-base leading-8 text-[var(--ink-soft)] lg:text-[1.05rem]"
          >
            {siteConfig.heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button href={siteConfig.whatsappUrl} variant="laser" size="lg">
              Cotizar por WhatsApp
              <ArrowUpRight size={18} strokeWidth={2.25} />
            </Button>
            <Button to="/galeria" variant="ghost" size="lg">
              Ver galería
            </Button>
          </motion.div>
        </div>

        {/* RIGHT — Image block */}
        <div className="relative mx-auto w-full max-w-[520px] lg:mx-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="hero-tape" aria-hidden="true" />
            <div className="hero-frame relative aspect-[4/5] overflow-hidden border border-[var(--ink)] bg-[var(--bg-ink)] shadow-[0_40px_80px_rgba(20,16,13,0.24)]">
              <motion.img
                style={{ scale: imageScale, y: imageY }}
                src={heroVisual.src}
                alt={heroVisual.alt}
                width={heroVisual.width}
                height={heroVisual.height}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <motion.div
              style={{ rotate: stickerRotate }}
              className="absolute -bottom-6 -left-6 hidden sm:block"
            >
              <Sticker variant="laser" className="shadow-[0_14px_32px_rgba(198,91,255,0.35)]">
                Hecho en TJ
              </Sticker>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 top-8 hidden md:block"
            >
              <Sticker variant="hazard" className="shadow-[0_12px_24px_rgba(245,212,0,0.28)]">
                Trabajo real
              </Sticker>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating giant glyph */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 bottom-0 hidden select-none font-display text-[22rem] font-black leading-none text-[var(--line)] lg:block"
      >
        ✦
      </div>
    </section>
  );
}
