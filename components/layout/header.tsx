// components/layout/header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Cookie,
  Sparkles,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/cart-provider"; // ← IMPORTAR useCart

const navItems = [
  { label: "Inicio", href: "#home" },
  { label: "Productos", href: "#products" },
  { label: "Características", href: "#features" },
  { label: "Nosotros", href: "#about" },
  { label: "Testimonios", href: "#testimonials" },
  { label: "Contacto", href: "#cta" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems, toggleCart } = useCart(); // ← USAR EL CARRITO REAL
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Main Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-48 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-lg shadow-cookie-lg py-2 border-b border-border-light"
            : "bg-background-light/80 backdrop-blur-sm py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-full bg-gradient-cookie flex items-center justify-center shadow-glow"
              >
                <Cookie className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-cookie-500">
                  Vian Cookies
                </span>
                <span className="text-xs text-caramel flex items-center">
                  <span className="w-1.5 h-1.5 bg-cookie-500 rounded-full mr-2 animate-pulse-soft" />
                  Galletas Artesanales
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-vanilla hover:text-cookie-400 transition-colors font-medium relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-cookie group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-background-surface/50 transition-colors group"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5 text-vanilla-dark group-hover:text-cookie-400 transition-colors" />
              </button>

              {/* User Account */}
              <Link href="/auth/login">
                <button className="hidden sm:flex p-2 rounded-full hover:bg-background-surface/50 transition-colors group">
                  <User className="w-5 h-5 text-vanilla-dark group-hover:text-cookie-400 transition-colors" />
                </button>
              </Link>

              {/* Cart - AHORA USA EL CARRITO REAL */}
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-full hover:bg-background-surface/50 transition-colors group"
                aria-label="Carrito"
              >
                <ShoppingCart className="w-5 h-5 text-vanilla-dark group-hover:text-cookie-400 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-chocolate rounded-full text-xs flex items-center justify-center text-white font-bold shadow-glow-chocolate animate-pulse-soft">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* Order Now Button */}
              <button className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-cookie text-white font-semibold hover:scale-105 transition-transform shadow-cookie hover:shadow-cookie-lg">
                <Cookie className="w-5 h-5" />
                Ordenar Ahora
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-background-surface/50 transition-colors"
                aria-label="Menú"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-vanilla-dark" />
                ) : (
                  <Menu className="w-6 h-6 text-vanilla-dark" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="py-4 border-t border-border-light">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-caramel" />
                    <input
                      type="text"
                      placeholder="Buscar galletas, sabores..."
                      className="w-full pl-12 pr-24 py-3 rounded-full bg-background-surface border border-border-light text-vanilla placeholder-caramel focus:outline-none focus:ring-2 focus:ring-cookie-500 focus:border-cookie-500 transition-all"
                      autoFocus
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-full bg-gradient-cookie text-sm font-medium text-white hover:shadow-glow transition-all">
                      Buscar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1">
          <motion.div
            className="h-full bg-gradient-cookie shadow-glow"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isScrolled ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ originX: 0 }}
          />
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 right-0 bottom-0 w-80 bg-background z-50 md:hidden shadow-cookie-xl border-l border-border-dark"
          >
            <div className="p-6 h-full flex flex-col">
              {/* Header del menú */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-cookie flex items-center justify-center shadow-glow">
                    <Cookie className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-cookie-500">
                      Vian Cookies
                    </div>
                    <div className="text-xs text-caramel">Menú</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-background-surface transition-colors"
                >
                  <X className="w-5 h-5 text-vanilla-dark" />
                </button>
              </div>

              {/* Navegación móvil */}
              <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 rounded-cookie hover:bg-background-surface text-vanilla hover:text-cookie-400 transition-all border border-transparent hover:border-border-light"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              {/* Acciones móviles */}
              <div className="space-y-4 pt-8 border-t border-border-light">
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full px-4 py-3 rounded-cookie border border-border-light text-vanilla hover:bg-background-surface hover:border-cookie-500 transition-all">
                      Mi Cuenta
                    </button>
                  </Link>
                  <button className="px-4 py-3 rounded-cookie border border-border-light text-vanilla hover:bg-background-surface hover:border-cookie-500 transition-all">
                    Contacto
                  </button>
                </div>

                <button className="w-full py-3 rounded-full bg-gradient-cookie text-white font-semibold flex items-center justify-center gap-2 shadow-cookie hover:shadow-cookie-lg hover:scale-105 transition-all">
                  <Cookie className="w-5 h-5" />
                  Ordenar Ahora
                </button>

                {/* Botón del carrito en móvil */}
                <button
                  onClick={() => {
                    toggleCart();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-full bg-[#4A2F20]/40 backdrop-blur-sm border-2 border-cookie-500/30 text-cookie-400 hover:text-cookie-300 font-semibold hover:border-cookie-400 hover:bg-cookie-500/10 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Ver Carrito {totalItems > 0 && `(${totalItems})`}
                </button>

                {/* Promoción */}
                <div className="p-4 rounded-cookie bg-gradient-to-r from-cookie-500/10 to-chocolate-500/10 border border-cookie-500/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-cookie-400 animate-pulse-soft" />
                    <span className="text-cookie-300 font-medium">
                      20% OFF primera compra
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer para header fijo */}
      <div
        className={`transition-all duration-300 ${isScrolled ? "h-20" : "h-24"}`}
      />
    </>
  );
}
