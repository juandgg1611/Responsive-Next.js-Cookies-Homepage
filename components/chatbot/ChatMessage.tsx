// components/chatbot/ChatMessage.tsx
"use client";

import { motion } from "framer-motion";
import { Cookie, User, Clock } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/components/providers/chatbot-provider";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: isBot ? -20 : 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 ${isBot ? "justify-start" : "justify-end flex-row-reverse"}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 ${isBot ? "" : "order-last"}`}>
        {isBot ? (
          <div className="w-8 h-8 rounded-full bg-gradient-cookie flex items-center justify-center shadow-glow">
            <Cookie className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#4A2F20] border-2 border-cookie-500/30 flex items-center justify-center">
            <User className="w-4 h-4 text-caramel" />
          </div>
        )}
      </div>

      {/* Mensaje */}
      <div className={`max-w-[70%] ${isBot ? "" : "items-end"}`}>
        <div
          className={`rounded-2xl p-4 ${
            isBot
              ? "bg-[#2C1810] border border-cookie-500/20 rounded-tl-none"
              : "bg-gradient-to-br from-[#4A2F20] to-[#3A2318] border border-cookie-500/30 rounded-tr-none"
          } shadow-cookie`}
        >
          <p className="text-sm text-vanilla leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1 mt-1 text-[10px] text-caramel/60">
          <Clock className="w-3 h-3" />
          <span>
            {message.timestamp.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
