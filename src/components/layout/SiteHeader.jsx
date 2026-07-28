import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
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
            ? "border-white/10 bg-[#050505]/80 backdrop-blur-2xl shadow-2xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="w-full px-6 md:px-12 xl:px-[5vw] flex min-h-[76px] items-center justify-between py-3">
          <Link 
            className="shrink-0 transition-transform duration-300 hover:opacity-80 active:scale-95" 
            to="/" 
            aria-label="CorteLáser TJ inicio"
          >
            <BrandLogo size="sm" priority className="max-w-[120px] md:max-w-none" />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden flex-1 items-center justify-center gap-8 text-[0.78rem] font-bold uppercase tracking-[0.2em] lg:flex text-white/80"
            aria-label="Navegación principal"
          >
            {siteConfig.navItems.map((item) =>
              item.to.startsWith("/galeria") ? (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `transition-colors duration-300 ${
                      isActive ? "text-[var(--laser)] drop-shadow-[0_0_10px_rgba(198,91,255,0.5)]" : "hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  className="transition-colors duration-300 hover:text-white"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Button href={siteConfig.whatsappUrl} size="sm" variant="laser" className="shadow-[0_0_15px_rgba(198,91,255,0.2)] hover:shadow-[0_0_25px_rgba(198,91,255,0.4)]">
              Cotizar
            </Button>
          </div>

          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition-all active:scale-95 hover:bg-white/10 backdrop-blur-md"
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
