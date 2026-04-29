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

  useEffect(() => {
    if (!activeItem) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeItem, onKeyDown]);

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
