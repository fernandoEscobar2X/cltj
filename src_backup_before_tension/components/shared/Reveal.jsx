import { motion, useReducedMotion } from "framer-motion";

// Antes esto era GSAP + ScrollTrigger solo para un fade-up. Se reimplemento
// sobre framer-motion, que ya estaba en el bundle por el parallax del hero, y
// asi el sitio carga una sola libreria de animacion en vez de dos.
// El start "top 84%" de ScrollTrigger equivale al margin negativo del viewport.
export default function Reveal({
  children,
  className = "",
  y = 40,
  delay = 0,
  once = true,
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -16% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
