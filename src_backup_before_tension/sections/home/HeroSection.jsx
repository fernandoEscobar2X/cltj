import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, MapPin, Nfc, Zap } from "lucide-react";
import { useRef } from "react";
import Button from "../../components/ui/Button";
import Sticker from "../../components/ui/Sticker";
import GlowingEmbers from "../../components/ui/GlowingEmbers";
import { siteConfig } from "../../data/siteConfig";

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  
  // Parallax effect for the background video container
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-[#0a0a0a] pt-24 pb-16"
    >
      {/* Background Image with Slow Zoom */}
      <motion.div 
        style={{ y: videoY }}
        className="absolute inset-0 h-[115%] w-full"
      >
        <motion.img
          initial={{ scale: 1.0 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          src="/hero-bg.png"
          alt="Corte láser inmersivo"
          className="absolute inset-0 h-full w-full object-cover opacity-85"
        />
        <GlowingEmbers />
      </motion.div>
      
      {/* Dark Gradient Overlay for text readability (darker on the left) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/20" />

      {/* Content */}
      <div className="layout-shell relative z-10 mx-auto w-full flex flex-col items-start gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center gap-3"
        >
          <Sticker variant="ghost" icon={MapPin} className="border-white/30 text-white/90 backdrop-blur-md">
            {siteConfig.heroKicker}
          </Sticker>
          <Sticker variant="laser" icon={Nfc}>
            NFC Ready
          </Sticker>
          <Sticker variant="hazard" icon={Zap}>
            24H Express
          </Sticker>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="m-0 max-w-4xl text-giant text-white drop-shadow-2xl"
          style={{ lineHeight: "0.95" }}
        >
          <span className="block">Corte y Grabado</span>
          <span className="block laser-text mt-3 text-[1.25em]">LÁSER</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="m-0 max-w-xl text-lg leading-relaxed text-white/80 lg:text-xl drop-shadow-lg"
        >
          Precisión que destaca tu negocio. Displays acrílicos, señalética y piezas personalizadas con la más alta calidad en Tijuana.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Button href={siteConfig.whatsappUrl} variant="laser" size="lg" className="px-10 py-5 text-[1.1rem] font-bold shadow-[0_0_30px_rgba(198,91,255,0.4)] transition-all hover:shadow-[0_0_40px_rgba(198,91,255,0.6)] hover:-translate-y-1">
            Cotizar por WhatsApp
            <ArrowUpRight size={24} strokeWidth={2.5} />
          </Button>
          <Button to="/galeria" variant="ghost" size="lg" className="!border-white/40 !text-white backdrop-blur-sm hover:!bg-white/10 px-8 py-5 text-[1.1rem]">
            Ver proyectos
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
