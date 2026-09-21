import Shot from "./Shot";

export default function WorkCard({ item, onOpen, featured = false, ratio, delay = 0 }) {
  const shape =
    ratio ??
    (featured ? "aspect-[4/5] md:aspect-[16/11]" : item.orientation === "wide" ? "aspect-[16/11]" : "aspect-[4/5]");

  return (
    <article>
      <button
        type="button"
        onClick={() => onOpen(item.id)}
        className="group block w-full text-left"
        aria-labelledby={`work-card-title-${item.id}`}
      >
        <Shot className={`bg-[var(--bg-deep)] ${shape}`} delay={delay}>
          <img
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            src={item.src}
            srcSet={`${item.src.replace(/\.webp$/, "-small.webp")} ${Math.round(item.width / 2)}w, ${item.src} ${item.width}w`}
            sizes={
              featured
                ? "(min-width: 1024px) 55vw, 100vw"
                : "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            }
            alt={item.alt}
            width={item.width}
            height={item.height}
            loading="lazy"
            decoding="async"
          />
        </Shot>
        <h3
          id={`work-card-title-${item.id}`}
          className="mt-3 flex items-center gap-2 text-[1.05rem] font-medium leading-snug tracking-tight"
        >
          <span className="h-px w-0 bg-[var(--laser)] transition-[width] duration-500 ease-out group-hover:w-6" aria-hidden="true" />
          {item.title}
        </h3>
      </button>
    </article>
  );
}
