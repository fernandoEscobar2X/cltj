import Seo from "../components/seo/Seo";
import { businessRef, businessSchema, websiteSchema } from "../data/schema";
import { siteConfig, siteDescription } from "../data/siteConfig";
import { faqs } from "../data/siteContent";
import { toAbsoluteUrl } from "../lib/url";
import ClientsBand from "../sections/home/ClientsBand";
import ContactSection from "../sections/home/ContactSection";
import HeroSection from "../sections/home/HeroSection";
import ManifestoSection from "../sections/home/ManifestoSection";
import PapelHookSection from "../sections/home/PapelHookSection";
import ProcessSection from "../sections/home/ProcessSection";
import ReelsSection from "../sections/home/ReelsSection";
import ServicesSection from "../sections/home/ServicesSection";
import WorksSection from "../sections/home/WorksSection";

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

// Recorrido del home: presentación (qué y dónde) → prueba social → qué se
// corta → servicios → el gancho (papel picado en vivo) → trabajos → en la
// calle (reels) → cómo se pide + dudas → cierre. Alterna noche y papel para
// que cada sección se sienta como un cambio de escena.
export default function HomePage() {
  return (
    <>
      <Seo
        title={`Corte láser en Tijuana: letreros, trofeos, vinil y papel picado | ${siteConfig.name}`}
        description={siteDescription}
        path="/"
        jsonLd={homeSchema}
      />
      <HeroSection />
      <ClientsBand />
      <ManifestoSection />
      <ServicesSection />
      <PapelHookSection />
      <WorksSection />
      <ReelsSection />
      <ProcessSection />
      <ContactSection />
    </>
  );
}
