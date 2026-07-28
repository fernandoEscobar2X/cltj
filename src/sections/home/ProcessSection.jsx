import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { processSteps, faqs } from "../../data/siteContent";
import { Plus } from "lucide-react";

export default function ProcessSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="proceso" className="bg-[#0a0a0a] py-20 lg:py-32 text-white border-t-[3px] border-[var(--ink)]">
      
      {/* Timeline Rápido */}
      <div className="layout-shell mb-24">
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-[0.78rem] uppercase tracking-[0.26em] text-[var(--laser)] mb-6">
            03 · Proceso
          </p>
          <h2 className="text-[3.5rem] md:text-[5.5rem] font-black leading-[0.85] tracking-tighter mb-4 text-white">
            Sin fricción.
            <span className="block text-white/40">Directo al corte.</span>
          </h2>
        </div>
        
        <div className="relative pt-12" ref={containerRef}>
          {/* Desktop Horizontal Line */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-white/10" />
          
          {/* Mobile Vertical Line (Background) */}
          <div className="md:hidden absolute top-12 bottom-0 left-[15px] w-[2px] bg-white/10" />
          
          {/* Mobile Vertical Line (Animated Laser Fill) */}
          <motion.div 
            className="md:hidden absolute top-12 left-[15px] w-[2px] bg-[var(--laser)] origin-top shadow-[0_0_15px_rgba(198,91,255,0.6)]"
            style={{ height: lineHeight }}
          />
          
          <div className="grid md:grid-cols-4 gap-12 md:gap-12 relative z-10">
            {processSteps.map((step, idx) => (
              <div key={idx} className="relative group pl-10 md:pl-0">
                {/* Mobile Dot */}
                <div className="md:hidden absolute left-0 top-1 w-[32px] h-[32px] rounded-full bg-[#0a0a0a] border-2 border-white/20 flex items-center justify-center transition-colors duration-500 z-10 group-hover:border-[var(--laser)]">
                  <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-[var(--laser)] transition-colors duration-500" />
                </div>
                
                <span className="text-[var(--laser)] font-mono text-sm tracking-widest block mb-6 font-bold pt-1 md:pt-0">
                  PASO {step.step}
                </span>
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[var(--laser)] transition-colors">{step.title}</h3>
                <p className="text-white/60 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preguntas Frecuentes Minimalistas */}
      <div className="layout-shell mt-24 md:mt-32">
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start border-t border-white/10 pt-16 md:pt-24">
          
          <div className="w-full md:w-1/3 shrink-0">
            <h3 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tighter">Preguntas Rápidas</h3>
            <p className="text-white/50 text-lg">Respuestas directas para que cotices sin dudas ni fricciones.</p>
          </div>

          <div className="w-full md:w-2/3 grid gap-0 border-t md:border-t-0 border-white/10">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group border-b border-white/10 p-6 md:p-8 transition-colors hover:bg-white/[0.02]">
                <summary className="flex cursor-pointer list-none items-center justify-between text-xl md:text-2xl font-bold text-white/90 group-hover:text-white">
                  <span className="pr-8">{faq.question}</span>
                  <Plus size={24} className="text-[var(--laser)] shrink-0 transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="pt-6 text-white/60 leading-relaxed text-lg pr-8">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}
