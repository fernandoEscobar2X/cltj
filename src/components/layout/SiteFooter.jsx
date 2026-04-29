import { MapPin, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import BrandLogo from "../branding/BrandLogo";
import { siteConfig } from "../../data/siteConfig";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg)] pb-28 pt-14 lg:pb-12 lg:pt-16">
      <div className="layout-shell grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.9fr]">
        <div className="grid gap-4">
          <BrandLogo size="xs" className="max-w-[10rem]" />
          <p className="max-w-xl text-sm leading-7 text-[var(--paper-soft)]">
            Especialistas en corte y grabado láser en Tijuana. Piezas únicas
            para tu negocio o proyecto.
          </p>
        </div>

        <div className="grid gap-3">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[var(--paper-mute)]">
            Navegación
          </h2>
          {[
            { to: "/#servicios", label: "Servicios" },
            { to: "/#trabajos", label: "Trabajos" },
            { to: "/#proceso", label: "Proceso" },
            { to: "/galeria", label: "Galería" },
            { to: "/#contacto", label: "Contacto" },
          ].map((item) => (
            <Link
              key={item.to}
              className="text-sm text-[var(--paper-soft)] transition hover:text-[var(--paper)]"
              to={item.to}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="grid gap-3">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[var(--paper-mute)]">
            Contacto
          </h2>
          <p className="inline-flex items-center gap-2 text-sm text-[var(--paper-soft)]">
            <MapPin size={16} strokeWidth={2} className="text-[var(--laser)]" />
            {siteConfig.locationShort}
          </p>
          <a
            className="inline-flex items-center gap-2 text-sm text-[var(--paper-soft)] transition hover:text-[var(--paper)]"
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Smartphone size={16} strokeWidth={2} className="text-[var(--laser)]" />
            {siteConfig.phoneDisplay}
          </a>
        </div>
      </div>

      <div className="layout-shell mt-10 grid gap-2 border-t border-[var(--ink-line)] pt-5 font-mono text-xs uppercase tracking-[0.2em] text-[var(--paper-mute)] md:grid-cols-[1fr_auto] md:items-center">
        <span>&copy; {new Date().getFullYear()} {siteConfig.legalName}</span>
        <span>{siteConfig.tagline}</span>
      </div>
    </footer>
  );
}
