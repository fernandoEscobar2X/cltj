import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import Lightbox from "../../components/shared/Lightbox";
import Parallax from "../../components/shared/Parallax";
import WorkCard from "../../components/shared/WorkCard";
import useLightbox from "../../hooks/useLightbox";
import { featuredPortfolio } from "../../data/portfolio";

// Orden editorial: la pieza más fotogénica abre en vertical; las dos que
// aguantan un recorte casi cuadrado van a su lado; el resto en fila.
// Para cambiar qué sale aquí: `featured: true` en src/data/portfolio.js y el
// id en esta lista.
const ORDER = ["mapa-mundi-led", "letrero-wafflix", "llavero-ana", "letrero-agara", "placas-halcon", "display-barber"];
const rank = (item) => {
  const index = ORDER.indexOf(item.id);
  return index === -1 ? ORDER.length : index;
};

export default function FeaturedSection() {
  const lightbox = useLightbox(featuredPortfolio);
  const [lead, second, third, ...rest] = [...featuredPortfolio].sort((a, b) => rank(a) - rank(b));

  return (
    <section id="trabajos" className="border-t border-[var(--line)] bg-[var(--bg)] py-20 md:py-28">
      <div className="layout-shell">
        <div className="flex items-end justify-between gap-6">
          <h2 className="m-0 text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1] tracking-tight">Trabajos</h2>
          <Link
            to="/galeria"
            className="group inline-flex items-center gap-2 text-sm font-medium hover:text-[var(--laser-ink)]"
          >
            Ver galería
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-12 md:gap-5">
          <div className="md:col-span-7">
            <WorkCard item={lead} onOpen={lightbox.open} featured ratio="aspect-[4/5]" />
          </div>
          <Parallax distance={36} className="grid gap-4 md:col-span-5 md:gap-5">
            <WorkCard item={second} onOpen={lightbox.open} ratio="aspect-[4/5] md:aspect-[6/5]" delay={0.1} />
            <WorkCard item={third} onOpen={lightbox.open} ratio="aspect-[4/5] md:aspect-[6/5]" delay={0.2} />
          </Parallax>
        </div>

        <div className="mt-4 grid gap-4 md:mt-5 md:grid-cols-3 md:gap-5">
          {rest.map((item, index) => (
            <Parallax key={item.id} distance={index % 2 === 0 ? 18 : 42}>
              <WorkCard item={item} onOpen={lightbox.open} ratio="aspect-[4/5]" delay={index * 0.1} />
            </Parallax>
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
