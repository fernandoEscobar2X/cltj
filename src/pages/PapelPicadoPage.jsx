import { useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Plus } from "@phosphor-icons/react";
import Seo from "../components/seo/Seo";
import Img, { mediaUrl } from "../components/media/Img";
import Reveal from "../components/shared/Reveal";
import PapelStudio from "../components/papel/PapelStudio";
import { formatMXN, papelDesigns, papelPackages, papelSizes, papelWholesaleFrom } from "../data/papelPicado";
import { breadcrumbSchema, businessRef, websiteId } from "../data/schema";
import { siteConfig } from "../data/siteConfig";
import { toAbsoluteUrl } from "../lib/url";

const prices = papelSizes.flatMap((s) => papelPackages.map((p) => s.prices[p]));

const faqs = [
  {
    question: "¿Cuánto cuesta el papel picado personalizado en Tijuana?",
    answer: `En papel de china, el paquete de 25 piezas cuesta ${formatMXN(papelSizes[0].prices[25])} en medida chica (45 × 35 cm) y ${formatMXN(papelSizes[1].prices[25])} en grande (65 × 45 cm). Hay paquetes de 50 y 100 piezas, y precio de mayoreo desde ${papelWholesaleFrom} piezas.`,
  },
  {
    question: "¿Puedo poner mi nombre o el logo de mi negocio?",
    answer:
      "Sí. Los diseños “Con nombre” cambian su texto por el tuyo (nombres, iniciales o una frase corta) y los diseños “Nombre o logo” tienen un espacio libre para tu nombre o para el logo de tu marca.",
  },
  {
    question: "¿Puedo mezclar diseños o colores en el mismo pedido?",
    answer:
      "No. Cada pedido lleva un solo diseño y un solo color: toda la tira sale con el mismo corte. Si necesitas otro diseño o color, se hace como un pedido aparte.",
  },
  {
    question: "¿De qué material es?",
    answer: "De papel de china, cortado con láser. El corte queda limpio y el texto lleva letra stencil para que ningún centro de letra se caiga.",
  },
  {
    question: "¿Cómo lo pido?",
    answer:
      "Arma tu diseño en esta página y pulsa “Pedir por WhatsApp”: se abre la conversación con el taller con tu diseño, color, medida y paquete. Te confirmamos la muestra y la fecha de entrega antes de cortar.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${toAbsoluteUrl("/papel-picado")}#page`,
      url: toAbsoluteUrl("/papel-picado"),
      name: "Papel picado personalizado en Tijuana",
      inLanguage: "es-MX",
      isPartOf: { "@id": websiteId },
      about: businessRef,
    },
    {
      "@type": "Product",
      "@id": `${toAbsoluteUrl("/papel-picado")}#producto`,
      name: "Papel picado personalizado",
      description:
        "Papel picado de papel de china cortado con láser, con nombre, iniciales o logo. 20 diseños para bodas, XV, bautizos, cumpleaños, Día de Muertos, Halloween y negocios.",
      brand: { "@type": "Brand", name: siteConfig.name },
      material: "Papel de china",
      image: [toAbsoluteUrl(mediaUrl("papel-picado-bon-dia")), toAbsoluteUrl(mediaUrl("papel-picado-logo"))],
      manufacturer: businessRef,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "MXN",
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: prices.length,
        availability: "https://schema.org/InStock",
        seller: businessRef,
        areaServed: { "@type": "Country", name: "México" },
      },
      additionalProperty: papelSizes.map((s) => ({ "@type": "PropertyValue", name: `Medida ${s.label.toLowerCase()}`, value: s.dims })),
    },
    {
      "@type": "FAQPage",
      "@id": `${toAbsoluteUrl("/papel-picado")}#faq`,
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
    },
    breadcrumbSchema([
      ["Inicio", "/"],
      ["Papel picado", "/papel-picado"],
    ]),
  ],
};

