"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Barra de progreso fija en top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
        style={{ scaleX }}
      >
        <div className="h-full w-full bg-gradient-to-r from-cookie-400 via-chocolate-500 to-caramel-500" />

        {/* Punto deslizante */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-cookie shadow-lg"
          style={{
            left: `${scrollYProgress.get() * 100}%`,
            translateX: "-50%",
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Botón para ir arriba */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : 20,
        }}
        transition={{ duration: 0.3 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-cookie shadow-2xl flex items-center justify-center group"
        aria-label="Volver arriba"
      >
        <svg
          className="w-6 h-6 text-white transform transition-transform group-hover:-translate-y-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-background-surface rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Volver arriba
          <div className="absolute top-full right-4 -mt-1 w-2 h-2 bg-background-surface transform rotate-45" />
        </div>
      </motion.button>

      {/* Indicador de sección actual */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col items-center space-y-4">
          {["home", "features", "products", "about", "testimonials", "cta"].map(
            (section) => (
              <motion.a
                key={section}
                href={`#${section}`}
                className="relative group"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="w-3 h-3 rounded-full bg-background-surface border border-border-light group-hover:border-cookie-400 transition-colors" />

                {/* Tooltip */}
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-4 px-3 py-1 bg-background-surface rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none capitalize">
                  {section.replace("-", " ")}
                  <div className="absolute top-1/2 left-full -ml-1 w-2 h-2 bg-background-surface transform rotate-45 -translate-y-1/2" />
                </div>
              </motion.a>
            ),
          )}
        </div>
      </div>
    </>
  );
}
