import { Component } from "react";
import { siteConfig } from "../../data/siteConfig";

// El fallback conserva el CTA de WhatsApp: si el render truena, el sitio
// todavia tiene que poder capturar el contacto.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("Error de render:", error, info);
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="grid min-h-[100svh] place-items-center bg-[var(--bg)] px-6 py-16">
        <div className="grid max-w-xl gap-6 text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink-mute)]">
            {siteConfig.name}
          </p>
          <h1 className="font-['Saira_Condensed'] text-[clamp(2.4rem,7vw,4.4rem)] font-extrabold leading-[0.88] tracking-[-0.03em] text-[var(--ink)]">
            Algo falló al cargar
          </h1>
          <p className="text-base leading-8 text-[var(--ink-soft)]">
            Recarga la página. Si sigue igual, escríbenos directo por WhatsApp y
            te cotizamos por ahí mismo.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              className="cut-btn cut-btn--laser"
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cotizar por WhatsApp
            </a>
            <a className="cut-btn cut-btn--ghost" href="/">
              Volver al inicio
            </a>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink-mute)]">
            {siteConfig.phoneDisplay}
          </p>
        </div>
      </main>
    );
  }
}
