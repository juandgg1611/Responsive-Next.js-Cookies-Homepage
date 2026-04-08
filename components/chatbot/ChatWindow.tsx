// components/chatbot/ChatWindow.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Cookie, X, Maximize2, Minimize2, Sparkles } from "lucide-react";
import { useChatbot } from "@/components/providers/chatbot-provider";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatTypingIndicator from "./ChatTypingIndicator";

export default function ChatWindow() {
  const { messages, isOpen, toggleChat, isLoading } = useChatbot();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Estilos calculados en JS — sin depender de clases Tailwind condicionales
  const windowStyle: React.CSSProperties = isMobile
    ? {
        // Mobile: ocupa casi toda la pantalla desde abajo
        bottom: "5rem",
        left: "0.5rem",
        right: "0.5rem",
        height: "82vh",
        maxHeight: "600px",
        borderRadius: "1.25rem",
      }
    : isFullscreen
      ? {
          // Desktop fullscreen: crece desde la esquina, anclado abajo-derecha
          bottom: "6rem",
          right: "2rem",
          width: "900px",
          height: "75vh",
          maxHeight: "860px",
          borderRadius: "1.5rem",
        }
      : {
          // Desktop normal
          bottom: "6rem",
          right: "2rem",
          width: "380px",
          height: "600px",
          borderRadius: "1.5rem",
        };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="chat-window"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
        style={windowStyle}
        className="fixed z-50 flex flex-col bg-[#2C1810] backdrop-blur-xl border border-[#4A2F20]/50 shadow-2xl transition-[width,height,top,left,right,bottom,border-radius] duration-300"
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-[#4A2F20]/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-cookie flex items-center justify-center shadow-glow">
                  <Cookie className="w-5 h-5 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2C1810]"
                />
              </div>
              <div>
                <h3 className="font-display font-semibold text-vanilla flex items-center gap-2">
                  Cookie Assistant
                  <Sparkles className="w-4 h-4 text-cookie-400" />
                </h3>
                <p className="text-xs text-caramel flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Online - Tiempo real
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Fullscreen solo en pantallas grandes */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hidden sm:flex p-2 rounded-lg hover:bg-[#4A2F20]/50 transition-colors group"
                aria-label={
                  isFullscreen ? "Ventana normal" : "Pantalla completa"
                }
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-caramel group-hover:text-cookie-400 transition-colors" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-caramel group-hover:text-cookie-400 transition-colors" />
                )}
              </button>
              <button
                onClick={toggleChat}
                className="p-2 rounded-lg hover:bg-[#4A2F20]/50 transition-colors group"
                aria-label="Cerrar chat"
              >
                <X className="w-4 h-4 text-caramel group-hover:text-cookie-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#4A2F20] scrollbar-track-transparent">
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </AnimatePresence>

          {isLoading && <ChatTypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 p-3 sm:p-4 border-t border-[#4A2F20]/50 bg-gradient-to-t from-[#2C1810]/50 to-transparent">
          <ChatInput />
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 pb-3 text-center">
          <p className="text-[10px] text-caramel/60">
            Powered by Vian Cookies · Respuestas en tiempo real 🍪
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
