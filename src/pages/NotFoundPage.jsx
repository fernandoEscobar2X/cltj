import { Helmet } from "react-helmet-async";
import Button from "../components/ui/Button";
import { siteConfig } from "../data/siteConfig";

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>{`Página no encontrada | ${siteConfig.name}`}</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <section className="py-28 lg:py-36">
        <div className="layout-shell grid max-w-3xl gap-6">
          <h1 className="m-0 text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[1.02] tracking-tight">
            Esta página no existe
          </h1>
          <p className="max-w-xl text-base leading-8 text-[var(--ink-soft)]">
            La liga que abriste no corresponde a ninguna sección del sitio. Puedes volver al inicio,
            ver la galería o cotizar directo por WhatsApp.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={siteConfig.whatsappUrl} variant="accent">
              {siteConfig.ctaLabel}
            </Button>
            <Button to="/" variant="ghost">
              Volver al inicio
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
