import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import BrandLogo from "../branding/BrandLogo";
import Button from "../ui/Button";
import { siteConfig } from "../../data/siteConfig";

export default function SiteHeader() {
  const location = useLocation();
  const onGallery = location.pathname.startsWith("/galeria");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-[var(--line)] bg-[rgba(243,234,215,0.82)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="layout-shell flex min-h-[76px] items-center gap-4 py-3">
        <Link 
          className={`shrink-0 transition-all duration-300 ${!scrolled ? 'brightness-0 invert opacity-90 hover:opacity-100' : 'opacity-100 hover:opacity-80'}`} 
          to="/" 
          aria-label="CorteLáser TJ inicio"
        >
          <BrandLogo size="sm" priority />
        </Link>

        <nav
          className={`hidden flex-1 items-center justify-center gap-7 text-[0.78rem] font-mono uppercase tracking-[0.22em] lg:flex ${
            scrolled ? 'text-[var(--paper-soft)]' : 'text-white/80'
          }`}
          aria-label="Navegación principal"
        >
          {siteConfig.navItems.map((item) =>
            item.to.startsWith("/galeria") ? (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition ${
                    isActive
                      ? scrolled ? 'text-[var(--paper)]' : 'text-white'
                      : scrolled ? 'hover:text-[var(--paper)]' : 'hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={`transition ${
                  scrolled ? 'hover:text-[var(--paper)]' : 'hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button href={siteConfig.whatsappUrl} size="sm" variant="laser">
            Cotizar
          </Button>
        </div>
      </div>
    </header>
  );
}
