import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { WhatsappLogo } from "@phosphor-icons/react";
import { siteConfig } from "../data/siteConfig";

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>{`Página no encontrada | ${siteConfig.name}`}</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <section className="flex min-h-[100svh] items-end bg-[var(--night)] pb-16 pt-32 text-[var(--on-night)]" data-header="dark">
        <div className="shell">
          <p className="t-mega">404</p>
          <p className="t-script t-script--light -mt-[0.1em] rotate-[-4deg] text-[clamp(2.6rem,6vw,5rem)]">esta pieza no existe</p>
          <p className="t-lead mt-8 max-w-[40ch] text-[var(--on-night-2)]">
            El enlace no lleva a ninguna página del sitio. Vuelve al inicio, mira la galería o escríbenos directo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn--laser btn--lg">
              <WhatsappLogo size={20} weight="fill" />
              {siteConfig.ctaLabel}
            </a>
            <Link to="/" className="btn btn--ghost-light btn--lg">
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
