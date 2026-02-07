"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  MessageSquare,
  X,
  Tag,
  Clock,
  Shield,
} from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";

export function FloatingBadge() {
  const [isVisible, setIsVisible] = useState(true);
  const [activeBadge, setActiveBadge] = useState<
    "cart" | "chat" | "offer" | null
  >(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [offers, setOffers] = useState([
    "🎁 20% OFF en tu primera compra",
    "🚚 Envío gratis +$50.000",
    "⭐ Compra 3, lleva 4",
    "💝 Personaliza tu caja regalo",
  ]);
  const [currentOffer, setCurrentOffer] = useState(0);

  const { itemCount } = useCart?.() || { itemCount: 0 };

  useEffect(() => {
    setIsClient(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Rotar ofertas cada 5 segundos
    const offerInterval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length);
    }, 5000);

    // Mostrar badge después de 2 segundos
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(offerInterval);
      clearTimeout(showTimer);
    };
  }, [offers.length]);

  const handleBadgeClick = (type: "cart" | "chat" | "offer") => {
    setActiveBadge(activeBadge === type ? null : type);
  };

  const floatingButtons = [
    {
      id: "cart",
      icon: ShoppingCart,
      label: "Carrito",
      color: "bg-cookie-brown hover:bg-cookie-chocolate",
      badge: itemCount > 0 ? itemCount : undefined,
      action: () => (window.location.href = "/cart"),
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat",
      color: "bg-cookie-gold hover:bg-cookie-gold-dark",
      badge: undefined,
      action: () => handleBadgeClick("chat"),
    },
    {
      id: "offer",
      icon: Tag,
      label: "Ofertas",
      color: "bg-cookie-berry hover:bg-cookie-redvelvet",
      badge: undefined,
      action: () => handleBadgeClick("offer"),
    },
  ];

  // Calcular la posición Y para evitar que se superponga con elementos del fondo
  const calculateYPosition = () => {
    if (!isClient || typeof window === "undefined") return 0;

    // Verificar si el mouse está cerca del fondo de la pantalla
    const isNearBottom = mousePosition.y > window.innerHeight - 200;

    // También verificar si hay elementos activos que podrían superponerse
    const hasActiveElements = activeBadge !== null;

    if (isNearBottom && hasActiveElements) {
      return -40; // Mover más arriba si hay elementos activos
    } else if (isNearBottom) {
      return -20; // Mover un poco arriba
    }

    return 0; // Posición normal
  };

  if (!isClient) {
    return null; // No renderizar en el servidor
  }

  return (
    <>
      {/* Botones flotantes principales */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-4">
        {floatingButtons.map((button, index) => (
          <motion.button
            key={button.id}
            initial={{ opacity: 0, x: 50, scale: 0 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
              y: calculateYPosition(),
            }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={button.action}
            className={`relative ${button.color} text-white p-4 rounded-2xl shadow-cookie-hard 
                     hover:shadow-cookie-glow transition-all duration-300 group`}
          >
            <button.icon className="w-6 h-6" />

            {/* Badge de cantidad */}
            {button.badge && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs 
                         font-bold rounded-full w-6 h-6 flex items-center justify-center"
              >
                {button.badge}
              </motion.span>
            )}

            {/* Tooltip */}
            <div
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 
                          bg-card text-foreground px-3 py-2 rounded-lg shadow-lg 
                          opacity-0 group-hover:opacity-100 transition-opacity 
                          duration-300 whitespace-nowrap"
            >
              {button.label}
              <div
                className="absolute top-1/2 left-full -translate-y-1/2 
                            border-8 border-transparent border-l-card"
              />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Panel de ofertas flotante */}
      <AnimatePresence>
        {activeBadge === "offer" && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-6 bottom-36 z-50 w-80"
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Tag className="w-5 h-5 text-cookie-gold" />
                  Ofertas Especiales
                </h3>
                <button
                  onClick={() => setActiveBadge(null)}
                  className="p-1 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {offers.map((offer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer
                             ${
                               index === currentOffer
                                 ? "bg-gradient-to-r from-cookie-gold/10 to-cookie-brown/10 border-cookie-gold"
                                 : "bg-muted/50 border-border hover:border-cookie-cream"
                             }`}
                    onClick={() => setCurrentOffer(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          index === currentOffer
                            ? "bg-cookie-gold text-white"
                            : "bg-muted"
                        }`}
                      >
                        {index === 0 && <Tag className="w-4 h-4" />}
                        {index === 1 && <Clock className="w-4 h-4" />}
                        {index === 2 && <Shield className="w-4 h-4" />}
                      </div>
                      <span className="font-medium">{offer}</span>
                    </div>

                    {index === currentOffer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 pt-3 border-t border-cookie-gold/30"
                      >
                        <button className="w-full btn-cookie py-2 text-sm">
                          Aplicar Oferta
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Las ofertas se actualizan frecuentemente
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Migajas de galleta flotantes - Solo en cliente */}
      {isClient && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + i * 7}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            >
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cookie-brown/20 to-cookie-gold/20" />
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}

// Badge simple para mostrar promociones
export function PromotionBadge({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r 
                 from-cookie-gold to-cookie-gold-dark text-white font-semibold 
                 shadow-cookie-gold ${className}`}
    >
      <span className="animate-pulse">✨</span>
      <span className="mx-2">{text}</span>
      <span className="animate-pulse">✨</span>
    </motion.div>
  );
}
