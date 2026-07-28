import { Plus } from "lucide-react";
import Reveal from "../../components/shared/Reveal";
import SectionIntro from "../../components/shared/SectionIntro";
import { faqs } from "../../data/siteContent";

export default function FaqSection() {
  return (
    <section id="faq" className="border-y border-[var(--ink-line)] bg-[var(--ink-raised)]/40 py-14 lg:py-20">
      <div className="layout-shell grid gap-8">
        <SectionIntro
          eyebrow="Preguntas"
          title="Antes de escribir"
          description="Lo que más nos preguntan antes de cotizar por WhatsApp."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {faqs.map((faq, index) => (
            <Reveal key={faq.question} y={30} delay={(index % 2) * 0.08}>
              <article className="faq-card glass-panel editorial-card overflow-hidden">
                <details className="group p-6" open={index === 0}>
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
