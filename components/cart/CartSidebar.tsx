// components/cart/CartSidebar.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Cookie,
  Truck,
  Shield,
  Sparkles,
  Gift,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/cart-provider";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function CartSidebar() {
  const {
    items,
    isCartOpen,
    toggleCart,
    removeItem,
    updateQuantity,
    totalItems,
    subtotal,
    totalPrice,
    shipping,
    clearCart,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Debug - Verificar estado
  useEffect(() => {
    console.log("🛒 CartSidebar - isCartOpen:", isCartOpen);
  }, [isCartOpen]);

  const freeShippingThreshold = 50;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(
    freeShippingThreshold - subtotal,
    0,
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay - z-48 (debajo del sidebar) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-48"
            onClick={toggleCart}
          />

          {/* Sidebar - z-49 (sobre overlay, debajo de mobile menu) */}
          <motion.div
            initial={{ x: isMobile ? "100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[400px] md:w-[450px] bg-gradient-to-br from-[#3A2318] to-[#2C1810] shadow-2xl border-l border-[#4A2F20] flex flex-col`}
          >
            {/* Header */}
            <div className="flex-shrink-0 p-4 sm:p-6 border-b border-[#4A2F20]/50 bg-gradient-to-r from-[#2C1810]/80 to-[#3A2318]/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-cookie flex items-center justify-center shadow-glow">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-chocolate-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-cookie-400">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-vanilla">
                      Tu Pedido
                    </h2>
                    <p className="text-xs text-caramel">
                      {items.length}{" "}
                      {items.length === 1 ? "producto" : "productos"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="p-2 rounded-lg hover:bg-[#4A2F20]/50 transition-colors group"
                      aria-label="Vaciar carrito"
                    >
                      <Trash2 className="w-4 h-4 text-caramel group-hover:text-red-400 transition-colors" />
                    </button>
                  )}
                  <button
                    onClick={toggleCart}
                    className="p-2 rounded-lg hover:bg-[#4A2F20]/50 transition-colors group"
                    aria-label="Cerrar carrito"
                  >
                    <X className="w-5 h-5 text-caramel group-hover:text-cookie-400 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Barra de progreso envío gratis */}
              {items.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-caramel flex items-center gap-1">
                      <Truck className="w-3 h-3 text-cookie-400" />
                      Envío gratis
                    </span>
                    <span className="text-vanilla">
                      {subtotal >= freeShippingThreshold ? (
                        <span className="text-green-400">✓ Calificado</span>
                      ) : (
                        <span>
                          Faltan ${remainingForFreeShipping.toFixed(2)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#4A2F20]/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-cookie rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </motion.div>
                  </div>
                </div>
              )}
            </div>

            {/* Productos */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-cookie/20 flex items-center justify-center mb-4 border-2 border-cookie-500/30">
                    <ShoppingCart className="w-12 h-12 text-cookie-400/50" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-vanilla mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-sm text-caramel mb-6 max-w-xs">
                    ¡Descubre nuestras deliciosas galletas artesanales y
                    comienza tu pedido!
                  </p>
                  <button
                    onClick={toggleCart}
                    className="px-6 py-3 bg-gradient-cookie text-white font-semibold rounded-full shadow-cookie hover:shadow-cookie-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <Cookie className="w-4 h-4" />
                    Explorar productos
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="flex gap-4 p-3 bg-[#4A2F20]/30 backdrop-blur-sm rounded-xl border border-[#5D3A2B]/50 hover:border-cookie-500/30 transition-all duration-300 group"
                    >
                      {/* Imagen */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-cookie-900/30 to-chocolate-900/30" />
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.badge && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-cookie-400 text-[8px] font-bold text-white rounded">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Detalles */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-semibold text-vanilla truncate max-w-[150px] group-hover:text-cookie-400 transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-xs text-caramel mt-0.5">
                              ${item.price.toFixed(2)} c/u
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 rounded-full hover:bg-[#5D3A2B]/50 transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Eliminar"
                          >
                            <X className="w-3.5 h-3.5 text-caramel hover:text-red-400" />
                          </button>
                        </div>

                        {/* Cantidad y precio total */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-6 h-6 rounded-full bg-[#5D3A2B]/50 flex items-center justify-center hover:bg-cookie-500/20 transition-colors"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="w-3 h-3 text-caramel" />
                            </button>
                            <span className="text-sm font-semibold text-vanilla w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-6 h-6 rounded-full bg-[#5D3A2B]/50 flex items-center justify-center hover:bg-cookie-500/20 transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-3 h-3 text-caramel" />
                            </button>
                          </div>
                          <span className="text-base font-bold text-cookie-400">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Checkout */}
            {items.length > 0 && (
              <div className="flex-shrink-0 p-4 sm:p-6 border-t border-[#4A2F20]/50 bg-gradient-to-t from-[#2C1810]/80 to-transparent">
                {/* Resumen */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-caramel">Subtotal</span>
                    <span className="text-vanilla">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-caramel flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      Envío
                    </span>
                    {subtotal >= freeShippingThreshold ? (
                      <span className="text-green-400">GRATIS</span>
                    ) : (
                      <span className="text-vanilla">
                        ${shipping.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-caramel flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" />
                      Garantía
                    </span>
                    <span className="text-green-400">Incluida</span>
                  </div>
                  <div className="border-t border-[#4A2F20]/50 pt-3">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-vanilla">
                        Total
                      </span>
                      <span className="text-xl font-bold text-cookie-400">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[10px] text-caramel/60 mt-1">
                      Impuestos incluidos • Envío calculado al checkout
                    </p>
                  </div>
                </div>

                {/* Botones de checkout */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsCheckingOut(true);
                      // Aquí iría la lógica de checkout
                      setTimeout(() => {
                        setIsCheckingOut(false);
                        toast.success("🚧 Modo de prueba", {
                          description: "Checkout en desarrollo",
                        });
                      }, 1000);
                    }}
                    disabled={isCheckingOut}
                    className="w-full py-3.5 bg-gradient-cookie text-white font-semibold rounded-xl shadow-cookie hover:shadow-cookie-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {isCheckingOut ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        Proceder al pago
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>

                  <Link href="/products" onClick={toggleCart}>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-3 bg-[#4A2F20]/40 backdrop-blur-sm border-2 border-[#5D3A2B] text-caramel hover:text-cookie-400 rounded-xl font-medium hover:border-cookie-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Cookie className="w-4 h-4" />
                      Seguir comprando
                    </motion.button>
                  </Link>
                </div>

                {/* Cupón/promoción */}
                <div className="mt-4 p-3 bg-gradient-to-r from-cookie-500/10 to-chocolate-500/10 rounded-xl border border-cookie-500/20">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-cookie-400 animate-pulse-soft" />
                    <span className="text-xs text-caramel">
                      ¿Tienes un cupón?
                      <button className="ml-1 text-cookie-400 hover:text-cookie-300 font-semibold transition-colors">
                        Agregar código
                      </button>
                    </span>
                  </div>
                </div>

                {/* Sellos de confianza */}
                <div className="mt-4 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-cookie-400" />
                    <span className="text-[10px] text-caramel/70">
                      Pago seguro
                    </span>
                  </div>
                  <div className="w-1 h-1 bg-caramel/30 rounded-full" />
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cookie-400" />
                    <span className="text-[10px] text-caramel/70">
                      Envío rápido
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
