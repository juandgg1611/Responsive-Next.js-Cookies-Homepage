"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";

export function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, total, itemCount } = useCart();

  return (
    <>
      {/* El carrito se abre desde CartButton, este es solo un placeholder */}
      {/* Mostrar solo si hay items en el carrito */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-6 z-40 hidden md:block"
          >
            <div
              className="bg-white dark:bg-cookie-dark-card rounded-2xl 
                          shadow-2xl border border-cookie-cream 
                          dark:border-cookie-dark-cream p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-cookie-gold" />
                  {itemCount > 0 && (
                    <span
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full 
                                   bg-cookie-berry text-white text-xs 
                                   flex items-center justify-center"
                    >
                      {itemCount}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">Carrito activo</p>
                  <p className="text-xs text-cookie-text-light">
                    {itemCount} {itemCount === 1 ? "producto" : "productos"} -{" "}
                    {total.toFixed(2)}€
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal del carrito (placeholder) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-md 
                       bg-white dark:bg-cookie-dark-card shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-cookie-cream/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="w-6 h-6 text-cookie-gold" />
                    <h2 className="text-2xl font-bold">Tu Carrito</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-cookie-cream/20 
                             dark:hover:bg-cookie-dark-cream/20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-cookie-cream mx-auto mb-4" />
                    <p className="text-cookie-text-light">
                      Tu carrito está vacío
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-cookie-text-light mb-4">
                      {itemCount} {itemCount === 1 ? "producto" : "productos"}{" "}
                      en el carrito
                    </p>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 
                                   rounded-xl bg-cookie-bg-light 
                                   dark:bg-cookie-dark-surface"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-cookie-text-light">
                              {item.quantity} x {item.price.toFixed(2)}€
                            </p>
                          </div>
                          <p className="font-bold text-cookie-gold">
                            {(item.price * item.quantity).toFixed(2)}€
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-cookie-cream/30">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-bold text-cookie-gold">
                          {total.toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
