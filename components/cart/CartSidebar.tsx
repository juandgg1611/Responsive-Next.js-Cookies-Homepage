"use client";
// components/cart/CartSidebar.tsx

import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Cookie,
  Truck,
  Shield,
  Sparkles,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/cart-provider";
import { useBCV } from "@/hooks/useBCV";
import { useState, useEffect } from "react";
import CheckoutModal from "@/components/cart/CheckoutModal";

function toBs(usd: number, rate: number): string {
  return new Intl.NumberFormat("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usd * rate);
}

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

  const { data: bcv, loading: bcvLoading } = useBCV();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const freeShippingThreshold = 50;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remaining = Math.max(freeShippingThreshold - subtotal, 0);

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-48"
              onClick={toggleCart}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 h-full w-full sm:w-[400px] md:w-[450px] bg-gradient-to-br from-[#3A2318] to-[#2C1810] shadow-2xl border-l border-[#4A2F20] flex flex-col"
            >
              {/* Header */}
              <div className="flex-shrink-0 p-4 sm:p-6 border-b border-[#4A2F20]/50">
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
                      className="p-2 rounded-lg hover:bg-[#4A2F20]/50 transition-colors"
                      aria-label="Cerrar"
                    >
                      <X className="w-5 h-5 text-caramel hover:text-cookie-400 transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Barra envio gratis */}
                {items.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-caramel flex items-center gap-1">
                        <Truck className="w-3 h-3 text-cookie-400" /> Envio
                        gratis
                      </span>
                      <span className="text-vanilla">
                        {subtotal >= freeShippingThreshold ? (
                          <span className="text-green-400">Calificado</span>
                        ) : (
                          <span>Faltan ${remaining.toFixed(2)}</span>
                        )}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#4A2F20]/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-cookie rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Tasa BCV */}
                {items.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="text-caramel/60">Tasa BCV:</span>
                    {bcvLoading ? (
                      <Loader2 className="w-3 h-3 text-cookie-400 animate-spin" />
                    ) : bcv ? (
                      <span className="text-cookie-400 font-semibold">
                        Bs. {bcv.usd.toFixed(2)} / USD
                      </span>
                    ) : (
                      <span className="text-red-400/70">No disponible</span>
                    )}
                  </div>
                )}
              </div>

              {/* Lista de productos */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
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
                      Tu carrito esta vacio
                    </h3>
                    <p className="text-sm text-caramel mb-6 max-w-xs">
                      Descubre nuestras deliciosas galletas artesanales
                    </p>
                    <button
                      onClick={toggleCart}
                      className="px-6 py-2.5 bg-gradient-cookie text-white rounded-lg font-semibold text-sm shadow-cookie"
                    >
                      Ver productos
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="group flex gap-4 p-3 rounded-xl bg-[#4A2F20]/30 border border-[#5D3A2B]/30 hover:border-cookie-500/30 transition-all"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-semibold text-vanilla truncate max-w-[150px] group-hover:text-cookie-400 transition-colors">
                                {item.name}
                              </h4>
                              <p className="text-xs text-caramel mt-0.5">
                                ${item.price.toFixed(2)} c/u
                                {bcv && (
                                  <span className="text-caramel/60 ml-1">
                                    / Bs. {toBs(item.price, bcv.usd)}
                                  </span>
                                )}
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

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="w-6 h-6 rounded-full bg-[#5D3A2B]/50 flex items-center justify-center hover:bg-cookie-500/20 transition-colors"
                                aria-label="Disminuir"
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
                                disabled={item.quantity >= item.maxQuantity}
                                className="w-6 h-6 rounded-full bg-[#5D3A2B]/50 flex items-center justify-center hover:bg-cookie-500/20 transition-colors disabled:opacity-40"
                                aria-label="Aumentar"
                              >
                                <Plus className="w-3 h-3 text-caramel" />
                              </button>
                            </div>
                            <div className="text-right">
                              <span className="text-base font-bold text-cookie-400">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              {bcv && (
                                <p className="text-[10px] text-caramel/60">
                                  Bs.{" "}
                                  {toBs(item.price * item.quantity, bcv.usd)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="flex-shrink-0 p-4 sm:p-6 border-t border-[#4A2F20]/50 bg-gradient-to-t from-[#2C1810]/80 to-transparent">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-caramel">Subtotal</span>
                      <div className="text-right">
                        <span className="text-vanilla">
                          ${subtotal.toFixed(2)}
                        </span>
                        {bcv && (
                          <p className="text-[10px] text-caramel/60">
                            Bs. {toBs(subtotal, bcv.usd)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="border-t border-[#4A2F20]/50 pt-2">
                      <div className="flex justify-between">
                        <span className="text-base font-semibold text-vanilla">
                          Total
                        </span>
                        <div className="text-right">
                          <span className="text-xl font-bold text-cookie-400">
                            ${subtotal.toFixed(2)}
                          </span>
                          {bcv && (
                            <p className="text-xs text-cookie-400/70 font-semibold">
                              Bs. {toBs(subtotal, bcv.usd)}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-[10px] text-caramel/40 mt-1">
                        El envio se calcula al finalizar el pedido
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Boton principal: abre el modal de checkout */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsCheckoutOpen(true)}
                      className="w-full py-3.5 bg-gradient-cookie text-white font-semibold rounded-xl shadow-cookie hover:shadow-cookie-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      Finalizar pedido
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                        Envio rapido
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de checkout — se monta fuera del sidebar para z-index correcto */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
