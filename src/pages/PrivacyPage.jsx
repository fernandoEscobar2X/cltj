import Seo from "../components/seo/Seo";
import { businessRef } from "../data/schema";
import { siteConfig } from "../data/siteConfig";
import { toAbsoluteUrl } from "../lib/url";

// Aviso de privacidad conforme a la LFPDPPP.
//
// PENDIENTE DEL NEGOCIO: los bloques marcados con [COMPLETAR] requieren datos
// que solo puede aportar el titular (razon social, domicilio fiscal y un correo
// para solicitudes ARCO). Se dejaron explicitos en vez de inventados: un aviso
// de privacidad con datos falsos no protege legalmente y es peor que no tenerlo.

const privacySchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${toAbsoluteUrl("/privacidad")}#page`,
  name: "Aviso de privacidad",
  url: toAbsoluteUrl("/privacidad"),
  inLanguage: "es-MX",
  about: businessRef,
  publisher: businessRef,
};

function Block({ title, children }) {
  return (
    <section className="grid gap-3">
      <h2 className="font-['Saira_Condensed'] text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-[1] tracking-[-0.02em] text-[var(--ink)]">
        {title}
      </h2>
      <div className="grid gap-3 text-base leading-8 text-[var(--ink-soft)]">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Seo
        title={`Aviso de privacidad | ${siteConfig.name}`}
        description="Aviso de privacidad de TJ Láser: qué datos recabamos, para qué los usamos y cómo ejercer tus derechos ARCO."
        path="/privacidad"
        jsonLd={privacySchema}
      />

      <section className="bg-[var(--bg)] py-20 lg:py-28">
        <div className="layout-shell grid max-w-3xl gap-10">
          <header className="grid gap-4">
            <p className="section-eyebrow">Legal</p>
            <h1 className="m-0 font-['Saira_Condensed'] text-[clamp(2.8rem,7vw,5rem)] font-extrabold leading-[0.88] tracking-[-0.03em] text-[var(--ink)]">
              Aviso de privacidad
            </h1>
            <p className="text-base leading-8 text-[var(--ink-soft)]">
              En cumplimiento de la Ley Federal de Protección de Datos
              Personales en Posesión de los Particulares.
            </p>
          </header>

          <Block title="Quién es responsable">
            <p>
              {siteConfig.legalName} ({siteConfig.name}), con domicilio en{" "}
              {siteConfig.location}, es responsable del tratamiento de tus datos
              personales. Puedes contactarnos por WhatsApp al{" "}
              {siteConfig.phoneDisplay}.
            </p>
          </Block>

          <Block title="Qué datos recabamos">
            <p>
              Este sitio no tiene formularios ni cuentas de usuario. Los únicos
              datos personales que recibimos son los que tú nos compartes
              voluntariamente al escribirnos por WhatsApp: tu nombre, tu número
              de teléfono y la información de tu proyecto.
            </p>
            <p>
              De forma separada, si aceptas las cookies de medición, recabamos
              datos de navegación agregados mediante Google Analytics: páginas
              visitadas, tiempo en el sitio, tipo de dispositivo y ciudad
              aproximada. Esta información no te identifica personalmente.
            </p>
          </Block>

          <Block title="Para qué los usamos">
            <p>
              Los datos que nos compartes por WhatsApp se usan únicamente para
              elaborar tu cotización, dar seguimiento a tu pedido y coordinar la
              entrega. No los usamos para publicidad ni los compartimos, vendemos
              o transferimos a terceros.
            </p>
            <p>
              Los datos de navegación se usan solo para entender qué trabajos
              interesan más y mejorar el sitio.
            </p>
          </Block>

          <Block title="Cookies">
            <p>
              Usamos Google Analytics con el modo de consentimiento activado.
              Mientras no aceptes, no se instalan cookies de medición. Si
              aceptas, se guardan cookies propias de Google Analytics para
              distinguir visitas.
            </p>
            <p>
              Puedes cambiar tu decisión en cualquier momento borrando los datos
              del sitio desde tu navegador; el aviso volverá a aparecer en tu
              siguiente visita.
            </p>
          </Block>

          <Block title="Tus derechos ARCO">
            <p>
              Tienes derecho a acceder a tus datos personales, rectificarlos si
              son inexactos, cancelarlos u oponerte a su tratamiento. Para
              ejercer cualquiera de estos derechos, escríbenos por WhatsApp al{" "}
              {siteConfig.phoneDisplay} indicando tu solicitud. Responderemos en
              un plazo máximo de 20 días hábiles.
            </p>
          </Block>

          <Block title="Cambios a este aviso">
            <p>
              Cualquier modificación a este aviso se publicará en esta misma
              página. Te recomendamos revisarla periódicamente.
            </p>
          </Block>

          <p className="border-t border-[var(--line)] pt-6 font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink-mute)]">
            Última actualización: julio 2026
          </p>
        </div>
      </section>
    </>
  );
}
