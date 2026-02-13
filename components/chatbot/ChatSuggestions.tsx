// components/chatbot/ChatSuggestions.tsx
"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Cookie,
  Gift,
  Truck,
  Heart,
  Coffee,
  ShoppingBag,
  Clock,
} from "lucide-react";

const SUGGESTIONS = [
  {
    id: 1,
    text: "¿Cuál es la más vendida?",
    icon: Cookie,
    color: "from-cookie-400 to-cookie-600",
    bg: "bg-cookie-400/10",
  },
  {
    id: 2,
    text: "¿Cajas de regalo?",
    icon: Gift,
    color: "from-chocolate-500 to-chocolate-700",
    bg: "bg-chocolate-500/10",
  },
  {
    id: 3,
    text: "¿Envíos a domicilio?",
    icon: Truck,
    color: "from-caramel to-caramel-dark",
    bg: "bg-caramel/10",
  },
  {
    id: 4,
    text: "Recomiéndame",
    icon: Heart,
    color: "from-honey to-honey-dark",
    bg: "bg-honey/10",
  },
  {
    id: 5,
    text: "Horarios",
    icon: Clock,
    color: "from-cookie-500 to-chocolate-600",
    bg: "bg-cookie-500/10",
  },
  {
    id: 6,
    text: "Promociones",
    icon: ShoppingBag,
    color: "from-chocolate-600 to-cookie-700",
    bg: "bg-chocolate-600/10",
  },
];

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export default function ChatSuggestions({
  onSuggestionClick,
}: ChatSuggestionsProps) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <p className="text-[10px] sm:text-xs text-caramel flex items-center gap-1 sm:gap-2">
        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cookie-400" />
        <span>Sugerencias rápidas:</span>
      </p>

      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
        {SUGGESTIONS.map((suggestion, index) => (
          <motion.button
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="group relative"
          >
            <div
              className={`absolute -inset-0.5 bg-gradient-to-r ${suggestion.color} rounded-lg opacity-0 group-hover:opacity-30 blur transition duration-300`}
            />

            <div className="relative bg-[#4A2F20]/60 backdrop-blur-sm border border-[#5D3A2B] rounded-lg p-1.5 sm:p-2 group-hover:border-cookie-500/50 transition-all duration-300">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r ${suggestion.color} flex items-center justify-center shadow-glow-sm flex-shrink-0`}
                >
                  <suggestion.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </div>
                <span className="text-[9px] sm:text-xs text-vanilla group-hover:text-cookie-400 transition-colors truncate">
                  {suggestion.text}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
