import ActionLink from "../../components/shared/ActionLink";
import Lightbox from "../../components/shared/Lightbox";
import SectionIntro from "../../components/shared/SectionIntro";
import WorkCard from "../../components/shared/WorkCard";
import useLightbox from "../../hooks/useLightbox";
import { featuredPortfolio } from "../../data/portfolio";

export default function FeaturedSection() {
  const lightbox = useLightbox(featuredPortfolio);
  
  // Triplicar los items para asegurar un loop perfecto en pantallas ultrawide
  const marqueeItems = [...featuredPortfolio, ...featuredPortfolio, ...featuredPortfolio];

  return (
    <section id="trabajos" className="border-y-[3px] border-[var(--ink)] bg-[var(--bg)] py-20 lg:py-32 overflow-hidden">
      <div className="layout-shell mb-16">
        <SectionIntro
          eyebrow="02 · Portafolio"
          title="Trabajos recientes"
          description="Cada pieza es única. Algunos de nuestros proyectos favoritos entregados en Tijuana."
          action={
            <ActionLink to="/galeria" variant="soft" className="text-[var(--ink)] font-bold">
              Ver todos los trabajos
            </ActionLink>
          }
        />
      </div>

      {/* Infinite Image Marquee */}
      <div className="marquee">
        <div className="marquee__track" style={{ animationDuration: '60s' }}>
          {marqueeItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="w-[300px] md:w-[450px] shrink-0">
              <WorkCard
                item={item}
                onOpen={() => lightbox.open(item)}
                featured={false}
              />
            </div>
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
