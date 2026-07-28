import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useOverlayOpen } from "../../lib/overlay";

// Cada particula es un nodo con animacion infinita, asi que el conteo se paga
// en trabajo de compositor de forma permanente. 34 mantiene la densidad visual
// a una fraccion del costo, y en moviles se reduce mas porque ahi el efecto
// apenas se percibe y la bateria si lo resiente.
const DESKTOP_PARTICLES = 34;
const MOBILE_PARTICLES = 14;

export default function GlowingEmbers() {
  const [particles, setParticles] = useState([]);
  const reduceMotion = useReducedMotion();
  const overlayOpen = useOverlayOpen();

  useEffect(() => {
    if (reduceMotion) {
      setParticles([]);
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const count = isMobile ? MOBILE_PARTICLES : DESKTOP_PARTICLES;

    // Generar partículas con valores iniciales aleatorios
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // porcentaje horizontal
      top: Math.random() * 100, // porcentaje vertical inicial
      size: Math.random() * 4 + 1.5, // entre 1.5px y 5.5px
      delay: Math.random() * 5, // retraso inicial
      duration: Math.random() * 4 + 3, // duración de 3s a 7s
      xDrift: (Math.random() - 0.5) * 80, // desviación lateral en px
      rise: -150 - Math.random() * 200, // altura de subida, fija por particula
    }));
    setParticles(newParticles);
  }, [reduceMotion]);

  // Con una capa a pantalla completa encima las brasas no se ven, pero el
  // mix-blend-screen obliga a recomponer todo el arbol en cada cuadro y le come
  // fluidez a la transicion del menu. display:none corta paint y composicion;
  // al cerrar reaparecen sin reiniciar el componente.
  return (
    <div
      className={`absolute inset-0 z-10 overflow-hidden pointer-events-none mix-blend-screen ${
        overlayOpen ? "hidden" : ""
      }`}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.size > 3.5 ? "#ffffff" : "#c65bff",
            boxShadow: `0 0 ${p.size * 3}px ${p.size > 3.5 ? "#ffffff" : "#c65bff"}`,
          }}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 0.9, 0.9, 0],
            y: [0, p.rise], // Sube hacia arriba
            x: [0, p.xDrift], // Se desvía un poco a los lados
            scale: [0, 1, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
