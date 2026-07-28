import { Plus } from "lucide-react";
import Reveal from "../../components/shared/Reveal";
import SectionIntro from "../../components/shared/SectionIntro";
import { faqs } from "../../data/siteContent";

export default function FaqSection() {
  return (
    <section id="faq" className="border-y border-[var(--ink-line)] bg-[var(--ink-raised)]/40 py-18 lg:py-24">
      <div className="layout-shell grid gap-10">
        <SectionIntro
          eyebrow="Preguntas"
          title="Antes de escribir"
          description="Lo que más nos preguntan antes de cotizar."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {faqs.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 0.04}>
              <article className="faq-card glass-panel editorial-card overflow-hidden">
                <details className="group p-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-['Saira_Condensed'] text-[1.65rem] font-bold leading-[0.95] tracking-[-0.02em] text-[var(--paper)]">
                    <span>{faq.question}</span>
                    <Plus
                      size={20}
                      strokeWidth={2}
                      className="mt-2 shrink-0 text-[var(--laser)] transition group-open:rotate-45"
                    />
                  </summary>
                  <p className="pt-4 text-sm leading-7 text-[var(--paper-soft)]">
                    {faq.answer}
                  </p>
                </details>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
