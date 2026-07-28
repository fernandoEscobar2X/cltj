import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import SiteLayout from "./components/layout/SiteLayout";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

// GalleryPage NO va en lazy(): con la ruta prerenderizada, el fallback de
// Suspense sustituia la galeria ya pintada por un placeholder al hidratar y el
// footer daba un salto de 0.17 de CLS. El chunk pesaba 1.8 KB comprimido, asi
// que separarlo no compensaba ni de lejos.

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/galeria" element={<GalleryPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
