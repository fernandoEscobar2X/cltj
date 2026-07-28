import { useState, useRef } from "react";
import { ArrowUpRight, KeyRound, Nfc, Signpost, Stamp, ChevronRight } from "lucide-react";
import Button from "../../components/ui/Button";
import { services } from "../../data/siteContent";
import { siteConfig } from "../../data/siteConfig";

const iconMap = {
  Signpost,
  KeyRound,
  Stamp,
  Nfc,
};

export default function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const scrollContainerRef = useRef(null);

  return (
    <section id="servicios" className="bg-[var(--bg)] py-20 lg:py-32 overflow-hidden">
      <div className="layout-shell">
        
        {/* Intro */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-10 md:mb-16 lg:mb-24">
          <div className="max-w-2xl">
            <p className="font-mono text-[0.78rem] uppercase tracking-[0.26em] text-[var(--ink-mute)] mb-6">
              01 · Lo que hacemos
            </p>
            <h2 className="m-0 text-[3.2rem] md:text-[5.5rem] font-black text-[var(--ink)] leading-[0.85] tracking-tighter">
              Servicios que venden,
              <span className="block text-[var(--laser-ink)] mt-2">señalizan y recuerdan.</span>
            </h2>
          </div>
          <div className="md:text-right flex flex-col md:items-end gap-6">
            <p className="max-w-xs text-lg leading-relaxed text-[var(--ink-soft)] hidden md:block">
              Cortamos y grabamos con precisión láser. Cada pieza es única y
              hecha a medida para tu negocio.
            </p>
            <Button href={siteConfig.whatsappUrl} variant="ghost" size="lg" className="border-[var(--ink)] text-[var(--ink)] font-bold hidden md:flex">
              Pedir cotización
              <ArrowUpRight size={20} strokeWidth={2.5} />
            </Button>
          </div>
        </div>

        {/* Desktop: Interactive Typography Accordion */}
        <div className="hidden md:block border-t-[3px] border-[var(--ink)]">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            const isHovered = hoveredIndex === index;
            
            return (
              <article
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group border-b-[3px] border-[var(--ink)] transition-colors duration-300 hover:bg-[#050505]"
              >
                <div className="py-12 px-8 flex items-center justify-between gap-12 cursor-default">
                  
                  {/* Left: Number + Title */}
                  <div className="flex items-center gap-12 w-1/2">
                    <span className="font-mono text-2xl font-bold text-[var(--ink-mute)] group-hover:text-white/30 transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[3.5rem] font-black text-[var(--ink)] tracking-tighter leading-none group-hover:text-white transition-colors">
                      {service.title}
                    </h3>
                  </div>

                  {/* Middle: Icon */}
                  <div className="flex justify-center w-[100px]">
                    {Icon && (
                      <Icon 
                        size={48} 
                        strokeWidth={1.5} 
                        className={`transition-all duration-500 ${isHovered ? 'text-[var(--laser)] scale-110 opacity-100' : 'text-transparent scale-50 opacity-0'}`} 
                      />
                    )}
                  </div>

                  {/* Right: Description */}
                  <div className="w-1/3 flex flex-col items-end gap-4">
                    {service.highlight && (
                      <span className="font-mono text-xs uppercase tracking-widest bg-[var(--laser-deep)] text-white px-3 py-1 font-bold">
                        Nuevo · TJ
                      </span>
                    )}
                    <p className="text-lg text-[var(--ink-soft)] group-hover:text-white/70 transition-colors text-right leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>

      {/* Mobile: Snap Scroll Impact Cards */}
      <div className="md:hidden relative w-full mt-4">
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-8 pt-4 hide-scrollbar"
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <article 
                key={index}
                className="relative snap-center shrink-0 w-[85vw] bg-[#050505] p-8 flex flex-col justify-between border border-white/10 shadow-2xl"
              >
                <div>
                  <div className="flex justify-between items-start mb-12">
                    {/* /20 daba 1.71:1 sobre el negro de la tarjeta y el numero
                        no se leia; /40 es el minimo que cumple 3:1 en texto
                        grande sin dejar de verse atenuado. */}
                    <span className="font-mono text-3xl font-bold text-white/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {Icon && (
                      <Icon size={36} className="text-[var(--laser)] opacity-90" strokeWidth={1.5} />
                    )}
                  </div>
                  
                  {service.highlight && (
                    <span className="inline-block font-mono text-[10px] uppercase tracking-widest bg-[var(--laser)]/20 text-white border border-[var(--laser)]/30 px-3 py-1 font-bold mb-4 rounded-full">
                      Destacado
                    </span>
                  )}
                  
                  <h3 className="text-4xl font-black text-white tracking-tighter leading-[0.95] mb-4 font-['Saira_Condensed']">
                    {service.title}
                  </h3>
                  <p className="text-base text-white/70 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                
                <div className="mt-12 pt-6 border-t border-white/10">
                  <a 
                    href={siteConfig.whatsappUrl}
                    className="flex items-center justify-between bg-white text-black px-6 py-4 rounded-full font-bold text-sm tracking-widest uppercase group transition-transform active:scale-95 shadow-lg"
                  >
                    Cotizar servicio
                    <ChevronRight size={18} className="text-[var(--laser)] transition-transform group-active:translate-x-2" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
        
        {/* Mobile Swipe Indicator (Dots) */}
        <div className="flex justify-center gap-2 mt-2" aria-hidden="true">
           {services.map((_, i) => (
             <div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--ink)] opacity-30" />
           ))}
        </div>
      </div>
    </section>
  );
}
