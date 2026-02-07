"use client";

import { useEffect, useRef, useState } from "react";

interface TrailPoint {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  id: number;
}

const COLORS = [
  "#D4A574", // Cookie
  "#8B4513", // Chocolate
  "#A67C52", // Caramel
];

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const animationRef = useRef<number>();
  const mousePosRef = useRef({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Seguir mouse
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      // Agregar nuevo punto al trail
      const newPoint: TrailPoint = {
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 6 + 3,
        opacity: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        id: Date.now(),
      };

      trailRef.current.push(newPoint);

      // Mantener máximo 15 puntos
      if (trailRef.current.length > 15) {
        trailRef.current.shift();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Función de animación
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar trail
      trailRef.current.forEach((point, index) => {
        // Calcular opacidad basada en posición en el trail
        const age = index / trailRef.current.length;
        const currentOpacity = point.opacity * (1 - age);

        if (currentOpacity > 0.01) {
          // Dibujar punto principal
          ctx.save();
          ctx.globalAlpha = currentOpacity;
          ctx.fillStyle = point.color;

          // Forma de chispa de chocolate
          ctx.beginPath();
          ctx.ellipse(
            point.x,
            point.y,
            point.size,
            point.size / 2,
            0,
            0,
            Math.PI * 2,
          );
          ctx.fill();

          // Efecto de brillo
          ctx.globalAlpha = currentOpacity * 0.3;
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Conectar puntos con línea
          if (index > 0) {
            const prevPoint = trailRef.current[index - 1];
            ctx.save();
            ctx.globalAlpha = currentOpacity * 0.5;
            ctx.strokeStyle = point.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      });

      // Dibujar efecto en posición actual del mouse
      if (trailRef.current.length > 0) {
        const currentPoint = trailRef.current[trailRef.current.length - 1];

        // Anillo pulsante
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = currentPoint.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
          mousePosRef.current.x,
          mousePosRef.current.y,
          Math.sin(Date.now() * 0.005) * 5 + 15,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        ctx.restore();

        // Punto central
        ctx.save();
        ctx.fillStyle = currentPoint.color;
        ctx.beginPath();
        ctx.arc(
          mousePosRef.current.x,
          mousePosRef.current.y,
          2,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Limpiar
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (!isClient) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
    />
  );
}
