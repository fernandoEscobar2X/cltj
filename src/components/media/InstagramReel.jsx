import { useState } from "react";
import { InstagramLogo, Play } from "@phosphor-icons/react";
import Img from "./Img";

// Reel de Instagram con fachada propia: póster optimizado y botón de play. El
// iframe oficial de Instagram (y todo su JavaScript) solo se carga al pulsar,
// así que no cuesta nada en la carga inicial ni en Lighthouse.
export default function InstagramReel({ id, poster, title, caption, sizes = "(min-width: 1024px) 24vw, 78vw", className = "" }) {
  const [playing, setPlaying] = useState(false);
  const url = `https://www.instagram.com/p/${id}/`;

  return (
    <figure className={`relative m-0 overflow-hidden rounded-[2rem] bg-black ring-1 ring-white/10 ${className}`}>
      <div className="relative aspect-[9/16]">
        {playing ? (
          <iframe
            src={`${url}embed/`}
            title={`Reel de Instagram: ${title}`}
            className="absolute inset-0 h-full w-full bg-white"
            allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 block w-full text-left"
          >
            <span className="sr-only">Reproducir reel: </span>
            <Img id={poster} alt="" sizes={sizes} className="absolute inset-0" imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-[0.95rem] font-medium text-white backdrop-blur-md">
              <InstagramLogo size={18} weight="fill" />
              Reel
            </span>
            <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--laser)] text-[var(--ink)] shadow-[0_0_40px_var(--laser-glow)] transition-transform duration-500 group-hover:scale-110">
              <Play size={30} weight="fill" />
            </span>
            <span className="absolute inset-x-0 bottom-0 p-5 text-white">
              <span className="block font-display text-[2rem] font-extrabold uppercase leading-[0.9]">{title}</span>
              <span className="mt-2 block text-[1rem] leading-snug text-white/80">{caption}</span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="sr-only">
        {title}. {caption}{" "}
        <a href={url} target="_blank" rel="noopener noreferrer">
          Ver en Instagram
        </a>
      </figcaption>
    </figure>
  );
}
