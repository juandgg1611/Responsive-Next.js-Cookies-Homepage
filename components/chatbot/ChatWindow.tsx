// components/chatbot/ChatWindow.tsx - VERSIÓN CORREGIDA
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Cookie,
  X,
  MinusCircle,
  Maximize2,
  Minimize2,
  Sparkles,
} from "lucide-react";
import { useChatbot } from "@/components/providers/chatbot-provider";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatTypingIndicator from "./ChatTypingIndicator";
import ChatSuggestions from "./ChatSuggestions";

export default function ChatWindow() {
  const { messages, isOpen, toggleChat, isLoading } = useChatbot();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
        className={`fixed bottom-24 right-8 z-47 flex flex-col
          ${isFullscreen ? "inset-8 w-auto h-auto" : "w-[380px] h-[600px]"}
          bg-gradient-to-br from-[#3A2318]/95 to-[#2C1810]/95 
          backdrop-blur-xl rounded-3xl 
          border border-[#4A2F20]/50 shadow-2xl
          transition-all duration-300`}
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
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg hover:bg-[#4A2F20]/50 transition-colors group"
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </AnimatePresence>

          {isLoading && <ChatTypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {showSuggestions && messages.length < 3 && (
          <div className="flex-shrink-0 px-4 pb-4">
            <ChatSuggestions
              onSuggestionClick={() => {
                setShowSuggestions(false);
              }}
            />
          </div>
        )}

        {/* Input Area */}
        <div className="flex-shrink-0 p-4 border-t border-[#4A2F20]/50 bg-gradient-to-t from-[#2C1810]/50 to-transparent">
          <ChatInput />
        </div>

        {/* Footer pequeño */}
        <div className="flex-shrink-0 px-4 pb-3 text-center">
          <p className="text-[10px] text-caramel/60">
            Powered by Vian Cookies · Respuestas en tiempo real 🍪
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
