"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón flotante del chatbot */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full 
                 bg-gradient-to-br from-cookie-gold to-cookie-brown
                 shadow-2xl hover:shadow-3xl transition-shadow"
        aria-label="Abrir asistente virtual"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.button>

      {/* Modal del chatbot (placeholder) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Panel del chatbot */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-cookie-dark-card 
                       rounded-2xl shadow-2xl border border-cookie-cream 
                       dark:border-cookie-dark-cream overflow-hidden"
            >
              {/* Header */}
              <div
                className="p-4 border-b border-cookie-cream/30 
                            dark:border-cookie-dark-cream/30 bg-cookie-bg-light 
                            dark:bg-cookie-dark-surface"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full bg-gradient-cookie 
                                  flex items-center justify-center"
                    >
                      <span className="text-white font-bold">V</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Asistente Vian</h3>
                      <p className="text-xs text-cookie-text-light">En línea</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-cookie-cream/20 
                             dark:hover:bg-cookie-dark-cream/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <div className="text-center">
                  <p className="text-cookie-text-light mb-4">
                    ¡Hola! Soy tu asistente virtual de Vian Cookies.
                  </p>
                  <p className="text-sm text-cookie-text-light">
                    Próximamente podrás hacerme preguntas sobre nuestros
                    productos, pedidos o cualquier duda que tengas.
                  </p>
                </div>
              </div>

              {/* Input placeholder */}
              <div className="p-4 border-t border-cookie-cream/30">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    disabled
                    className="flex-1 px-4 py-3 rounded-xl bg-cookie-bg-light 
                             dark:bg-cookie-dark-surface border border-cookie-cream 
                             dark:border-cookie-dark-cream text-sm"
                  />
                  <button
                    disabled
                    className="px-4 py-3 rounded-xl bg-cookie-cream/30 
                             text-cookie-text-light text-sm"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
