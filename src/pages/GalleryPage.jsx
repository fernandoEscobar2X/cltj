import { startTransition, useDeferredValue, useState } from "react";
import ActionLink from "../components/shared/ActionLink";
import Lightbox from "../components/shared/Lightbox";
import Reveal from "../components/shared/Reveal";
import Seo from "../components/seo/Seo";
import WorkCard from "../components/shared/WorkCard";
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
      name: `Galería ${siteConfig.name}`,
      url: toAbsoluteUrl("/galeria"),
      description:
        "Galería de piezas personalizadas de TJ Láser en Tijuana: letreros, regalos y recuerdos a medida.",
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
            material: item.material,
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

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const deferredCategory = useDeferredValue(activeCategory);
  const visibleWorks =
    deferredCategory === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === deferredCategory);
  const lightbox = useLightbox(visibleWorks);

  const coverWork =
    portfolioItems.find((item) => item.id === "display-santiago") ??
    portfolioItems[0];

  const handleFilterChange = (nextCategory) => {
    startTransition(() => {
      setActiveCategory(nextCategory);
    });
  };

  return (
    <div className="min-h-svh bg-[var(--bg)]">
      <Seo
        title={`Galería de piezas | ${siteConfig.name} Tijuana`}
        description="Piezas personalizadas en Tijuana: letreros, displays, regalos y recuerdos a medida. Mira trabajos reales y cotiza la tuya."
        path="/galeria"
        jsonLd={gallerySchema}
      />

      <section className="relative flex min-h-[70svh] w-full flex-col justify-end overflow-hidden bg-[var(--bg-ink)] pb-16 pt-32">
        <div className="absolute inset-0">
          <img
            src={coverWork.src}
            srcSet={`${coverWork.src.replace(/\.webp$/, "-small.webp")} ${Math.round(coverWork.width / 2)}w, ${coverWork.src} ${coverWork.width}w`}
            sizes="100vw"
            alt=""
            width={coverWork.width}
            height={coverWork.height}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

        <div className="relative z-10 flex w-full flex-col items-end justify-between gap-8 px-6 md:flex-row md:px-12 xl:px-[5vw]">
          <Reveal className="flex-1">
            <h1 className="m-0 text-[clamp(2.8rem,8vw,6rem)] font-semibold leading-[0.95] tracking-tight text-white">
              Galería
            </h1>
          </Reveal>

          <Reveal delay={0.2} className="mb-4 shrink-0 md:mb-8">
            <ActionLink href={siteConfig.whatsappGalleryUrl} variant="accent">
              {siteConfig.ctaLabel}
            </ActionLink>
          </Reveal>
        </div>
      </section>

      <section className="bg-[var(--bg)] pb-20 lg:pb-32">
        <div className="grid w-full gap-8 px-6 md:px-12 xl:px-[5vw]">
          <div className="gallery-filter sticky top-[68px] z-20 flex gap-3 overflow-x-auto border-b border-[var(--line)] bg-[var(--bg)]/95 py-5 pr-20 lg:pr-0">
            {portfolioCategories.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleFilterChange(category.id)}
                  className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-5 text-sm font-medium ${
                    isActive
                      ? "border-[var(--laser)] bg-[var(--laser)] text-[#111113]"
                      : "border-[var(--line-strong)] text-[var(--ink-soft)] hover:border-[var(--ink)]"
                  }`}
                  aria-pressed={isActive}
                >
                  {category.label}
                </button>
              );
            })}
          </div>

          <h2 className="sr-only">Piezas del portafolio</h2>

          <div className="mt-4 columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3 xl:columns-4">
            {visibleWorks.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.03} className="break-inside-avoid">
                <WorkCard item={item} onOpen={lightbox.open} featured={false} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        item={lightbox.activeItem}
        index={lightbox.activeIndex}
        total={visibleWorks.length}
        onClose={lightbox.close}
        onPrev={lightbox.goPrev}
        onNext={lightbox.goNext}
      />
    </div>
  );
}
