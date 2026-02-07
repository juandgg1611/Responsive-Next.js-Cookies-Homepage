"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface CookieBadgeProps {
  text: string;
  variant?: "default" | "new" | "popular" | "sale";
}

export default function CookieBadge({
  text,
  variant = "default",
}: CookieBadgeProps) {
  const variants = {
    default: "bg-cookie-500 text-background-dark",
    new: "bg-gradient-to-r from-cookie-400 to-cookie-600 text-white",
    popular:
      "bg-gradient-to-r from-chocolate-500 to-chocolate-700 text-vanilla-light",
    sale: "bg-gradient-to-r from-red-500 to-red-600 text-white",
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${variants[variant]} shadow-lg`}
    >
      <Sparkles className="w-3 h-3 mr-1" />
      {text}
    </motion.span>
  );
}
