import Seo from "../components/seo/Seo";
import PapelStudio from "../components/papel/PapelStudio";
import { siteConfig } from "../data/siteConfig";

export default function PapelPicadoPage() {
  return (
    <div className="bg-[var(--bg)] pb-20 pt-24 md:pt-32">
      <Seo
        title={`Papel picado a medida | ${siteConfig.name}`}
        description="Arma un papel picado con plantilla, texto y logo. Cotiza la pieza por WhatsApp con el taller en Tijuana."
        path="/papel-picado"
      />
      <div className="layout-shell">
        <div className="flex items-baseline gap-4 pb-8 md:pb-12">
          <p className="m-0 text-sm font-medium text-[var(--laser-ink)]">{siteConfig.season.label}</p>
          <h1 className="m-0 text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[0.98] tracking-tight">
            {siteConfig.season.name}
          </h1>
        </div>
        <PapelStudio />
      </div>
    </div>
  );
}
