import { m, useReducedMotion } from "framer-motion";

// Entrada suave al aparecer en pantalla. `as` permite usarlo como <li>, etc.,
// para no romper la semántica de listas.
export default function Reveal({ children, className = "", y = 40, delay = 0, once = true, as = "div" }) {
  const reduceMotion = useReducedMotion();
  const Tag = as;
  const Motion = m[as];

  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Motion
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -5% 0px" }}
      transition={{ type: "spring", stiffness: 120, damping: 22, delay }}
    >
      {children}
    </Motion>
  );
}
