import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 32,
    mass: 0.18,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[75] h-[2px] w-full origin-left bg-[var(--laser)] shadow-[0_0_22px_var(--laser-glow)]"
      style={{ scaleX }}
    />
  );
}
