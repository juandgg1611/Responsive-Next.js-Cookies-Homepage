// components/chatbot/ChatInput.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Smile, Paperclip, Mic } from "lucide-react";
import { useChatbot } from "@/components/providers/chatbot-provider";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { sendMessage, isLoading } = useChatbot();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      sendMessage(message);
      setMessage("");
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, isMobile ? 80 : 120)}px`;
    }
  }, [message, isMobile]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={`relative transition-all duration-300 ${
          isFocused ? "scale-[1.01] sm:scale-[1.02]" : ""
        }`}
      >
        {/* Efecto de borde animado */}
        <div className="absolute -inset-0.5 bg-gradient-cookie rounded-xl opacity-0 blur-sm transition-opacity duration-300 group-focus-within:opacity-50" />

        <div className="relative flex items-end gap-1 sm:gap-2 bg-[#4A2F20]/70 backdrop-blur-sm border-2 border-[#5D3A2B] rounded-xl focus-within:border-cookie-400 focus-within:ring-2 sm:focus-within:ring-4 focus-within:ring-cookie-400/20 transition-all duration-300">
          {/* Botones de acción - Solo emoji en móvil, más opciones en desktop */}
          <button
            type="button"
            className="pl-2 sm:pl-3 pb-3 pt-3 text-caramel/60 hover:text-cookie-400 transition-colors"
            aria-label="Añadir emoji"
          >
            <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {!isMobile && (
            <button
              type="button"
              className="text-caramel/60 hover:text-cookie-400 transition-colors pb-3 pt-3"
              aria-label="Adjuntar archivo"
            >
              <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={isMobile ? "Escribe..." : "Escribe tu mensaje... 🍪"}
            className="flex-1 py-2.5 sm:py-3 bg-transparent text-vanilla placeholder-caramel/60 focus:outline-none resize-none max-h-[80px] sm:max-h-[120px] text-xs sm:text-sm"
            rows={1}
            disabled={isLoading}
          />

          {/* Botón enviar - Mejorado */}
          <motion.button
            type="submit"
            disabled={!message.trim() || isLoading}
            whileHover={{ scale: message.trim() && !isLoading ? 1.05 : 1 }}
            whileTap={{ scale: message.trim() && !isLoading ? 0.95 : 1 }}
            className={`mr-1 sm:mr-2 mb-2 p-1.5 sm:p-2.5 rounded-lg transition-all duration-300 ${
              message.trim() && !isLoading
                ? "bg-gradient-cookie text-white shadow-cookie hover:shadow-cookie-lg"
                : "bg-[#4A2F20]/50 text-caramel/50 cursor-not-allowed"
            }`}
            aria-label="Enviar mensaje"
          >
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </motion.button>
        </div>
      </div>

      {/* Mensaje de privacidad - Oculto en móvil muy pequeño */}
      <div className="hidden xs:block">
        <p className="text-[8px] sm:text-[10px] text-caramel/50 text-center mt-1.5 sm:mt-2 flex items-center justify-center gap-1">
          <span className="w-1 h-1 bg-cookie-400 rounded-full" />
          Tus mensajes son seguros y encriptados
          <span className="w-1 h-1 bg-cookie-400 rounded-full" />
        </p>
      </div>
    </form>
  );
}
