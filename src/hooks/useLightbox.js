import { useEffect, useEffectEvent, useState } from "react";

export default function useLightbox(items) {
  const [activeId, setActiveId] = useState(null);

  const activeIndex = items.findIndex((item) => item.id === activeId);
  const activeItem = activeIndex === -1 ? null : items[activeIndex];
  const onKeyDown = useEffectEvent((event) => {
    if (event.key === "Escape") {
      setActiveId(null);
    }

    if (event.key === "ArrowRight" && items.length > 1) {
      const nextIndex = (activeIndex + 1) % items.length;
      setActiveId(items[nextIndex].id);
    }

    if (event.key === "ArrowLeft" && items.length > 1) {
      const nextIndex = (activeIndex - 1 + items.length) % items.length;
      setActiveId(items[nextIndex].id);
    }
  });

  const isOpen = activeItem !== null;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onKeyDown]);

  // En movil el gesto natural para salir de una imagen es el boton atras. Sin
  // esto salia de la galeria entera y mandaba al inicio. Se agrega una entrada
  // de historial al abrir: atras la consume y solo cierra la imagen. Depende de
  // isOpen y no de activeItem para no apilar una entrada por cada pieza que se
  // navegue con las flechas.
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    window.history.pushState({ lightbox: true }, "");

    const onPopState = () => setActiveId(null);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);

      // Si se cerro desde la interfaz, la entrada que agregamos sigue en la
      // pila y hay que consumirla para no dejar un "atras" que no hace nada.
      if (window.history.state?.lightbox) {
        window.history.back();
      }
    };
  }, [isOpen]);

  const open = (itemId) => setActiveId(itemId);
  const close = () => setActiveId(null);

  const goTo = (direction) => {
    if (items.length < 2 || activeIndex === -1) {
      return;
    }

    const nextIndex = (activeIndex + direction + items.length) % items.length;
    setActiveId(items[nextIndex].id);
  };

  return {
    activeItem,
    activeIndex,
    open,
    close,
    goNext: () => goTo(1),
    goPrev: () => goTo(-1),
  };
}
