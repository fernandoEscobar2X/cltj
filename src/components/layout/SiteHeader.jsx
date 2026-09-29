import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { m, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import BrandLogo from "../branding/BrandLogo";
import MobileMenu from "./MobileMenu";
import { siteConfig } from "../../data/siteConfig";

// Cabecera que se aparta al bajar y vuelve al subir. Sobre el hero del home
// es transparente y clara; en el resto, papel con desenfoque.
export default function SiteHeader() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [onDark, setOnDark] = useState(location.pathname === "/");
  const { scrollY } = useScroll();

  useEffect(() => setMenuOpen(false), [location]);

  const sync = (y) => {
    // Oscuro mientras la cabecera está sobre una sección marcada data-header="dark".
    const probe = document.elementsFromPoint?.(window.innerWidth / 2, 36) ?? [];
    const dark = probe.some((el) => el.closest?.('[data-header="dark"]'));
    setOnDark(dark);
  };

  useEffect(() => {
    sync(window.scrollY);
    const t = window.setTimeout(() => sync(window.scrollY), 400);
    // Secciones que cambian de fondo sin scroll (escena de noche del estudio).
    const onSync = () => window.requestAnimationFrame(() => sync(window.scrollY));
    window.addEventListener("tj:header-sync", onSync);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("tj:header-sync", onSync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (!menuOpen) setHidden(y > 160 && y > prev + 2);
    if (y < prev - 2) setHidden(false);
    sync(y);
  });

  const solid = !onDark && scrollY.get() > 8;
  const tone = onDark ? "text-[var(--on-night)]" : "text-[var(--ink)]";

  return (
    <>
      <m.header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          solid ? "bg-[color-mix(in_oklab,var(--paper)_82%,transparent)] backdrop-blur-xl" : "bg-transparent"
        } ${tone}`}
        animate={{ y: hidden && !reduceMotion ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="shell grid h-[var(--header-h)] grid-cols-[1fr_auto] items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <Link className="w-fit shrink-0 transition-opacity hover:opacity-70" to="/" aria-label={`${siteConfig.name}, inicio`}>
            <BrandLogo size="sm" tone={onDark ? "light" : "dark"} priority />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
            {siteConfig.navItems.map((item) => {
              const base = "group relative rounded-full px-4 py-2 text-[0.98rem] font-medium transition-colors";
              const content = (
                <>
                  {item.seasonal ? (
                    <span className="mr-2 inline-block h-2 w-2 -translate-y-px rounded-full bg-[var(--laser)] shadow-[0_0_10px_var(--laser-glow)]" />
                  ) : null}
                  {item.label}
                  <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                </>
              );
              return item.to.startsWith("/#") ? (
                <Link key={item.to} to={item.to} className={base}>
                  {content}
                </Link>
              ) : (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `${base} ${isActive ? "opacity-100" : "opacity-85"}`}>
                  {content}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-3">
            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--laser btn--sm hidden lg:inline-flex"
            >
              {siteConfig.ctaShort}
              <ArrowUpRight size={16} weight="bold" />
            </a>
            <button
              type="button"
              className={`relative flex h-12 items-center gap-3 rounded-full pl-4 pr-2 text-[0.98rem] font-semibold lg:hidden ${
                onDark ? "bg-white/10 backdrop-blur-md" : "bg-[var(--ink)] text-[var(--paper)]"
              }`}
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
            >
              Menú
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--laser)]">
                <span className="grid gap-[5px]">
                  <span className="block h-[2px] w-4 rounded bg-[var(--ink)]" />
                  <span className="block h-[2px] w-4 rounded bg-[var(--ink)]" />
                </span>
              </span>
            </button>
          </div>
        </div>
      </m.header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
