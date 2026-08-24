import { Plus } from "lucide-react";
import { faqs, processSteps } from "../../data/siteContent";

export default function ProcessSection() {
  return (
    <section id="proceso" className="bg-[var(--ink)] py-16 text-white sm:py-20 lg:py-28">
      <div className="layout-shell">
        <header className="grid gap-5 border-b border-white/25 pb-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--laser-bright)]">Del mensaje a tus manos</p>
            <h2 className="max-w-[9ch] text-[clamp(3rem,8vw,6.4rem)] font-bold leading-[0.88] tracking-[-0.06em]">
              Lo hacemos contigo.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-white/65 sm:text-lg lg:justify-self-end">
            Puedes llegar con un archivo, una foto o solo una idea. Nosotros te
            ayudamos a decidir cómo convertirla en una pieza real.
          </p>
        </header>

        <ol className="border-b border-white/25">
          {processSteps.map((step, index) => (
            <li key={step.step} className="grid gap-3 border-t border-white/15 py-6 first:border-t-0 sm:grid-cols-[4rem_0.7fr_1fr] sm:items-start sm:gap-6 sm:py-8">
              <span className="text-xs font-bold tracking-[0.16em] text-[var(--laser-bright)]">0{index + 1}</span>
              <h3 className="text-xl font-bold tracking-[-0.02em] sm:text-2xl">{step.title}</h3>
              <p className="max-w-xl text-sm leading-6 text-white/62 sm:text-base sm:leading-7">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--laser-bright)]">Dudas comunes</p>
            <h3 className="mt-4 max-w-[9ch] text-4xl font-bold leading-[0.95] tracking-[-0.045em] sm:text-5xl">
              Antes de mandar mensaje.
            </h3>
          </div>
          <div className="border-t border-white/20">
            {faqs.map((faq) => (
              <details key={faq.question} className="group border-b border-white/20">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-bold sm:py-6 sm:text-lg">
                  {faq.question}
                  <Plus size={20} className="shrink-0 text-[var(--laser-bright)] transition-transform group-open:rotate-45" />
                </summary>
                <p className="max-w-2xl pb-6 pr-8 text-sm leading-7 text-white/62 sm:text-base">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
