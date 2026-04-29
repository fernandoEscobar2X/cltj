import { Link, NavLink, useLocation } from "react-router-dom";
import BrandLogo from "../branding/BrandLogo";
import Button from "../ui/Button";
import { siteConfig } from "../../data/siteConfig";

export default function SiteHeader() {
  const location = useLocation();
  const onGallery = location.pathname.startsWith("/galeria");

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(243,234,215,0.82)] backdrop-blur-xl">
      <div className="layout-shell flex min-h-[76px] items-center gap-4 py-3">
        <Link className="shrink-0" to="/" aria-label="CorteLáser TJ inicio">
          <BrandLogo size="sm" priority />
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-7 text-[0.78rem] font-mono uppercase tracking-[0.22em] text-[var(--paper-soft)] lg:flex"
          aria-label="Navegación principal"
        >
          {siteConfig.navItems.map((item) =>
            item.to.startsWith("/galeria") ? (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? "text-[var(--paper)]"
                    : "transition hover:text-[var(--paper)]"
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className="transition hover:text-[var(--paper)]"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            className="hidden md:inline-flex"
            size="sm"
            to={onGallery ? "/" : "/galeria"}
            variant="ghost"
          >
            {onGallery ? "Inicio" : "Galería"}
          </Button>
          <Button href={siteConfig.whatsappUrl} size="sm" variant="laser">
            Cotizar
          </Button>
        </div>
      </div>
    </header>
  );
}
