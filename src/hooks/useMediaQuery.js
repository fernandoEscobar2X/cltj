import { useSyncExternalStore } from "react";

// Media query reactiva. En el prerender (sin window) responde `fallback`.
export default function useMediaQuery(query, fallback = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}
