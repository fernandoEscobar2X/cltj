import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { List } from "@phosphor-icons/react";
import BrandLogo from "../branding/BrandLogo";
import Button from "../ui/Button";
import MobileMenu from "./MobileMenu";
import { siteConfig } from "../../data/siteConfig";

export default function SiteHeader() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === "/";
  const [overHero, setOverHero] = useState(isHome);
  const { scrollY } = useScroll();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Sobre el hero (foto a pantalla completa) el header es transparente y
  // blanco; al salir del hero se vuelve el header claro del resto del sitio.
  const syncHero = (y) => {
    if (!isHome) {
      setOverHero(false);
      return;
    }
    const hero = document.querySelector("#hero");
    const limit = hero ? hero.offsetHeight - 68 : 0;
    setOverHero(y < limit);
  };

  useEffect(() => {
    syncHero(window.scrollY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome]);

  useMotionValueEvent(scrollY, "change", syncHero);

  const onPhoto = overHero && isHome;

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b transition-colors duration-500 ${
          onPhoto ? "border-transparent bg-transparent" : "border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur-md"
        }`}
      >
        <div className="grid h-[68px] w-full grid-cols-[auto_1fr_auto] items-center px-5 md:px-10 xl:px-[5vw]">
          <Link className="shrink-0 transition-opacity hover:opacity-70" to="/" aria-label={`${siteConfig.name} inicio`}>
            <BrandLogo size="sm" tone={onPhoto ? "light" : "dark"} priority />
          </Link>

          <nav
            className={`hidden items-center justify-center gap-8 text-[0.92rem] lg:flex ${
              onPhoto ? "text-white/80" : "text-[var(--ink-soft)]"
            }`}
            aria-label="Navegación principal"
          >
            {siteConfig.navItems.map((item) =>
              item.to.startsWith("/#") ? (
                <Link key={item.to} to={item.to} className={onPhoto ? "hover:text-white" : "hover:text-[var(--ink)]"}>
                  {item.label}
                </Link>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 ${
                      isActive
                        ? onPhoto
                          ? "font-medium text-white"
                          : "font-medium text-[var(--ink)]"
                        : onPhoto
                          ? "hover:text-white"
                          : "hover:text-[var(--ink)]"
                    }`
                  }
                >
                  {item.seasonal ? <span className="h-1.5 w-1.5 rounded-full bg-[var(--laser)]" aria-hidden="true" /> : null}
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          {/* Sobre el hero el botón vive en el hero; aquí aparece al salir de él. */}
          <div
            className={`hidden transition-all duration-500 lg:flex ${
              onPhoto ? "pointer-events-none -translate-y-2 opacity-0" : "translate-y-0 opacity-100"
            }`}
            aria-hidden={onPhoto}
          >
            <Button href={siteConfig.whatsappUrl} size="sm" variant="accent" tabIndex={onPhoto ? -1 : undefined}>
              {siteConfig.ctaLabel}
            </Button>
          </div>

          <button
            type="button"
            className={`flex h-11 w-11 items-center justify-center lg:hidden ${onPhoto ? "text-white" : "text-[var(--ink)]"}`}
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
          >
            <List size={26} weight="regular" />
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
