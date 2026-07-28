import { ArrowUpRight } from "lucide-react";
import { ctaFinal } from "../../data/siteContent";
import { siteConfig } from "../../data/siteConfig";

export default function ContactSection() {
  return (
    <section id="contacto" className="relative min-h-[85vh] flex items-end pb-20 pt-32 bg-[#050505] overflow-hidden border-t-[3px] border-[var(--ink)]">
      {/* Background glow pushed to the right corner */}
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[var(--laser)]/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/3" />
      
      <div className="w-full px-6 md:px-12 lg:px-24 xl:px-[5vw] relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        
        {/* Left side: Massive typography */}
        <div className="flex-1">
          <h2 className="text-[clamp(4.5rem,12vw,22rem)] font-black leading-[0.8] tracking-tighter text-white mb-8 md:mb-12">
            HAGAMOS
            <span className="block">TU <span className="text-[var(--laser)]">PROYECTO</span></span>
            REALIDAD.
          </h2>
          <p className="text-lg md:text-xl text-white/50 font-mono uppercase tracking-widest max-w-xl">
            {ctaFinal.subtitle}
          </p>
        </div>

        {/* Right side: Button pushed to the edge */}
        <div className="shrink-0 w-full md:w-auto mt-8 md:mt-0 md:mb-8">
          <a 
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between md:justify-center gap-6 bg-[var(--laser)] text-black px-8 py-6 md:px-12 md:py-8 text-xl md:text-3xl font-black uppercase tracking-widest hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(198,91,255,0.4)] hover:shadow-[0_0_80px_rgba(198,91,255,0.8)]"
          >
            Cotizar ahora
            <ArrowUpRight size={36} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
}
