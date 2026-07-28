import { useState } from "react";
import { ArrowUpRight, KeyRound, Nfc, Signpost, Stamp } from "lucide-react";
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

  return (
    <section id="servicios" className="bg-[var(--bg)] py-20 lg:py-32">
      <div className="layout-shell">
        
        {/* Intro */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16 lg:mb-24">
          <div className="max-w-2xl">
            <p className="font-mono text-[0.78rem] uppercase tracking-[0.26em] text-[var(--ink-mute)] mb-6">
              01 · Lo que hacemos
            </p>
            <h2 className="m-0 text-[3.5rem] md:text-[5.5rem] font-black text-[var(--ink)] leading-[0.85] tracking-tighter">
              Servicios que venden,
              <span className="block text-[var(--laser)] mt-2">señalizan y recuerdan.</span>
            </h2>
          </div>
          <div className="md:text-right flex flex-col md:items-end gap-6">
            <p className="max-w-xs text-lg leading-relaxed text-[var(--ink-soft)]">
              Cortamos y grabamos con precisión láser. Cada pieza es única y
              hecha a medida para tu negocio.
            </p>
            <Button href={siteConfig.whatsappUrl} variant="ghost" size="lg" className="border-[var(--ink)] text-[var(--ink)] font-bold">
              Pedir cotización
              <ArrowUpRight size={20} strokeWidth={2.5} />
            </Button>
          </div>
        </div>

        {/* Interactive Typography List */}
        <div className="border-t-[3px] border-[var(--ink)]">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            const isHovered = hoveredIndex === index;
            
            return (
              <article
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group border-b-[3px] border-[var(--ink)] transition-colors duration-300 hover:bg-[var(--ink)]"
              >
                <div className="py-8 md:py-12 px-4 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 cursor-default">
                  
                  {/* Left: Number + Title */}
                  <div className="flex items-center gap-6 md:gap-12 w-full md:w-1/2">
                    <span className="font-mono text-lg md:text-2xl font-bold text-[var(--ink-mute)] group-hover:text-white/30 transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-3xl md:text-[3.5rem] font-black text-[var(--ink)] tracking-tighter leading-none group-hover:text-white transition-colors">
                      {service.title}
                    </h3>
                  </div>

                  {/* Middle: Icon (Hidden on mobile, appears on hover on desktop) */}
                  <div className="hidden md:flex justify-center w-[100px]">
                    {Icon && (
                      <Icon 
                        size={48} 
                        strokeWidth={1.5} 
                        className={`transition-all duration-500 ${isHovered ? 'text-[var(--laser)] scale-110 opacity-100' : 'text-transparent scale-50 opacity-0'}`} 
                      />
                    )}
                  </div>

                  {/* Right: Description */}
                  <div className="w-full md:w-1/3 flex flex-col items-start md:items-end gap-4">
                    {service.highlight && (
                      <span className="font-mono text-xs uppercase tracking-widest bg-[var(--laser)] text-white px-3 py-1 font-bold">
                        Nuevo · TJ
                      </span>
                    )}
                    <p className="text-lg text-[var(--ink-soft)] group-hover:text-white/70 transition-colors md:text-right leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
