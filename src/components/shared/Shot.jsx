import { motion, useReducedMotion } from "framer-motion";

// Marco de foto: se revela de abajo hacia arriba al entrar en pantalla y la
// imagen interior pierde un poco de zoom, como una cortina que se abre.
export default function Shot({ children, className = "", delay = 0, once = true, ...rest }) {
  const reduceMotion = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1];

  if (reduceMotion) {
    return (
      <div className={`shot ${className}`} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`shot ${className}`}
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0 0 0 0)" }}
      viewport={{ once, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1, delay, ease }}
      {...rest}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={{ once, margin: "0px 0px -8% 0px" }}
        transition={{ duration: 1.4, delay, ease }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
