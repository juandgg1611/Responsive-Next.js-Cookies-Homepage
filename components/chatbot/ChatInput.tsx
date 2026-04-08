// components/chatbot/ChatInput.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useChatbot } from "@/components/providers/chatbot-provider";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { sendMessage, isLoading } = useChatbot();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      sendMessage(message);
      setMessage("");
    }
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={`transition-all duration-300 ${
          isFocused ? "scale-[1.01]" : ""
        }`}
      >
        <div className="relative flex items-center gap-2 bg-background-surface border-2 border-[#5D3A2B] rounded-xl focus-within:border-cookie-400 focus-within:ring-2 focus-within:ring-cookie-400/20 transition-all duration-300 px-2">
          {/* Textarea — sin scroll, crece solo hacia arriba */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje... 🍪"
            className="flex-1 px-2 py-3 bg-transparent text-vanilla placeholder-caramel/60 focus:outline-none resize-none overflow-hidden text-sm leading-relaxed"
            rows={1}
            disabled={isLoading}
          />

          {/* Botón enviar — centrado verticalmente siempre */}
          <motion.button
            type="submit"
            disabled={!message.trim() || isLoading}
            whileHover={{ scale: message.trim() && !isLoading ? 1.05 : 1 }}
            whileTap={{ scale: message.trim() && !isLoading ? 0.95 : 1 }}
            className={`flex-shrink-0 self-center p-2 rounded-lg transition-all duration-300 ${
              message.trim() && !isLoading
                ? "bg-gradient-cookie text-white shadow-cookie hover:shadow-cookie-lg"
                : "bg-transparent text-caramel/30 cursor-not-allowed"
            }`}
            aria-label="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <p className="text-[10px] text-vanilla/40 text-center mt-2 flex items-center justify-center gap-1">
        <span className="w-1 h-1 bg-vanilla/40 rounded-full" />
        Tus mensajes son seguros y encriptados
        <span className="w-1 h-1 bg-vanilla/40 rounded-full" />
      </p>
    </form>
  );
}
