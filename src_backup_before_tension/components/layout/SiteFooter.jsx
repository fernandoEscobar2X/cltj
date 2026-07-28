import { MapPin, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { siteConfig } from "../../data/siteConfig";

export default function SiteFooter() {
  return (
    <footer className="bg-[#050505] text-white pb-8 overflow-hidden relative z-10">
      <div className="layout-shell">
        <div className="border-t border-white/10 pt-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
          
          {/* Navigation & Contact Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
            {/* Nav */}
            <div className="flex flex-wrap items-center gap-6">
              {[
                { to: "/#servicios", label: "Servicios" },
                { to: "/#trabajos", label: "Trabajos" },
                { to: "/#proceso", label: "Proceso" },
                { to: "/galeria", label: "Galería" },
              ].map((item) => (
                <Link
                  key={item.to}
                  className="text-xs md:text-sm font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest"
                  to={item.to}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Separator for desktop */}
            <div className="hidden md:block w-px h-6 bg-white/10"></div>

            {/* Contact Details */}
            <div className="flex flex-wrap items-center gap-6">
              <p className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-white/50 uppercase tracking-widest">
                <MapPin size={16} className="text-[var(--laser)]" />
                {siteConfig.locationShort}
              </p>
              <a
                className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest"
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Smartphone size={16} className="text-[var(--laser)]" />
                {siteConfig.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Bottom Bar Logo/Copyright */}
          <div className="flex flex-col xl:items-end gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 shrink-0">
            <span className="text-white font-sans font-black text-xl tracking-tighter mb-1">TJ LÁSER<span className="text-[var(--laser)]">.</span></span>
            <span>&copy; {new Date().getFullYear()} {siteConfig.legalName}</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
