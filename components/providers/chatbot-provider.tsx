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

      // Mensaje del usuario
      const userMessage: ChatMessage = {
        id: uuidv4(),
        content,
        role: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setUnreadCount(0);

      // Mensaje de typing
      const typingId = uuidv4();
      const typingMessage: ChatMessage = {
        id: typingId,
        content: "",
        role: "assistant",
        timestamp: new Date(),
        isTyping: true,
      };
      setMessages((prev) => [...prev, typingMessage]);

      // Simular respuesta - Aquí irá Gemini 3
      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== typingId));

        const botMessage: ChatMessage = {
          id: uuidv4(),
          content: generateResponse(content),
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
        if (!isOpen) setUnreadCount((prev) => prev + 1);
      }, 2000);
    },
    [isOpen],
  );

  // Respuestas simuladas (temporal)
  const generateResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes("hola") || lowerMsg.includes("buenas")) {
      return "¡Hola! Encantado de verte por aquí 🍪 ¿Qué tipo de galleta te gusta más?";
    }
    if (lowerMsg.includes("chocolate")) {
      return "¡Nuestra Chocolate Chip Deluxe es la favorita! Lleva chispas de chocolate belga 70% cacao. ¿Quieres probarla? ✨";
    }
    if (lowerMsg.includes("envío") || lowerMsg.includes("domicilio")) {
      return "Hacemos envíos a todo el país en 24h. 🚚 Además, por compras mayores a $500 el envío es gratis. ¿Te ayudo con tu pedido?";
    }
    if (lowerMsg.includes("precio") || lowerMsg.includes("cuesta")) {
      return "Nuestras galletas premium van desde $45 hasta $120, dependiendo de la variedad. ¡También tenemos cajas de regalo! 🎁";
    }
    if (lowerMsg.includes("sin azúcar") || lowerMsg.includes("light")) {
      return '¡Sí! Tenemos opciones sin azúcar y sin gluten. La línea "Vian Light" usa stevia natural. ¿Te interesa alguna en especial? 💚';
    }

    return "¡Qué interesante! ¿Te gustaría que te recomiende nuestras galletas más vendidas? 🍪✨";
  };

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
