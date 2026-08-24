import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import BrandLogo from "../branding/BrandLogo";
import Button from "../ui/Button";
import MobileMenu from "./MobileMenu";
import { siteConfig } from "../../data/siteConfig";

export default function SiteHeader() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-500 ${
          scrolled
            ? "border-black/12 bg-white/96 shadow-[0_10px_24px_rgba(17,16,20,0.07)] backdrop-blur-xl"
            : "border-black/8 bg-white/94 backdrop-blur-lg"
        }`}
      >
        <div className="flex min-h-[72px] w-full items-center justify-between px-4 py-3 sm:px-6 md:px-12 xl:px-[5vw]">
          <Link 
            className="shrink-0 transition-transform duration-300 hover:opacity-80 active:scale-95" 
            to="/" 
            aria-label="CorteLáser TJ inicio"
          >
            <BrandLogo size="sm" variant="dark" priority className="max-w-[112px] sm:max-w-[132px] md:max-w-none" />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden flex-1 items-center justify-center gap-8 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[var(--ink-soft)] lg:flex"
            aria-label="Navegación principal"
          >
            {siteConfig.navItems.map((item) =>
              item.to.startsWith("/galeria") ? (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `transition-colors duration-300 ${
                      isActive ? "text-[var(--laser-deep)]" : "hover:text-[var(--ink)]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  className="transition-colors duration-300 hover:text-[var(--ink)]"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Button href={siteConfig.whatsappUrl} size="sm" variant="laser">
              Cotizar <ArrowUpRight size={15} />
            </Button>
          </div>

          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center bg-[var(--ink)] text-white transition-all active:scale-95 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
          >
            <Menu size={20} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Mobile Fullscreen Overlay */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
