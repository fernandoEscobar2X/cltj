import { Component } from "react";
import { siteConfig } from "../../data/siteConfig";

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
        <div className="grid max-w-xl gap-5">
          <h1 className="m-0 text-[clamp(2.2rem,6vw,3.6rem)] font-semibold leading-[1.05] tracking-tight">
            Algo falló al cargar
          </h1>
          <p className="text-base leading-7 text-[var(--ink-soft)]">
            Recarga la página. Si sigue igual, escríbenos por WhatsApp y te cotizamos ahí mismo.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              className="cut-btn cut-btn--accent"
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteConfig.ctaLabel}
            </a>
            <a className="cut-btn cut-btn--ghost" href="/">
              Volver al inicio
            </a>
          </div>
        </div>
      </main>
    );
  }
}
