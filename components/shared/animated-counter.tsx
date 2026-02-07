"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  onComplete?: () => void;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  suffix = "",
  prefix = "",
  className = "",
  onComplete,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
          setTimeout(() => {
            animateCounter();
          }, delay * 1000);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasStarted, delay]);

  const animateCounter = () => {
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const updateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(from + (to - from) * easeOutQuart);

      setCount(currentCount);

      if (now < endTime) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(to);
        onComplete?.();
      }
    };

    requestAnimationFrame(updateCounter);
  };

  // Formatear número con comas
  const formatNumber = (num: number) => {
    return num.toLocaleString("es-ES");
  };

  return (
    <div ref={ref} className={`inline-block ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={hasStarted ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <span className="relative z-10">
          {prefix}
          {formatNumber(count)}
          {suffix}
        </span>

        {/* Efecto de brillo */}
        {hasStarted && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5, delay: duration - 0.2 }}
              className="absolute inset-0 bg-gradient-to-r from-cookie-gold/50 to-transparent rounded-full blur-sm"
            />

            {/* Partículas de celebración */}
            {count === to && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                    animate={{
                      x: Math.sin(i) * 40,
                      y: -40,
                      opacity: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                    className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full"
                    style={{
                      background: i % 2 === 0 ? "#F2A900" : "#8B6B61",
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Barra de progreso (opcional) */}
      {hasStarted && count < to && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: duration, ease: "linear" }}
          className="h-1 mt-2 bg-gradient-to-r from-cookie-gold to-cookie-brown origin-left rounded-full"
        />
      )}
    </div>
  );
}

// Componente de contador simple
export function SimpleCounter({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`inline-block ${className}`}
    >
      {displayValue}
    </motion.span>
  );
}
