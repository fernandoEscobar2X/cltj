import { MapPin, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { siteConfig } from "../../data/siteConfig";

export default function SiteFooter() {
  return (
    <footer className="bg-[#050505] text-white pb-8 overflow-hidden relative z-10">
      <div className="w-full px-6 md:px-12 lg:px-24 xl:px-[5vw]">
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
              
              <div className="hidden md:block w-px h-4 bg-white/10 mx-2"></div>

              <a
                className="text-white/50 hover:text-white transition-colors"
                href="https://www.instagram.com/tj_laser_/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                className="text-white/50 hover:text-white transition-colors"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Bottom Bar Logo/Copyright */}
          <div className="flex flex-col xl:items-end gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 shrink-0">
            <span className="text-white font-sans font-black text-xl tracking-tighter mb-1">TJ LÁSER<span className="text-[var(--laser)]">.</span></span>
            <span>&copy; {new Date().getFullYear()} {siteConfig.legalName}</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
