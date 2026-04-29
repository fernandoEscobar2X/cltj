import Reveal from "../../components/shared/Reveal";
import SectionIntro from "../../components/shared/SectionIntro";
import { processSteps } from "../../data/siteContent";

export default function ProcessSection() {
  return (
    <section id="proceso" className="py-18 lg:py-24">
      <div className="layout-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="grid gap-5">
            <SectionIntro
              eyebrow="Cómo trabajamos"
              title="Proceso simple"
              description="Del concepto al producto en el menor tiempo posible."
              compact
            />
          </div>
        </Reveal>

        <div className="grid gap-4">
          {processSteps.map((step, index) => (
            <Reveal key={step.step} delay={index * 0.05}>
              <article className="glass-panel editorial-card grid gap-4 p-6 md:grid-cols-[72px_1fr]">
                <span className="font-['Saira_Condensed'] text-[3rem] font-extrabold leading-[0.86] text-[var(--laser)]">
                  {step.step}
                </span>
                <div className="grid gap-2">
                  <h3 className="font-['Saira_Condensed'] text-[1.95rem] font-bold leading-[0.92] tracking-[-0.02em] text-[var(--paper)]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-7 text-[var(--paper-soft)]">
                    {step.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
