import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

// Desplaza el contenido en vertical mientras el elemento cruza el viewport.
// `distance` en px: positivo baja al entrar y sube al salir.
export default function Parallax({ children, distance = 40, className = "", style }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div ref={ref} className={className} style={{ ...style, y: reduceMotion ? 0 : y }}>
      {children}
    </motion.div>
  );
}
