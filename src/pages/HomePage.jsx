import Seo from "../components/seo/Seo";
import { businessRef, businessSchema, websiteSchema } from "../data/schema";
import { faqs } from "../data/siteContent";
import { toAbsoluteUrl } from "../lib/url";
import ContactSection from "../sections/home/ContactSection";
import FeaturedSection from "../sections/home/FeaturedSection";
import HeroSection from "../sections/home/HeroSection";
import ProcessSection from "../sections/home/ProcessSection";
import ServicesSection from "../sections/home/ServicesSection";
import TrustSection from "../sections/home/TrustSection";

// El FAQ vive dentro de ProcessSection: el texto es visible en la pagina, que
// es lo que Google exige para aceptar FAQPage. isPartOf lo cuelga de la entidad
// del sitio para que no quede como un bloque suelto.
const faqSchema = {
  "@type": "FAQPage",
  "@id": `${toAbsoluteUrl("/")}#faq`,
  inLanguage: "es-MX",
  about: businessRef,
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
  "@graph": [websiteSchema, businessSchema, faqSchema],
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
