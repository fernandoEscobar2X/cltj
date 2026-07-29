import { startTransition, useDeferredValue, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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

// about y publisher apuntan por @id al MISMO negocio declarado en la home, en
// vez de volver a describirlo aqui. Antes cada pagina definia su propio
// LocalBusiness suelto y los buscadores veian dos negocios distintos con el
// mismo nombre en lugar de una entidad con dos paginas.
const gallerySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${toAbsoluteUrl("/galeria")}#page`,
      name: `Galería ${siteConfig.name}`,
      url: toAbsoluteUrl("/galeria"),
      description:
        "Portafolio de trabajos de corte y grabado láser de CorteLáser TJ en Tijuana.",
      inLanguage: "es-MX",
      about: businessRef,
      publisher: businessRef,
      isPartOf: { "@id": websiteId },
      // Cada pieza como ImageObject con su material y categoria: los buscadores
      // reciben trabajos descritos, no un muro de fotos sin contexto.
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
  const reduceMotion = useReducedMotion();

  // Use a highly visual piece for the hero background
  const coverWork =
    portfolioItems.find((item) => item.id === "display-santiago") ??
    portfolioItems[0];

  const handleFilterChange = (nextCategory) => {
    startTransition(() => {
      setActiveCategory(nextCategory);
    });
  };

  return (
    <div className="bg-[#050505] min-h-svh">
      <Seo
        title="Galería de trabajos | CorteLáser TJ Tijuana"
        description="Portafolio de CorteLáser TJ en Tijuana. Displays, señalética, llaveros, decoración y reconocimientos hechos con precisión láser."
        path="/galeria"
        jsonLd={gallerySchema}
      />

      {/* IMMERSIVE HERO */}
      <section className="relative flex min-h-[70svh] w-full flex-col justify-end overflow-hidden bg-[#050505] pb-16 pt-32">
        {/* Fondo ambiental: alt vacio porque el h1 ya nombra la seccion, y el
            zoom infinito se apaga con prefers-reduced-motion (WCAG 2.2.2). */}
        <motion.div
          className="absolute inset-0 h-[115%] w-full"
          initial={reduceMotion ? false : { scale: 1.0 }}
          animate={reduceMotion ? undefined : { scale: 1.08 }}
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 25,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }
          }
        >
          <img
            src={coverWork.src}
            srcSet={`${coverWork.src.replace(/\.webp$/, "-small.webp")} ${Math.round(coverWork.width / 2)}w, ${coverWork.src} ${coverWork.width}w`}
            sizes="100vw"
            alt=""
            width={coverWork.width}
            height={coverWork.height}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale-[20%]"
          />
        </motion.div>
        
        {/* Dark Gradient Overlay to ensure text and logo pop */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505]/40" />

        <div className="w-full px-6 md:px-12 xl:px-[5vw] relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <Reveal className="flex-1">
            <p className="text-white/50 font-mono uppercase tracking-[0.3em] mb-4 text-sm md:text-base">
              Portafolio Exclusivo
            </p>
            <h1 className="m-0 text-[clamp(4.5rem,11vw,16rem)] font-black tracking-tighter text-white drop-shadow-2xl leading-[0.85]">
              GALERÍA<span className="text-[var(--laser)]">.</span>
            </h1>
          </Reveal>
          
          <Reveal delay={0.2} className="shrink-0 mb-4 md:mb-8">
            <ActionLink href={siteConfig.whatsappGalleryUrl} className="!bg-[var(--laser)] !text-black hover:scale-105 shadow-[0_0_30px_rgba(198,91,255,0.3)]">
              Cotizar un proyecto
            </ActionLink>
          </Reveal>
        </div>
      </section>

      {/* MASONRY GRID SECTION */}
      <section className="pb-18 lg:pb-32 bg-[#050505]">
        <div className="w-full px-6 md:px-12 xl:px-[5vw] grid gap-8">
          {/* Sticky Filter Bar (Dark Mode) */}
          {/* pr-20 en movil: el boton flotante de WhatsApp se monta sobre la
              esquina inferior derecha y tapaba el ultimo filtro cuando la barra
              quedaba a esa altura. El espacio deja correrlo fuera del boton. */}
          <div className="gallery-filter flex gap-3 overflow-x-auto pb-2 pr-20 lg:pr-0 sticky top-[76px] z-20 bg-[#050505]/90 backdrop-blur-xl py-6 border-b border-white/5">
            {portfolioCategories.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleFilterChange(category.id)}
                  className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-6 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? "border-[rgba(198,91,255,0.4)] bg-[var(--laser)] text-black shadow-[0_0_20px_rgba(198,91,255,0.3)]"
                      : "border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/10"
                  }`}
                  aria-pressed={isActive}
                >
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Las piezas usan h3, asi que sin este h2 el documento salta de h1
              a h3 y rompe el orden de encabezados para lectores de pantalla. */}
          <h2 className="sr-only">Piezas del portafolio</h2>

          {/* Masonry Columns */}
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 mt-4">
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
