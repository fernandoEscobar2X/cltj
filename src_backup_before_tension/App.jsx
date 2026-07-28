import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import SiteLayout from "./components/layout/SiteLayout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

// La galeria carga aparte: es la ruta secundaria y arrastra el lightbox.
const GalleryPage = lazy(() => import("./pages/GalleryPage"));

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<HomePage />} />
              <Route
                path="/galeria"
                element={
                  <Suspense fallback={<div className="min-h-[70svh]" />}>
                    <GalleryPage />
                  </Suspense>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
