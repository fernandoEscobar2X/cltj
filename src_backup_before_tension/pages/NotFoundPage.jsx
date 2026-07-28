import { Helmet } from "react-helmet-async";
import Button from "../components/ui/Button";
import { siteConfig } from "../data/siteConfig";

export default function NotFoundPage() {
  return (
    <>
      {/* Sin canonical y con noindex: estas URLs no deben entrar al indice. */}
      <Helmet>
        {/* Helmet exige un unico hijo string: partirlo en dos nodos deja el
            <title> vacio en el HTML generado. */}
        <title>{`Página no encontrada | ${siteConfig.name}`}</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <section className="py-20 lg:py-28">
        <div className="layout-shell grid max-w-3xl gap-6">
          <p className="section-eyebrow">Error 404</p>
          <h1 className="font-['Saira_Condensed'] text-[clamp(3rem,8vw,6rem)] font-extrabold leading-[0.86] tracking-[-0.03em] text-[var(--paper)]">
            Esta página no existe
          </h1>
          <p className="max-w-xl text-base leading-8 text-[var(--ink-soft)]">
            La liga que abriste no corresponde a ninguna sección del sitio. Puedes
            volver al inicio, ver la galería de trabajos o escribirnos
            directamente por WhatsApp.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button to="/" variant="laser" size="lg">
              Volver al inicio
            </Button>
            <Button to="/galeria" variant="ghost" size="lg">
              Ver galería
            </Button>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink-mute)]">
            WhatsApp {siteConfig.phoneDisplay}
          </p>
        </div>
      </section>
    </>
  );
}
