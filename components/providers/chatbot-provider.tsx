// components/providers/chatbot-provider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatbotContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  unreadCount: number;
  sendMessage: (content: string) => Promise<void>;
  toggleChat: () => void;
  clearMessages: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

// Mensajes de bienvenida rotativos
const WELCOME_MESSAGES = [
  "¡Hola! Soy Cookie, tu asistente de Vian Cookies 🍪 ¿En qué puedo ayudarte?",
  "¡Bienvenido a Vian Cookies! ¿Listo para descubrir galletas artesanales? ✨",
  "Hola, soy Cookie. ¿Te gustaría conocer nuestras galletas más vendidas? 🍪",
  "¡Hola! Cuéntame, ¿qué tipo de galleta buscas hoy? 💝",
];

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      content:
        WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)],
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
  
      // 1. Mensaje del usuario
      const userMessage: ChatMessage = {
        id: uuidv4(),
        content,
        role: "user",
        timestamp: new Date(),
      };
  
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setUnreadCount(0);
  
      try {
        // 2. Llamada a tu API de Next.js (que conectamos con Gemini)
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: content }),
        });
  
        if (!response.ok) throw new Error('Error en la comunicación con Cookie');
  
        const data = await response.json();
  
        // 3. Añadir la respuesta real de Gemini al estado
        const botMessage: ChatMessage = {
          id: uuidv4(),
          content: data.text, // El texto que devuelve tu API Route
          role: "assistant",
          timestamp: new Date(),
        };
  
        setMessages((prev) => [...prev, botMessage]);
  
      } catch (error) {
        // Manejo de errores para que el usuario sepa que algo falló
        const errorMessage: ChatMessage = {
          id: uuidv4(),
          content: "¡Ups! Se me quemaron las galletas en el horno (error de conexión). Intenta de nuevo en un momento. 🍪",
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        console.error("Error de chat:", error);
      } finally {
        setIsLoading(false);
        if (!isOpen) setUnreadCount((prev) => prev + 1);
      }
    },
    [isOpen],
  );

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) setUnreadCount(0);
  }, [isOpen]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: uuidv4(),
        content:
          WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)],
        role: "assistant",
        timestamp: new Date(),
      },
    ]);
    setUnreadCount(1);
  }, []);

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        isOpen,
        isLoading,
        unreadCount,
        sendMessage,
        toggleChat,
        clearMessages,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within ChatbotProvider");
  }
  return context;
};
