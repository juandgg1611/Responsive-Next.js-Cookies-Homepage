"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedCookieProps {
  className?: string;
  style?: React.CSSProperties;
  index?: number;
  type?: "default" | "chocolate" | "vanilla" | "berry";
  size?: number;
}

export function AnimatedCookie({
  className,
  style,
  index = 0,
  type = "default",
  size = 40,
}: AnimatedCookieProps) {
  const colors = {
    default: "from-cookie-gold to-cookie-brown",
    chocolate: "from-cookie-chocolate to-cookie-brown",
    vanilla: "from-cookie-vanilla to-cookie-light",
    berry: "from-cookie-berry to-cookie-redvelvet",
  };

  return (
    <motion.div
      className={cn("absolute pointer-events-none", className)}
      style={style}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.1, 1],
        rotate: [0, 360],
        y: [0, -20, 0],
        x: [0, Math.sin(index * 0.5) * 10, 0],
      }}
      transition={{
        duration: 4 + index,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.2,
      }}
    >
      <div
        className={cn(
          "rounded-full bg-gradient-to-br shadow-lg",
          colors[type],
          "flex items-center justify-center",
        )}
        style={{ width: size, height: size }}
      >
        <Cookie className="w-1/2 h-1/2 text-white/80" />
      </div>
    </motion.div>
  );
}
