import Seo from "../components/seo/Seo";
import { businessRef, businessSchema, websiteSchema } from "../data/schema";
import { siteConfig, siteDescription } from "../data/siteConfig";
import { faqs } from "../data/siteContent";
import { toAbsoluteUrl } from "../lib/url";
import ContactSection from "../sections/home/ContactSection";
import FeaturedSection from "../sections/home/FeaturedSection";
import HeroSection from "../sections/home/HeroSection";
import ProcessSection from "../sections/home/ProcessSection";
import ServicesSection from "../sections/home/ServicesSection";

const faqSchema = {
  "@type": "FAQPage",
  "@id": `${toAbsoluteUrl("/")}#faq`,
  inLanguage: "es-MX",
  about: businessRef,
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [websiteSchema, businessSchema, faqSchema],
};

// Lógica del home: presentación → qué hacemos → prueba (trabajos) → cómo se
// compra → cierre. Un CTA por bloque. La campaña de temporada vive en el
// modal de entrada y en el nav, no como sección.
export default function HomePage() {
  return (
    <>
      <Seo
        title={`${siteConfig.name} | Publicidad y regalos a medida en Tijuana`}
        description={siteDescription}
        path="/"
        jsonLd={homeSchema}
      />
      <HeroSection />
      <ServicesSection />
      <FeaturedSection />
      <ProcessSection />
      <ContactSection />
    </>
  );
}
