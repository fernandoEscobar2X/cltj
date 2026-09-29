import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LazyMotion } from "framer-motion";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import SiteLayout from "./components/layout/SiteLayout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import { prefetchRoutes, RoutePage } from "./routes";

// Las funciones de animación (gestos, arrastre, layout) llegan en un chunk
// aparte después del primer render: los componentes `m.*` pintan su estado
// inicial sin esperarlas.
const loadMotionFeatures = () => import("./lib/motionFeatures").then((mod) => mod.default);

export default function App() {
  useEffect(() => {
    prefetchRoutes();
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <LazyMotion features={loadMotionFeatures} strict>
          <BrowserRouter>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/papel-picado" element={<RoutePage path="/papel-picado" />} />
                <Route path="/galeria" element={<RoutePage path="/galeria" />} />
                <Route path="/privacidad" element={<RoutePage path="/privacidad" />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </LazyMotion>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
