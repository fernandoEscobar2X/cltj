import { startTransition, useDeferredValue, useState } from "react";
import BrandLogo from "../components/branding/BrandLogo";
import ActionLink from "../components/shared/ActionLink";
import Lightbox from "../components/shared/Lightbox";
import Reveal from "../components/shared/Reveal";
import Seo from "../components/seo/Seo";
import WorkCard from "../components/shared/WorkCard";
import useLightbox from "../hooks/useLightbox";
import { portfolioCategories, portfolioItems } from "../data/portfolio";
import { siteConfig } from "../data/siteConfig";
import { toAbsoluteUrl } from "../lib/url";

const gallerySchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `Galería ${siteConfig.name}`,
  url: toAbsoluteUrl("/galeria"),
  image: toAbsoluteUrl(siteConfig.shareImage),
  description:
    "Portafolio de trabajos de corte y grabado láser de CorteLáser TJ en Tijuana.",
  about: {
    "@type": "LocalBusiness",
    name: siteConfig.name,
    alternateName: siteConfig.legalName,
    telephone: siteConfig.phoneIntl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tijuana",
      addressRegion: "Baja California",
      addressCountry: "MX",
    },
  },
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
    <>
      <Seo
        title="Galería de trabajos | CorteLáser TJ Tijuana"
        description="Portafolio de CorteLáser TJ en Tijuana. Displays, señalética, llaveros, decoración y reconocimientos hechos con precisión láser."
        path="/galeria"
        jsonLd={gallerySchema}
      />

      <section className="pb-10 pt-8 lg:pb-14 lg:pt-10">
        <div className="editorial-shell grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <Reveal>
            <div className="grid gap-5">
              <p className="section-eyebrow">Portafolio · CorteLáser TJ</p>
              <h1 className="max-w-[11ch] font-['Saira_Condensed'] text-[clamp(3rem,7vw,6.1rem)] font-extrabold leading-[0.86] tracking-[-0.03em] text-[var(--paper)]">
                Trabajos recientes
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[#3a342f]">
                Cada pieza es única y hecha a medida. Filtra por tipo de trabajo
                para ver displays, señalética, llaveros, decoración o
                reconocimientos.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ActionLink href={siteConfig.whatsappGalleryUrl} variant="dark">
                  Cotizar por WhatsApp
                </ActionLink>
                <ActionLink to="/#proceso" variant="soft">
                  Ver proceso
                </ActionLink>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="glass-panel editorial-card grid gap-5 overflow-hidden p-6">
              <div className="laser-line w-full" />
              <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-start">
                <div className="grid gap-2">
                  <p className="section-eyebrow">En galería</p>
                  <strong className="font-['Saira_Condensed'] text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold leading-[0.86] text-[var(--paper)]">
                    {visibleWorks.length} trabajo
                    {visibleWorks.length === 1 ? "" : "s"}
                  </strong>
                  <p className="text-sm leading-7 text-[#3a342f]">
                    Filtro directo por categoría. Haz clic en cualquier pieza
                    para verla en grande.
                  </p>
                </div>
                <BrandLogo size="xs" className="max-w-[8rem] justify-self-start lg:justify-self-end" />
              </div>
              <img
                src={coverWork.src}
                srcSet={`${coverWork.src.replace(/\.webp$/, "-small.webp")} ${Math.round(coverWork.width / 2)}w, ${coverWork.src} ${coverWork.width}w`}
                sizes="(min-width: 1024px) 46vw, 100vw"
                alt={coverWork.alt}
                width={coverWork.width}
                height={coverWork.height}
                className="max-h-[340px] w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-18 lg:pb-24">
        <div className="layout-shell grid gap-6">
          <div className="gallery-filter flex gap-3 overflow-x-auto pb-2">
            {portfolioCategories.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleFilterChange(category.id)}
                  className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition ${
                    isActive
                      ? "border-[rgba(198,91,255,0.28)] bg-[rgba(198,91,255,0.14)] text-[var(--paper)]"
                      : "border-black/10 bg-white/75 text-[#3a342f] hover:text-[var(--paper)]"
                  }`}
                  aria-pressed={isActive}
                >
                  {category.label}
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleWorks.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.03}>
                <WorkCard item={item} onOpen={lightbox.open} />
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
    </>
  );
}
