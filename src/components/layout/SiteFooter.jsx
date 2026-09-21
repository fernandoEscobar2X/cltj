import { Link } from "react-router-dom";
import BrandLogo from "../branding/BrandLogo";
import { siteConfig } from "../../data/siteConfig";

const year = new Date().getFullYear();

// Footer claro y corto: logo, navegación, contacto, legal.
export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg-deep)]">
      <div className="layout-shell py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <Link to="/" aria-label={`${siteConfig.name} inicio`} className="inline-block transition-opacity hover:opacity-70">
              <BrandLogo size="sm" tone="dark" />
            </Link>
            <p className="mt-4 max-w-[26ch] text-[var(--ink-soft)]">{siteConfig.tagline}</p>
          </div>

          <nav className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3" aria-label="Pie de página">
            <div>
              <p className="m-0 text-xs uppercase tracking-[0.18em] text-[var(--ink-mute)]">Sitio</p>
              <ul className="m-0 mt-4 grid gap-2 p-0">
                {siteConfig.navItems.map((item) => (
                  <li key={item.to} className="list-none">
                    <Link to={item.to} className="inline-flex items-center gap-2 text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]">
                      {item.seasonal ? <span className="h-1.5 w-1.5 rounded-full bg-[var(--laser)]" aria-hidden="true" /> : null}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="m-0 text-xs uppercase tracking-[0.18em] text-[var(--ink-mute)]">Contacto</p>
              <ul className="m-0 mt-4 grid gap-2 p-0">
                <li className="list-none">
                  <a
                    href={siteConfig.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
                  >
                    WhatsApp
                  </a>
                </li>
                <li className="list-none">
                  <a
                    href={`tel:${siteConfig.phoneIntl.replace(/\s/g, "")}`}
                    className="text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                </li>
                <li className="list-none">
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="m-0 text-xs uppercase tracking-[0.18em] text-[var(--ink-mute)]">Taller</p>
              <p className="m-0 mt-4 text-[var(--ink-soft)]">{siteConfig.location}</p>
              <p className="m-0 mt-1 text-[var(--ink-mute)]">Entrega local y envíos a todo México</p>
            </div>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--line)] pt-5 text-sm text-[var(--ink-mute)] sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">
            © {year} {siteConfig.legalName}
          </p>
          <Link to="/privacidad" className="transition-colors hover:text-[var(--ink)]">
            Aviso de privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
