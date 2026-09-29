import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { preloadRoute } from "./routes";
import { markPrerendered } from "./lib/intro";
import "./index.css";

markPrerendered();

// Se espera el chunk de la ruta de entrada antes de montar: el HTML
// prerenderizado sigue visible mientras tanto y React lo reemplaza de una vez.
preloadRoute(window.location.pathname)
  .catch(() => {})
  .finally(() => {
    createRoot(document.getElementById("root")).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
