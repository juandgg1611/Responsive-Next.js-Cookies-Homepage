// components/chatbot/ChatTypingIndicator.tsx
"use client";

import { motion } from "framer-motion";
import { Cookie } from "lucide-react";

export default function ChatTypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-cookie flex items-center justify-center shadow-glow">
        <Cookie className="w-4 h-4 text-white" />
      </div>

      <div className="bg-[#2C1810] border border-cookie-500/20 rounded-2xl rounded-tl-none p-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
                className="w-2 h-2 rounded-full bg-cookie-400"
              />
            ))}
          </div>
          <span className="text-xs text-caramel ml-2">
            Cookie está escribiendo...
          </span>
        </div>
      </div>
    </div>
  );
}
