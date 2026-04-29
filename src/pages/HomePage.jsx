import Seo from "../components/seo/Seo";
import { portfolioItems } from "../data/portfolio";
import { siteConfig } from "../data/siteConfig";
import { toAbsoluteUrl } from "../lib/url";
import ContactSection from "../sections/home/ContactSection";
import FaqSection from "../sections/home/FaqSection";
import FeaturedSection from "../sections/home/FeaturedSection";
import HeroSection from "../sections/home/HeroSection";
import ProcessSection from "../sections/home/ProcessSection";
import ServicesSection from "../sections/home/ServicesSection";
import TrustSection from "../sections/home/TrustSection";

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteConfig.name,
  alternateName: siteConfig.legalName,
  image: toAbsoluteUrl(siteConfig.shareImage),
  url: toAbsoluteUrl("/"),
  telephone: siteConfig.phoneIntl,
  description:
    "Corte y grabado láser en Tijuana. Displays acrílicos, llaveros, señalética y piezas personalizadas con entrega express.",
  areaServed: ["Tijuana", "Baja California", "México"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tijuana",
    addressRegion: "Baja California",
    addressCountry: "MX",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteConfig.phoneIntl,
    contactType: "customer service",
    areaServed: "MX",
    availableLanguage: ["es"],
  },
  makesOffer: portfolioItems.slice(0, 5).map((item) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Product",
      name: item.title,
      description: item.description,
    },
  })),
};

export default function HomePage() {
  return (
    <>
      <Seo
        title="CorteLáser TJ | Corte y grabado láser en Tijuana"
        description="Displays acrílicos, llaveros, señalética y piezas personalizadas con precisión láser en Tijuana. 140+ trabajos, cotización en 24h."
        path="/"
        jsonLd={homeSchema}
      />
      <HeroSection />
      <TrustSection />
      <ServicesSection />
      <FeaturedSection />
      <ProcessSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