function Faq({ item, open, onToggle, id }) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="border-b border-[var(--line-2)]">
      <h3>
        <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={`${id}-p`} className="flex w-full items-center justify-between gap-6 py-6 text-left">
          <span className="font-statement text-[clamp(1.3rem,2vw,1.7rem)] font-bold leading-tight [font-stretch:85%]">{item.question}</span>
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--line-2)] transition-all duration-500 ${open ? "rotate-45 border-[var(--laser)] bg-[var(--laser)]" : ""}`} aria-hidden="true">
            <Plus size={18} weight="bold" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open ? (
          <m.div
            id={`${id}-p`}
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-[60ch] pb-7 text-[1.1rem] leading-relaxed text-[var(--ink-2)]">{item.answer}</p>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function PapelPicadoPage() {
  const [open, setOpen] = useState(0);
  const withName = papelDesigns.filter((d) => d.kind !== "listo").length;

  return (
    <div className="bg-[var(--paper)]">
      <Seo
        title={`Papel picado personalizado en Tijuana, con nombre o logo | ${siteConfig.name}`}
        description={`Arma tu papel picado con nombre o logo: 20 diseños, papel de china cortado con láser. Paquetes desde ${formatMXN(Math.min(...prices))} (25 piezas). Pide por WhatsApp.`}
        path="/papel-picado"
        image={mediaUrl("papel-picado-logo")}
        jsonLd={pageSchema}
      />
      <h1 className="sr-only">Papel picado personalizado con nombre o logo en Tijuana</h1>

      <PapelStudio />

      <section className="py-24 md:py-36" aria-labelledby="como">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <h2 id="como" className="t-h2">
              Cortado con láser
            </h2>
            <p className="t-script -mt-[0.05em] rotate-[-3deg] text-[clamp(2.4rem,4.4vw,4rem)]">en papel de china</p>
            <p className="t-lead mt-6 max-w-[38ch] text-[var(--ink-2)]">
              20 diseños del taller: {withName} llevan tu nombre o tu logo y el resto se piden tal cual. Un diseño y un color por pedido, para que toda la tira salga pareja.
            </p>

            <div className="mt-10 overflow-hidden rounded-[var(--radius-l)] border border-[var(--line-2)] bg-[var(--card)]">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Precios del papel picado personalizado por medida y paquete</caption>
                <thead>
                  <tr className="border-b border-[var(--line-2)]">
                    <th scope="col" className="px-5 py-4 text-[1rem] font-semibold text-[var(--ink-2)]">
                      Paquete
                    </th>
                    {papelSizes.map((s) => (
                      <th key={s.id} scope="col" className="px-5 py-4 text-right">
                        <span className="block font-display text-[1.6rem] font-extrabold uppercase leading-none">{s.label}</span>
                        <span className="block text-[0.95rem] font-normal text-[var(--ink-3)]">{s.dims}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {papelPackages.map((p) => (
                    <tr key={p} className="border-b border-[var(--line)] last:border-0">
                      <th scope="row" className="px-5 py-4 font-statement text-[1.25rem] font-bold [font-stretch:85%]">
                        {p} piezas
                      </th>
                      {papelSizes.map((s) => (
                        <td key={s.id} className="px-5 py-4 text-right font-display text-[1.6rem] font-extrabold tabular-nums">
                          {formatMXN(s.prices[p])}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-[var(--paper-2)]">
                    <th scope="row" className="px-5 py-4 font-statement text-[1.25rem] font-bold [font-stretch:85%]">
                      Mayoreo
                    </th>
                    <td colSpan={2} className="px-5 py-4 text-right text-[1.02rem] text-[var(--ink-2)]">
                      Desde {papelWholesaleFrom} piezas, se cotiza
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 lg:col-span-6 lg:col-start-7">
            <Reveal className="col-span-2">
              <figure className="m-0">
                <Img id="papel-picado-logo" alt="Papel picado morado cortado con el logotipo de T.J.Maxx" sizes="(min-width: 1024px) 45vw, 92vw" className="aspect-[16/10] rounded-[var(--radius-l)]" />
                <figcaption className="mt-3 text-[1rem] text-[var(--ink-3)]">Con el logo de la marca, para punto de venta.</figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.1}>
              <figure className="m-0">
                <Img id="papel-picado-bon-dia" alt="Papel picado blanco con el logotipo de Bon Día Panadería Artesanal" sizes="(min-width: 1024px) 22vw, 45vw" className="aspect-[3/4] rounded-[var(--radius-l)]" />
                <figcaption className="mt-3 text-[1rem] text-[var(--ink-3)]">Bon Día Panadería.</figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.2} className="self-end">
              <figure className="m-0">
                <Img id="papel-picado-tira" alt="Tira de papel picado rojo, verde y amarillo con la palabra Personaliza" sizes="(min-width: 1024px) 22vw, 45vw" className="aspect-[3/4] rounded-[var(--radius-l)]" />
                <figcaption className="mt-3 text-[1rem] text-[var(--ink-3)]">Colgado en el taller.</figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-[var(--card)] py-24 md:py-32" aria-labelledby="dudas">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="dudas" className="t-h2">
              Dudas
            </h2>
            <p className="t-script -mt-[0.05em] rotate-[-3deg] text-[clamp(2.2rem,4vw,3.4rem)]">del papel picado</p>
          </div>
          <div className="lg:col-span-8">
            {faqs.map((item, i) => (
              <Faq key={item.question} id={`pfaq-${i}`} item={item} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
