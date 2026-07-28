import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function GlowingEmbers() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generar partículas con valores iniciales aleatorios
    const newParticles = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // porcentaje horizontal
      top: Math.random() * 100, // porcentaje vertical inicial
      size: Math.random() * 4 + 1.5, // entre 1.5px y 5.5px
      delay: Math.random() * 5, // retraso inicial
      duration: Math.random() * 4 + 3, // duración de 3s a 7s
      xDrift: (Math.random() - 0.5) * 80, // desviación lateral en px
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none mix-blend-screen">
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
            y: [0, -150 - Math.random() * 200], // Sube hacia arriba
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
