import { processSteps, faqs } from "../../data/siteContent";
import { Plus } from "lucide-react";

export default function ProcessSection() {
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
            <span className="block text-white/30">Directo al corte.</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 md:gap-12 border-t border-white/10 pt-12 relative">
          <div className="hidden md:block absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[var(--laser)] to-transparent opacity-50" />
          
          {processSteps.map((step, idx) => (
            <div key={idx} className="relative group">
              <span className="text-[var(--laser)] font-mono text-sm tracking-widest block mb-6 font-bold">
                PASO {step.step}
              </span>
              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[var(--laser)] transition-colors">{step.title}</h3>
              <p className="text-white/60 leading-relaxed">{step.description}</p>
            </div>
          ))}
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
