// components/chatbot/ChatButton.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Cookie, MessageCircle, X } from "lucide-react";
import { useChatbot } from "@/components/providers/chatbot-provider";

export default function ChatButton() {
  const { toggleChat, isOpen, unreadCount } = useChatbot();

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          onClick={toggleChat}
          className="fixed bottom-8 right-8 z-45 group"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
        >
          {/* Efecto glow pulsante */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-cookie rounded-full blur-xl opacity-30"
          />

          {/* Partículas decorativas */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-cookie-500/20 rounded-full border-t-cookie-400 border-b-transparent border-l-transparent border-r-transparent"
          />

          {/* Botón principal */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-cookie flex items-center justify-center shadow-cookie-lg border-2 border-cookie-400/30 backdrop-blur-sm">
            <Cookie className="w-8 h-8 text-white" />

            {/* Badge de mensajes no leídos */}
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-chocolate-500 rounded-full flex items-center justify-center border-2 border-cookie-400 shadow-glow"
              >
                <span className="text-xs font-bold text-white">
                  {unreadCount}
                </span>
              </motion.div>
            )}
          </div>

          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-[#3A2318]/95 backdrop-blur-sm text-vanilla text-sm py-2.5 px-5 rounded-cookie-lg border border-cookie-500/30 shadow-cookie whitespace-nowrap">
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-cookie-400" />
                ¡Pregúntame sobre galletas! 🍪
              </span>
            </div>
            {/* Flecha del tooltip */}
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-[#3A2318] border-r border-t border-cookie-500/30 rotate-45" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
