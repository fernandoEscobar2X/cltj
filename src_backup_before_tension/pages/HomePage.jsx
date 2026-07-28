import Seo from "../components/seo/Seo";
import { portfolioItems } from "../data/portfolio";
import { faqs } from "../data/siteContent";
import { siteConfig } from "../data/siteConfig";
import { toAbsoluteUrl } from "../lib/url";
import ContactSection from "../sections/home/ContactSection";
import FeaturedSection from "../sections/home/FeaturedSection";
import HeroSection from "../sections/home/HeroSection";
import ProcessSection from "../sections/home/ProcessSection";
import ServicesSection from "../sections/home/ServicesSection";
import TrustSection from "../sections/home/TrustSection";

const businessSchema = {
  "@type": "LocalBusiness",
  "@id": `${toAbsoluteUrl("/")}#business`,
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

const faqSchema = {
  "@type": "FAQPage",
  "@id": `${toAbsoluteUrl("/")}#faq`,
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [businessSchema, faqSchema],
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
      <ContactSection />
    </>
  );
}
