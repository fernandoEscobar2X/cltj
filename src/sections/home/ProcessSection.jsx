import { MapPin, MessageCircle, PackageCheck, Palette, Plus } from "lucide-react";
import { faqs, processSteps } from "../../data/siteContent";

const stepIcons = [MessageCircle, Palette, PackageCheck, MapPin];

export default function ProcessSection() {
  return (
    <section id="proceso" className="bg-[var(--laser-soft)]/55 py-20 text-[var(--ink)] lg:py-28">
      <div className="layout-shell">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--laser-deep)]">Así trabajamos</p>
            <h2 className="max-w-[10ch] font-['Saira_Condensed'] text-[clamp(4rem,7vw,7rem)] font-black leading-[0.8] tracking-[-0.04em]">
              De una idea a algo que puedes tocar.
            </h2>
            <p className="mt-7 max-w-md text-lg leading-8 text-[var(--ink-soft)]">
              Te acompañamos desde la referencia inicial hasta la entrega. Sin
              formularios largos y sin exigir que llegues con un archivo perfecto.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {processSteps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <article key={step.step} className="rounded-[1rem] border border-black/10 bg-white/65 p-6 shadow-[0_14px_34px_rgba(20,16,13,0.06)] md:p-7">
                  <div className="mb-8 flex items-center justify-between">
                    <Icon size={27} strokeWidth={1.6} className="text-[var(--laser-deep)]" />
                    <span className="text-sm font-bold text-[var(--ink-mute-strong)]">0{index + 1}</span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-[-0.02em]">{step.title}</h3>
                  <p className="mt-3 leading-7 text-[var(--ink-soft)]">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-black/10 pt-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--laser-deep)]">Antes de cotizar</p>
            <h3 className="mt-4 font-['Saira_Condensed'] text-5xl font-black leading-[0.86]">Preguntas rápidas, respuestas claras.</h3>
          </div>
          <div className="border-t border-black/12">
            {faqs.map((faq) => (
              <details key={faq.question} className="group border-b border-black/12 py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-bold">
                  {faq.question}
                  <Plus size={21} strokeWidth={1.8} className="shrink-0 text-[var(--laser-deep)] transition-transform group-open:rotate-45" />
                </summary>
                <p className="max-w-2xl pb-6 pr-10 leading-7 text-[var(--ink-soft)]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
