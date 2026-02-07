"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  Truck,
  Gift,
  Shield,
  CreditCard,
  Tag,
  Heart,
  ArrowRight,
  Cookie,
  ChefHat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "../../../components/providers/cart-provider";
import Image from "next/image";
import Link from "next/link";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  tags: string[];
  maxQuantity: number;
}

export function CartButton() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [items, setItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Galletas de Chocolate Belga 70%",
      price: 12.9,
      quantity: 2,
      image: "/images/products/chocolate-premium.png",
      category: "Chocolate",
      tags: ["premium", "sin gluten", "bestseller"],
      maxQuantity: 10,
    },
    {
      id: "2",
      name: "Galletas de Vainilla Madagascar",
      price: 11.5,
      quantity: 1,
      image: "/images/products/vanilla.png",
      category: "Clásicas",
      tags: ["orgánico", "vegano"],
      maxQuantity: 8,
    },
    {
      id: "3",
      name: "Brownie Cookie Triple Chocolate",
      price: 14.9,
      quantity: 3,
      image: "/images/products/brownie-cookie.png",
      category: "Especiales",
      tags: ["nuevo", "limitado"],
      maxQuantity: 5,
    },
  ]);

  // Efecto de partículas al abrir
  useEffect(() => {
    if (isCartOpen) {
      createParticles();
    }
  }, [isCartOpen]);

  // Crear efecto de partículas
  const createParticles = () => {
    if (typeof window === "undefined") return;

    for (let i = 0; i < 6; i++) {
      const particle = document.createElement("div");
      const size = Math.random() * 8 + 4;

      particle.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(45deg, rgb(var(--cookie-gold)), rgb(var(--cookie-brown)));
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        left: calc(100% - 60px);
        top: 80px;
        transform: translate(-50%, -50%);
        opacity: 0.8;
      `;

      document.body.appendChild(particle);

      const angle = (Math.PI * 2 * i) / 6;
      const distance = 30 + Math.random() * 20;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      particle.animate(
        [
          {
            transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
            opacity: 0.8,
          },
          {
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0.2) rotate(180deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 500,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "forwards",
        },
      );

      setTimeout(() => particle.remove(), 500);
    }
  };

  // Calcular totales
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 30 ? 0 : 4.9;
  const total = subtotal + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Manejar cantidad
  const updateQuantity = (id: string, newQuantity: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, Math.min(item.maxQuantity, newQuantity)),
            }
          : item,
      ),
    );

    // Efecto de animación
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Eliminar item
  const removeItem = (id: string) => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Animación de eliminación
    const itemElement = document.querySelector(`[data-item-id="${id}"]`);
    if (itemElement) {
      itemElement.classList.add("removing");
    }

    setTimeout(() => {
      setItems(items.filter((item) => item.id !== id));
      setIsAnimating(false);
    }, 300);
  };

  // Vaciar carrito
  const clearCart = () => {
    if (isAnimating || items.length === 0) return;

    setIsAnimating(true);

    // Animación de vaciado
    document.querySelectorAll("[data-item-id]").forEach((el) => {
      el.classList.add("removing");
    });

    setTimeout(() => {
      setItems([]);
      setIsAnimating(false);
    }, 500);
  };

  // Agregar al carrito (simulación)
  const addToCart = () => {
    const newItem: CartItem = {
      id: Date.now().toString(),
      name: "Galletas de Matcha y Chocolate Blanco",
      price: 13.5,
      quantity: 1,
      image: "/images/products/matcha.png",
      category: "Especiales",
      tags: ["nuevo", "matcha", "vegano"],
      maxQuantity: 6,
    };

    setItems([...items, newItem]);

    // Efecto de confeti
    createConfetti();
  };

  // Efecto confeti
  const createConfetti = () => {
    if (typeof window === "undefined") return;

    for (let i = 0; i < 15; i++) {
      const confetti = document.createElement("div");
      const colors = ["#F2A900", "#8B6B61", "#854E00", "#BC998E"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 10 + 5;
      const shapes = ["circle", "square", "triangle"];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      confetti.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        pointer-events: none;
        z-index: 10000;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.8;
        ${shape === "circle" ? "border-radius: 50%;" : ""}
        ${shape === "triangle" ? "clip-path: polygon(50% 0%, 0% 100%, 100% 100%);" : ""}
      `;

      document.body.appendChild(confetti);

      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 100;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const rotation = Math.random() * 720;

      confetti.animate(
        [
          {
            transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
            opacity: 0.8,
          },
          {
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0) rotate(${rotation}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 1000,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "forwards",
        },
      );

      setTimeout(() => confetti.remove(), 1000);
    }
  };

  // Obtener icono por categoría
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "chocolate":
        return Cookie;
      case "clásicas":
        return ChefHat;
      case "especiales":
        return Sparkles;
      default:
        return Cookie;
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Botón del carrito */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCartOpen(!isCartOpen)}
        className={cn(
          "relative p-3 rounded-full transition-all duration-500",
          "bg-gradient-to-br from-cookie-gold to-cookie-brown",
          "shadow-lg hover:shadow-2xl hover:shadow-cookie-gold/30",
          "group overflow-hidden",
        )}
        aria-label={`Carrito de compras (${itemCount} items)`}
      >
        {/* Fondo animado */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0"
          animate={{
            x: isHovered ? "100%" : "-100%",
          }}
          transition={{ duration: 1 }}
        />

        {/* Icono del carrito */}
        <ShoppingBag className="w-5 h-5 text-white relative z-10" />

        {/* Contador de items */}
        <motion.div
          key={itemCount}
          initial={{ scale: 0.5, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full 
                   bg-white dark:bg-cookie-dark-surface 
                   border-2 border-cookie-gold
                   flex items-center justify-center"
        >
          <span className="text-xs font-bold text-cookie-brown">
            {itemCount}
          </span>
        </motion.div>

        {/* Efecto de pulsación cuando hay items */}
        {itemCount > 0 && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cookie-gold"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.button>

      {/* Tooltip en hover */}
      <AnimatePresence>
        {isHovered && !isCartOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute top-full right-0 mt-3 z-50"
          >
            <div className="relative">
              {/* Triángulo del tooltip */}
              <div
                className="absolute -top-2 right-4 w-4 h-4 
                            bg-white dark:bg-cookie-dark-card rotate-45"
              />

              {/* Contenido del tooltip */}
              <div
                className="bg-white dark:bg-cookie-dark-card rounded-2xl shadow-2xl 
                            border border-cookie-cream dark:border-cookie-dark-cream 
                            px-4 py-3 min-w-[180px]"
              >
                <div className="text-center">
                  <p className="font-semibold text-cookie-brown dark:text-cookie-dark-gold mb-1">
                    Tu Carrito
                  </p>
                  <p className="text-sm text-cookie-text-light dark:text-cookie-dark-text-light">
                    {itemCount} {itemCount === 1 ? "producto" : "productos"}
                  </p>
                  <p className="text-lg font-bold text-cookie-gold mt-2">
                    {total.toFixed(2)}€
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel del carrito */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Panel del carrito */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md 
                       bg-white dark:bg-cookie-dark-card shadow-2xl 
                       border-l border-cookie-cream dark:border-cookie-dark-cream
                       z-50 flex flex-col"
            >
              {/* Header del carrito */}
              <div
                className="p-6 border-b border-cookie-cream/30 
                            dark:border-cookie-dark-cream/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-xl bg-gradient-to-br 
                                  from-cookie-gold/10 to-cookie-brown/10"
                    >
                      <ShoppingBag className="w-6 h-6 text-cookie-gold" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-heading font-bold">
                        Tu Carrito
                      </h2>
                      <p
                        className="text-sm text-cookie-text-light 
                                  dark:text-cookie-dark-text-light"
                      >
                        {itemCount} {itemCount === 1 ? "producto" : "productos"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addToCart}
                      className="p-2 rounded-xl bg-cookie-bg-light 
                               dark:bg-cookie-dark-surface
                               hover:bg-cookie-cream/20 
                               dark:hover:bg-cookie-dark-cream/20
                               transition-colors"
                      aria-label="Añadir producto de prueba"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsCartOpen(false)}
                      className="p-2 rounded-xl bg-cookie-bg-light 
                               dark:bg-cookie-dark-surface
                               hover:bg-cookie-cream/20 
                               dark:hover:bg-cookie-dark-cream/20
                               transition-colors"
                      aria-label="Cerrar carrito"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Promoción */}
                {subtotal < 30 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-cookie-gold/10 to-cookie-brown/10 
                             rounded-xl p-4 mb-4"
                  >
                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-cookie-gold" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          ¡Envío gratis en +30€!
                        </p>
                        <p className="text-xs text-cookie-text-light">
                          Te faltan {(30 - subtotal).toFixed(2)}€
                        </p>
                      </div>
                      <div className="w-16 h-2 bg-cookie-cream/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(subtotal / 30) * 100}%` }}
                          className="h-full bg-gradient-to-r from-cookie-gold to-cookie-brown"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Lista de productos */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence>
                  {items.length === 0 ? (
                    // Carrito vacío
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-12"
                    >
                      <div
                        className="w-24 h-24 mx-auto mb-6 rounded-full 
                                   bg-gradient-to-br from-cookie-cream/20 to-cookie-brown/20 
                                   flex items-center justify-center"
                      >
                        <ShoppingBag className="w-12 h-12 text-cookie-text-light" />
                      </div>
                      <h3 className="text-2xl font-heading font-bold mb-2">
                        Tu carrito está vacío
                      </h3>
                      <p className="text-cookie-text-light mb-6">
                        ¡Añade deliciosas galletas para empezar!
                      </p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="btn-cookie"
                      >
                        Explorar Productos
                      </button>
                    </motion.div>
                  ) : (
                    // Items del carrito
                    <div className="space-y-4">
                      {items.map((item, index) => {
                        const CategoryIcon = getCategoryIcon(item.category);
                        return (
                          <motion.div
                            key={item.id}
                            data-item-id={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                          >
                            <div
                              className="flex items-start space-x-4 p-4 rounded-2xl 
                                         bg-cookie-bg-light dark:bg-cookie-dark-surface
                                         border border-transparent 
                                         group-hover:border-cookie-cream/50
                                         transition-all duration-300"
                            >
                              {/* Imagen del producto */}
                              <div className="relative">
                                <div
                                  className="w-20 h-20 rounded-xl 
                                             bg-gradient-to-br from-cookie-cream to-cookie-brown
                                             flex items-center justify-center"
                                >
                                  <CategoryIcon className="w-8 h-8 text-white" />
                                </div>
                                <div
                                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full 
                                             bg-cookie-gold text-white text-xs 
                                             flex items-center justify-center font-bold"
                                >
                                  {item.quantity}
                                </div>
                              </div>

                              {/* Información del producto */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-bold text-sm mb-1">
                                      {item.name}
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs text-cookie-text-light">
                                        {item.category}
                                      </span>
                                      {item.tags.map((tag, i) => (
                                        <span
                                          key={i}
                                          className="px-1.5 py-0.5 text-xs rounded-full 
                                                   bg-cookie-cream/20 text-cookie-text-light"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="p-1 rounded-lg opacity-0 group-hover:opacity-100 
                                             hover:bg-cookie-cream/20 transition-all"
                                    aria-label="Eliminar producto"
                                  >
                                    <Trash2 className="w-4 h-4 text-cookie-error" />
                                  </button>
                                </div>

                                {/* Contador y precio */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          item.quantity - 1,
                                        )
                                      }
                                      disabled={item.quantity <= 1}
                                      className="p-1.5 rounded-lg disabled:opacity-30
                                               hover:bg-cookie-cream/20 transition-colors"
                                      aria-label="Disminuir cantidad"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>

                                    <span className="w-8 text-center font-bold">
                                      {item.quantity}
                                    </span>

                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          item.quantity + 1,
                                        )
                                      }
                                      disabled={
                                        item.quantity >= item.maxQuantity
                                      }
                                      className="p-1.5 rounded-lg disabled:opacity-30
                                               hover:bg-cookie-cream/20 transition-colors"
                                      aria-label="Aumentar cantidad"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <div className="text-right">
                                    <p className="text-lg font-heading font-bold text-cookie-gold">
                                      {(item.price * item.quantity).toFixed(2)}€
                                    </p>
                                    <p className="text-xs text-cookie-text-light">
                                      {item.price.toFixed(2)}€ c/u
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Efecto de eliminación */}
                            <div
                              className="absolute inset-0 bg-red-500/10 rounded-2xl 
                                         opacity-0 transition-opacity duration-300
                                         pointer-events-none removing:opacity-100"
                            />
                          </motion.div>
                        );
                      })}

                      {/* Botón para vaciar carrito */}
                      {items.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pt-4 border-t border-cookie-cream/30"
                        >
                          <button
                            onClick={clearCart}
                            className="flex items-center justify-center space-x-2 
                                     w-full py-3 rounded-xl
                                     bg-cookie-bg-light dark:bg-cookie-dark-surface
                                     hover:bg-cookie-cream/20 dark:hover:bg-cookie-dark-cream/20
                                     transition-colors text-cookie-text-light"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Vaciar carrito</span>
                          </button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Resumen y checkout */}
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-cookie-cream/30 
                           dark:border-cookie-dark-cream/30 p-6"
                >
                  {/* Resumen */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-cookie-text-light">Subtotal</span>
                      <span className="font-semibold">
                        {subtotal.toFixed(2)}€
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-cookie-text-light" />
                        <span className="text-cookie-text-light">Envío</span>
                      </div>
                      <span
                        className={
                          shipping === 0
                            ? "text-cookie-success font-semibold"
                            : ""
                        }
                      >
                        {shipping === 0
                          ? "¡GRATIS!"
                          : `${shipping.toFixed(2)}€`}
                      </span>
                    </div>

                    {shipping > 0 && (
                      <div
                        className="text-sm text-cookie-gold bg-cookie-gold/10 
                                    rounded-lg p-3 text-center"
                      >
                        <p>
                          <strong>
                            Añade {(30 - subtotal).toFixed(2)}€ más
                          </strong>{" "}
                          para envío gratis
                        </p>
                      </div>
                    )}

                    <div className="border-t border-cookie-cream/30 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">Total</span>
                        <div className="text-right">
                          <span className="text-2xl font-heading font-bold text-cookie-gold">
                            {total.toFixed(2)}€
                          </span>
                          <p className="text-xs text-cookie-text-light">
                            IVA incluido
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Beneficios */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div
                      className="text-center p-3 rounded-xl 
                                  bg-cookie-bg-light dark:bg-cookie-dark-surface"
                    >
                      <Shield className="w-4 h-4 mx-auto mb-1 text-cookie-success" />
                      <span className="text-xs">Pago seguro</span>
                    </div>
                    <div
                      className="text-center p-3 rounded-xl 
                                  bg-cookie-bg-light dark:bg-cookie-dark-surface"
                    >
                      <Truck className="w-4 h-4 mx-auto mb-1 text-cookie-gold" />
                      <span className="text-xs">Envío 24h</span>
                    </div>
                    <div
                      className="text-center p-3 rounded-xl 
                                  bg-cookie-bg-light dark:bg-cookie-dark-surface"
                    >
                      <Gift className="w-4 h-4 mx-auto mb-1 text-cookie-berry" />
                      <span className="text-xs">Regalo sorpresa</span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-cookie flex items-center justify-center space-x-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Pagar ahora</span>
                    </motion.button>

                    <Link
                      href="/carrito"
                      onClick={() => setIsCartOpen(false)}
                      className="block w-full btn-cookie-secondary 
                               flex items-center justify-center space-x-2"
                    >
                      <span>Ver carrito completo</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={addToCart}
                      className="w-full py-3 rounded-xl border-2 border-dashed 
                               border-cookie-cream hover:border-cookie-gold
                               hover:bg-cookie-gold/5 transition-all duration-300
                               flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Añadir más productos</span>
                    </button>
                  </div>

                  {/* Cupón de descuento */}
                  <div className="mt-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Tag className="w-4 h-4 text-cookie-gold" />
                      <span className="font-semibold">¿Tienes un cupón?</span>
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Código de descuento"
                        className="flex-1 px-4 py-3 rounded-xl
                                 bg-cookie-bg-light dark:bg-cookie-dark-surface
                                 border border-cookie-cream dark:border-cookie-dark-cream
                                 focus:outline-none focus:ring-2 focus:ring-cookie-gold/30"
                      />
                      <button
                        className="px-4 py-3 rounded-xl bg-cookie-cream/20 
                                       hover:bg-cookie-cream/30 transition-colors"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
