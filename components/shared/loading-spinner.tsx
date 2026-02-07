"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingSpinner() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ocultar después de que todo cargue
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 segundos

    // También escuchar cuando la página termine de cargar
    const handleLoad = () => {
      setIsLoading(false);
    };

    window.addEventListener("load", handleLoad);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          style={{ pointerEvents: "none" }}
        >
          <div className="relative">
            {/* Anillo exterior giratorio */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="h-32 w-32 rounded-full border-[8px] border-cookie-gold/20 border-t-cookie-gold"
            />

            {/* Galleta central animada */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className="h-20 w-20 rounded-full bg-gradient-to-r from-cookie-gold to-cookie-gold-dark 
                            flex items-center justify-center shadow-cookie-gold"
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-white text-2xl"
                >
                  🍪
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
