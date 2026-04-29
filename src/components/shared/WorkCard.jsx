export default function WorkCard({ item, onOpen, featured = false }) {
  return (
    <article className={featured ? "xl:col-span-2" : ""}>
      <button
        type="button"
        onClick={() => onOpen(item.id)}
        className="work-card__button group block w-full text-left"
        aria-label={`Abrir ${item.title}`}
      >
        <div className="work-card__frame editorial-card glass-panel overflow-hidden transition duration-300">
          <div
            className={`relative overflow-hidden ${
              featured ? "aspect-[16/10]" : item.orientation === "wide" ? "aspect-[16/11]" : "aspect-[4/5]"
            }`}
          >
            <img
              className="work-card__image h-full w-full object-cover transition duration-500"
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              loading="lazy"
              decoding="async"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 grid gap-2 p-4 text-white">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/18 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] backdrop-blur">
                  {item.categoryLabel}
                </span>
                <span className="rounded-full bg-black/24 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] backdrop-blur">
                  {item.material}
                </span>
              </div>
              <div>
                <h3 className="font-['Saira_Condensed'] text-[1.8rem] leading-[0.95] tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/78">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </button>
    </article>
  );
}
