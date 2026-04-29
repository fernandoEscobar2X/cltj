import ActionLink from "../../components/shared/ActionLink";
import Lightbox from "../../components/shared/Lightbox";
import Reveal from "../../components/shared/Reveal";
import SectionIntro from "../../components/shared/SectionIntro";
import WorkCard from "../../components/shared/WorkCard";
import useLightbox from "../../hooks/useLightbox";
import { featuredPortfolio } from "../../data/portfolio";

export default function FeaturedSection() {
  const lightbox = useLightbox(featuredPortfolio);

  return (
    <section id="trabajos" className="border-y border-[var(--ink-line)] bg-[var(--ink-raised)]/40 py-18 lg:py-24">
      <div className="layout-shell grid gap-10">
        <SectionIntro
          eyebrow="Portafolio"
          title="Trabajos recientes"
          description="Cada pieza es única. Algunos de nuestros favoritos."
          action={
            <ActionLink to="/galeria" variant="soft">
              Ver todos los trabajos
            </ActionLink>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredPortfolio.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <WorkCard
                item={item}
                onOpen={lightbox.open}
                featured={index === 0}
              />
            </Reveal>
          ))}
        </div>
      </div>

      <Lightbox
        item={lightbox.activeItem}
        index={lightbox.activeIndex}
        total={featuredPortfolio.length}
        onClose={lightbox.close}
        onPrev={lightbox.goPrev}
        onNext={lightbox.goNext}
      />
    </section>
  );
}
