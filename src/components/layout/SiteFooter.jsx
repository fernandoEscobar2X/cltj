import { Link } from "react-router-dom";
import { ArrowUpRight, InstagramLogo, Phone, WhatsappLogo } from "@phosphor-icons/react";
import { siteConfig } from "../../data/siteConfig";
import { services } from "../../data/siteContent";

const year = new Date().getFullYear();

// Cierre del sitio: noche, contacto completo (la ficha local que leen Google y
// los asistentes) y el rótulo del taller a todo lo ancho.
export default function SiteFooter() {
  return (
    <footer className="defer-render relative overflow-hidden bg-[var(--night)] text-[var(--on-night)]" data-header="dark">
      <div className="shell grid gap-14 pb-16 pt-20 md:pb-24 md:pt-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="t-statement max-w-[14ch]">¿Lo imaginas? Lo cortamos.</p>
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-[1.1rem] font-semibold text-[var(--laser)]"
          >
            <WhatsappLogo size={20} weight="fill" />
            <span className="link-line">WhatsApp {siteConfig.phoneDisplay}</span>
          </a>
        </div>

        <nav className="grid grid-cols-2 gap-10 text-[1.02rem] sm:grid-cols-3 lg:col-span-7" aria-label="Pie de página">
          <div>
            <h2 className="t-label text-[var(--on-night-3)]">Servicios</h2>
            <ul className="m-0 mt-4 grid gap-2.5 p-0">
              {services.map((service) => (
                <li key={service.id} className="list-none">
                  <Link to={service.to ?? `/#servicios`} className="link-line text-[var(--on-night-2)] hover:text-[var(--on-night)]">
                    {service.long}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="t-label text-[var(--on-night-3)]">Sitio</h2>
            <ul className="m-0 mt-4 grid gap-2.5 p-0">
              {siteConfig.navItems.map((item) => (
                <li key={item.to} className="list-none">
                  <Link to={item.to} className="link-line text-[var(--on-night-2)] hover:text-[var(--on-night)]">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="list-none">
                <Link to="/privacidad" className="link-line text-[var(--on-night-2)] hover:text-[var(--on-night)]">
                  Aviso de privacidad
                </Link>
              </li>
            </ul>
          </div>
          <address className="col-span-2 not-italic sm:col-span-1">
            <h2 className="t-label text-[var(--on-night-3)]">Taller</h2>
            <p className="mt-4 text-[var(--on-night-2)]">{siteConfig.location}</p>
            <p className="mt-1 text-[var(--on-night-2)]">Envíos a todo México</p>
            <ul className="m-0 mt-4 grid gap-2.5 p-0">
              <li className="list-none">
                <a href={`tel:${siteConfig.phoneIntl.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-[var(--on-night-2)] hover:text-[var(--on-night)]">
                  <Phone size={18} />
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li className="list-none">
                <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[var(--on-night-2)] hover:text-[var(--on-night)]">
                  <InstagramLogo size={18} />
                  @tj_laser_
                  <ArrowUpRight size={14} />
                </a>
              </li>
            </ul>
          </address>
        </nav>
      </div>

      {/* El rótulo: ocupa todo el ancho y se corta con el borde, como una pieza recién salida de la cama láser. */}
      <div className="relative select-none" aria-hidden="true">
        <p className="t-mega whitespace-nowrap pl-[2vw] text-[21vw] leading-[0.74] text-[var(--on-night)] opacity-95">
          TJ Láser
        </p>
      </div>

      <div className="shell flex flex-col gap-2 border-t border-[var(--line-night)] py-5 text-[0.95rem] text-[var(--on-night-3)] sm:flex-row sm:justify-between">
        <p>
          © {year} {siteConfig.legalName} · {siteConfig.tagline}
        </p>
        <p>Imagina · Corta · Crea</p>
      </div>
    </footer>
  );
}
