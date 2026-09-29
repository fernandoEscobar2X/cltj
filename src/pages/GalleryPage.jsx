import { startTransition, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { WhatsappLogo } from "@phosphor-icons/react";
import Img from "../components/media/Img";
import Lightbox from "../components/shared/Lightbox";
import Seo from "../components/seo/Seo";
import { Pills } from "../components/papel/StudioControls";
import useLightbox from "../hooks/useLightbox";
import { portfolioCategories, portfolioItems } from "../data/portfolio";
import { breadcrumbSchema, businessRef, websiteId } from "../data/schema";
import { siteConfig } from "../data/siteConfig";
import { toAbsoluteUrl } from "../lib/url";

const gallerySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${toAbsoluteUrl("/galeria")}#page`,
      name: `Galería de trabajos de ${siteConfig.name}`,
      url: toAbsoluteUrl("/galeria"),
      description:
        "Trabajos reales de corte láser en Tijuana: letreros de acrílico, displays con QR, vinil, imanes, trofeos, regalos y papel picado.",
      inLanguage: "es-MX",
      about: businessRef,
      publisher: businessRef,
      isPartOf: { "@id": websiteId },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: portfolioItems.length,
        itemListElement: portfolioItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "ImageObject",
            "@id": `${toAbsoluteUrl("/galeria")}#${item.id}`,
            name: item.title,
            caption: item.alt,
            description: item.description,
            contentUrl: toAbsoluteUrl(item.src),
            width: item.width,
            height: item.height,
            genre: item.categoryLabel,
            creator: businessRef,
          },
        })),
      },
    },
    breadcrumbSchema([
      ["Inicio", "/"],
      ["Galería", "/galeria"],
    ]),
  ],
};

// Las categorías vacías no se muestran como filtro.
const categories = portfolioCategories.filter((c) => c.id === "all" || portfolioItems.some((i) => i.category === c.id));

export default function GalleryPage() {
  const reduceMotion = useReducedMotion();
  const [category, setCategory] = useState("all");
  const visible = category === "all" ? portfolioItems : portfolioItems.filter((item) => item.category === category);
  const lightbox = useLightbox(visible);

  return (
    <div className="min-h-svh bg-[var(--paper)]">
      <Seo
        title={`Galería: letreros, trofeos, vinil y regalos hechos en Tijuana | ${siteConfig.name}`}
        description="Trabajos reales de corte láser en Tijuana: letreros de acrílico, displays con QR, vinil, imanes, trofeos, regalos y papel picado. Mira y cotiza el tuyo."
        path="/galeria"
        jsonLd={gallerySchema}
      />

      <header className="shell pb-10 pt-[calc(var(--header-h)+3.5rem)] md:pb-14 md:pt-[calc(var(--header-h)+6rem)]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <h1 className="t-display">Galería</h1>
            <p className="t-script -mt-[0.05em] rotate-[-3deg] text-[clamp(2.4rem,5vw,4.6rem)]">{portfolioItems.length} piezas entregadas</p>
          </div>
          <a href={siteConfig.whatsappGalleryUrl} target="_blank" rel="noopener noreferrer" className="btn btn--laser btn--lg">
            <WhatsappLogo size={20} weight="fill" />
            Quiero una pieza así
          </a>
        </div>
      </header>

      <div className="sticky top-0 z-20 border-y border-[var(--line)] bg-[var(--paper)]/92 py-3 backdrop-blur-xl">
        <div className="hide-scrollbar shell overflow-x-auto">
          <Pills
            id="galeria"
            items={categories}
            value={category}
            onChange={(id) => startTransition(() => setCategory(id))}
            className="w-max"
          />
        </div>
      </div>

      <section className="shell pb-28 pt-8 md:pt-12" aria-label="Trabajos">
        <h2 className="sr-only">Trabajos de corte láser</h2>
        <m.div layout={!reduceMotion} className="columns-2 gap-3 md:columns-3 md:gap-5 xl:columns-4">
          {visible.map((item, i) => (
            <m.button
              key={item.id}
              type="button"
              layout={!reduceMotion}
              onClick={() => lightbox.open(item.id)}
              className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-[var(--radius-m)] text-left md:mb-5"
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.8, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Img
                id={item.media}
                alt={item.alt}
                sizes="(min-width: 1280px) 24vw, (min-width: 768px) 32vw, 48vw"
                priority={i === 0}
                eager={i < 4}
                style={{ aspectRatio: `${item.width} / ${item.height}` }}
                imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 pt-14 text-white md:translate-y-2 md:p-5 md:opacity-0 md:transition-all md:duration-500 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                <span className="block font-display text-[1.5rem] font-extrabold uppercase leading-[0.9] md:text-[2rem]">{item.title}</span>
                <span className="mt-1 hidden text-[0.98rem] text-white/80 md:block">{item.material}</span>
              </span>
            </m.button>
          ))}
        </m.div>
      </section>

      <Lightbox
        item={lightbox.activeItem}
        index={lightbox.activeIndex}
        total={visible.length}
        onClose={lightbox.close}
        onPrev={lightbox.goPrev}
        onNext={lightbox.goNext}
      />
    </div>
  );
}
