"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Home,
  Package,
  Tag,
  Users,
  Mail,
  Search,
  Phone,
  MapPin,
  Clock,
  ShoppingBag,
  Heart,
  User,
  Settings,
  HelpCircle,
  Award,
  Star,
  Sparkles,
  ChevronRight,
  Cookie,
  ChefHat,
  Gift,
  Truck,
  Shield,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { CartButton } from "../../components/features/cart/cart-button";
import { ThemeToggle } from "../../components/features/theme-toggle/theme-toggle";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleClose = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setActiveSubmenu(null);
    onClose();

    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleSubmenuToggle = (menu: string) => {
    if (activeSubmenu === menu) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(menu);
    }
  };

  const menuItems = [
    {
      id: "home",
      label: "Inicio",
      href: "/",
      icon: Home,
      badge: "🎯",
      description: "Descubre nuestras novedades",
    },
    {
      id: "products",
      label: "Productos",
      icon: Package,
      submenu: [
        { href: "/productos/todas", label: "Todas las Galletas", icon: Cookie },
        {
          href: "/productos/chocolate",
          label: "Chocolate Premium",
          icon: Star,
          badge: "🔥",
        },
        { href: "/productos/frutas", label: "Con Frutas", icon: Sparkles },
        {
          href: "/productos/especiales",
          label: "Ediciones Especiales",
          icon: Award,
        },
        {
          href: "/productos/sin-gluten",
          label: "Sin Gluten",
          icon: Shield,
          badge: "🌾",
        },
        {
          href: "/productos/veganas",
          label: "Galletas Veganas",
          icon: ChefHat,
          badge: "🌱",
        },
        { href: "/productos/regalos", label: "Cajas Regalo", icon: Gift },
      ],
    },
    {
      id: "categories",
      label: "Categorías",
      icon: Tag,
      submenu: [
        { href: "/categorias/bestsellers", label: "Más Vendidas", icon: Star },
        {
          href: "/categorias/nuevas",
          label: "Novedades",
          icon: Sparkles,
          badge: "NUEVO",
        },
        { href: "/categorias/seasonal", label: "De Temporada", icon: Clock },
        { href: "/categorias/regalo", label: "Para Regalar", icon: Gift },
        {
          href: "/categorias/premium",
          label: "Colección Premium",
          icon: Award,
        },
      ],
    },
    {
      id: "about",
      label: "Sobre Nosotros",
      href: "/nosotros",
      icon: Users,
      description: "Nuestra historia y valores",
    },
    {
      id: "contact",
      label: "Contacto",
      href: "/contacto",
      icon: Mail,
      description: "¿En qué podemos ayudarte?",
    },
  ];

  const quickLinks = [
    { href: "/mi-cuenta", label: "Mi Cuenta", icon: User },
    { href: "/favoritos", label: "Favoritos", icon: Heart, count: 3 },
    { href: "/pedidos", label: "Mis Pedidos", icon: ShoppingBag },
    { href: "/configuracion", label: "Configuración", icon: Settings },
    { href: "/ayuda", label: "Ayuda", icon: HelpCircle },
  ];

  const contactInfo = [
    { icon: Phone, text: "+34 912 345 678", href: "tel:+34912345678" },
    { icon: MapPin, text: "Calle del Horno, 123", href: "#" },
    { icon: Clock, text: "9:00 - 21:00", href: "#" },
    { icon: Truck, text: "Envío en 24h", href: "#", badge: "🚚" },
  ];

  const socialLinks = [
    { icon: Instagram, label: "Instagram", href: "#", color: "text-pink-500" },
    { icon: Facebook, label: "Facebook", href: "#", color: "text-blue-500" },
    { icon: Twitter, label: "Twitter", href: "#", color: "text-sky-500" },
    { icon: Youtube, label: "YouTube", href: "#", color: "text-red-500" },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: "#",
      color: "text-green-500",
    },
  ];

  const specialOffers = [
    { text: "🎁 Envío gratis + 2 galletas extra", href: "/ofertas" },
    { text: "⭐ Club VIP: 15% descuento", href: "/club-vip" },
    { text: "🎯 3x2 en galletas de chocolate", href: "/promo-3x2" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  // Variantes de animación para el menú
  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0 },
  };

  const submenuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
      },
    },
  };

  const subItemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay con efecto de blur y cierre */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />

          {/* Panel del menú móvil */}
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-cookie-dark-card 
                     shadow-2xl z-[91] overflow-y-auto"
          >
            {/* Header del menú */}
            <div
              className="sticky top-0 z-10 bg-white dark:bg-cookie-dark-card border-b 
                          border-cookie-cream/30 dark:border-cookie-dark-cream/30"
            >
              <div className="p-6">
                {/* Logo y botón cerrar */}
                <div className="flex items-center justify-between mb-6">
                  <Link
                    href="/"
                    onClick={handleClose}
                    className="flex items-center space-x-3 group"
                  >
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="relative"
                    >
                      <div
                        className="w-12 h-12 rounded-full bg-gradient-cookie 
                                    flex items-center justify-center shadow-lg"
                      >
                        <span className="text-xl font-heading font-bold text-white">
                          V
                        </span>
                      </div>
                      <div
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full 
                                    bg-cookie-gold animate-pulse-cookie"
                      />
                    </motion.div>
                    <div className="flex flex-col">
                      <span className="text-xl font-heading font-bold">
                        Vian Cookies
                      </span>
                      <span className="text-xs text-cookie-text-light dark:text-cookie-dark-text-light">
                        Menú
                      </span>
                    </div>
                  </Link>

                  {/* Acciones del header */}
                  <div className="flex items-center space-x-2">
                    <ThemeToggle />
                    <CartButton />

                    <motion.button
                      whileTap={{ scale: 0.9, rotate: 90 }}
                      onClick={handleClose}
                      className="p-3 rounded-xl bg-cookie-bg-light dark:bg-cookie-dark-surface 
                               hover:bg-cookie-cream/20 dark:hover:bg-cookie-dark-cream/20 
                               transition-colors"
                      aria-label="Cerrar menú"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Barra de búsqueda rápida */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar galletas..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl
                             bg-cookie-bg-light dark:bg-cookie-dark-surface
                             border border-cookie-cream dark:border-cookie-dark-cream
                             focus:outline-none focus:ring-2 focus:ring-cookie-gold/30
                             text-sm"
                  />
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 
                                   w-4 h-4 text-cookie-text-light"
                  />
                </div>
              </div>

              {/* Ofertas especiales */}
              <div className="px-6 pb-4">
                <div
                  className="bg-gradient-to-r from-cookie-gold/10 to-cookie-brown/10 
                              dark:from-cookie-dark-gold/10 dark:to-cookie-dark-brown/10
                              rounded-xl p-3"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-4 h-4 text-cookie-gold" />
                    <span className="font-bold text-sm">Ofertas activas</span>
                  </div>
                  <div className="space-y-2">
                    {specialOffers.map((offer, index) => (
                      <motion.a
                        key={index}
                        href={offer.href}
                        onClick={handleClose}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between text-sm group"
                      >
                        <span
                          className="group-hover:text-cookie-brown 
                                       dark:group-hover:text-cookie-dark-gold"
                        >
                          {offer.text}
                        </span>
                        <ChevronRight
                          className="w-3 h-3 opacity-0 
                                               group-hover:opacity-100 
                                               group-hover:translate-x-1 
                                               transition-all"
                        />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido del menú */}
            <div className="p-6">
              {/* Navegación principal */}
              <nav className="mb-8">
                <h3
                  className="text-xs uppercase tracking-wider text-cookie-text-light 
                             dark:text-cookie-dark-text-light mb-4 font-semibold"
                >
                  Navegación
                </h3>

                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <motion.li
                      key={item.id}
                      variants={itemVariants}
                      className="relative"
                    >
                      {item.submenu ? (
                        <>
                          <button
                            onClick={() => handleSubmenuToggle(item.id)}
                            className={cn(
                              "w-full flex items-center justify-between p-4 rounded-xl",
                              "transition-all duration-300 group",
                              activeSubmenu === item.id
                                ? "bg-gradient-to-r from-cookie-gold/10 to-cookie-brown/10"
                                : "hover:bg-cookie-bg-light dark:hover:bg-cookie-dark-surface",
                            )}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={cn(
                                  "p-2 rounded-lg transition-colors",
                                  activeSubmenu === item.id
                                    ? "bg-cookie-gold text-white"
                                    : "bg-cookie-bg-light dark:bg-cookie-dark-surface text-cookie-brown dark:text-cookie-dark-gold",
                                )}
                              >
                                <item.icon className="w-4 h-4" />
                              </div>
                              <div className="text-left">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <span className="text-xs">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {item.description && (
                                  <span className="text-xs text-cookie-text-light block mt-1">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                            </div>

                            <ChevronRight
                              className={cn(
                                "w-4 h-4 transition-transform duration-300",
                                activeSubmenu === item.id ? "rotate-90" : "",
                              )}
                            />
                          </button>

                          {/* Submenú */}
                          <AnimatePresence>
                            {activeSubmenu === item.id && (
                              <motion.div
                                variants={submenuVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                className="ml-4 mt-1 pl-3 border-l-2 border-cookie-cream/30 
                                         dark:border-cookie-dark-cream/30 overflow-hidden"
                              >
                                <div className="py-2 space-y-1">
                                  {item.submenu.map((subItem, index) => (
                                    <motion.div
                                      key={subItem.href}
                                      variants={subItemVariants}
                                      custom={index}
                                    >
                                      <Link
                                        href={subItem.href}
                                        onClick={handleClose}
                                        className={cn(
                                          "flex items-center justify-between p-3 rounded-lg",
                                          "transition-all duration-300 group",
                                          isActive(subItem.href)
                                            ? "bg-cookie-gold/10 text-cookie-brown dark:text-cookie-dark-gold"
                                            : "hover:bg-cookie-bg-light dark:hover:bg-cookie-dark-surface",
                                        )}
                                      >
                                        <div className="flex items-center space-x-3">
                                          {subItem.icon && (
                                            <subItem.icon className="w-4 h-4 text-cookie-text-light" />
                                          )}
                                          <span className="font-medium">
                                            {subItem.label}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          {subItem.badge && (
                                            <span
                                              className="text-xs px-2 py-0.5 rounded-full 
                                                           bg-cookie-gold/20 text-cookie-gold"
                                            >
                                              {subItem.badge}
                                            </span>
                                          )}
                                          <ChevronRight
                                            className="w-3 h-3 opacity-0 
                                                                 group-hover:opacity-100 
                                                                 group-hover:translate-x-1 
                                                                 transition-all"
                                          />
                                        </div>
                                      </Link>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={handleClose}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl",
                            "transition-all duration-300 group",
                            isActive(item.href)
                              ? "bg-gradient-to-r from-cookie-gold/10 to-cookie-brown/10"
                              : "hover:bg-cookie-bg-light dark:hover:bg-cookie-dark-surface",
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={cn(
                                "p-2 rounded-lg transition-colors",
                                isActive(item.href)
                                  ? "bg-cookie-gold text-white"
                                  : "bg-cookie-bg-light dark:bg-cookie-dark-surface text-cookie-brown dark:text-cookie-dark-gold",
                              )}
                            >
                              <item.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <span className="text-xs">{item.badge}</span>
                                )}
                              </div>
                              {item.description && (
                                <span className="text-xs text-cookie-text-light block mt-1">
                                  {item.description}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight
                            className="w-4 h-4 opacity-0 
                                                 group-hover:opacity-100 
                                                 group-hover:translate-x-1 
                                                 transition-all"
                          />
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Acciones rápidas */}
              <div className="mb-8">
                <h3
                  className="text-xs uppercase tracking-wider text-cookie-text-light 
                             dark:text-cookie-dark-text-light mb-4 font-semibold"
                >
                  Tu Cuenta
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {quickLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      variants={itemVariants}
                      custom={index + menuItems.length}
                    >
                      <Link
                        href={link.href}
                        onClick={handleClose}
                        className="group p-4 rounded-xl bg-cookie-bg-light dark:bg-cookie-dark-surface 
                                 hover:bg-cookie-cream/20 dark:hover:bg-cookie-dark-cream/20 
                                 transition-all duration-300 flex flex-col items-center justify-center 
                                 text-center"
                      >
                        <div className="relative mb-2">
                          <link.icon
                            className="w-5 h-5 text-cookie-brown 
                                               dark:text-cookie-dark-gold"
                          />
                          {link.count && (
                            <span
                              className="absolute -top-2 -right-2 w-5 h-5 rounded-full 
                                           bg-cookie-berry text-white text-xs 
                                           flex items-center justify-center"
                            >
                              {link.count}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium">
                          {link.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Información de contacto */}
              <div className="mb-8">
                <h3
                  className="text-xs uppercase tracking-wider text-cookie-text-light 
                             dark:text-cookie-dark-text-light mb-4 font-semibold"
                >
                  Contacto Rápido
                </h3>

                <div className="space-y-3">
                  {contactInfo.map((info, index) => (
                    <motion.a
                      key={index}
                      href={info.href}
                      variants={itemVariants}
                      custom={index + menuItems.length + quickLinks.length}
                      whileHover={{ x: 5 }}
                      className="flex items-center space-x-3 p-3 rounded-xl 
                               bg-cookie-bg-light dark:bg-cookie-dark-surface 
                               hover:bg-cookie-cream/20 dark:hover:bg-cookie-dark-cream/20 
                               transition-colors group"
                    >
                      <info.icon className="w-4 h-4 text-cookie-gold" />
                      <span className="flex-1 font-medium">{info.text}</span>
                      {info.badge && (
                        <span className="text-sm">{info.badge}</span>
                      )}
                      <ChevronRight
                        className="w-3 h-3 opacity-0 
                                             group-hover:opacity-100 
                                             group-hover:translate-x-1 
                                             transition-all"
                      />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Redes sociales */}
              <div className="mb-8">
                <h3
                  className="text-xs uppercase tracking-wider text-cookie-text-light 
                             dark:text-cookie-dark-text-light mb-4 font-semibold"
                >
                  Síguenos
                </h3>

                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      variants={itemVariants}
                      custom={index}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "p-3 rounded-xl bg-cookie-bg-light dark:bg-cookie-dark-surface",
                        "hover:shadow-lg transition-all duration-300",
                        social.color,
                      )}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* CTA Especial */}
              <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-2xl p-6 
                         bg-gradient-to-br from-cookie-gold to-cookie-brown
                         dark:from-cookie-dark-gold dark:to-cookie-dark-brown"
              >
                <div className="relative z-10">
                  <h3 className="text-xl font-heading font-bold text-white mb-2">
                    ¡Únete al Club VIP!
                  </h3>
                  <p className="text-white/90 text-sm mb-4">
                    15% de descuento en tu primera compra + sorpresas mensuales
                  </p>
                  <button
                    className="w-full bg-white text-cookie-brown font-bold py-3 
                                   rounded-xl hover:bg-white/90 transition-colors"
                  >
                    Registrarse Gratis
                  </button>
                </div>

                {/* Galletas decorativas */}
                <div className="absolute right-4 top-4 opacity-20">
                  <Cookie className="w-12 h-12 text-white" />
                </div>
                <div className="absolute left-4 bottom-4 opacity-10">
                  <Cookie className="w-8 h-8 text-white" />
                </div>
              </motion.div>
            </div>

            {/* Footer del menú */}
            <div
              className="sticky bottom-0 bg-white dark:bg-cookie-dark-card border-t 
                          border-cookie-cream/30 dark:border-cookie-dark-cream/30 p-6"
            >
              <div className="text-center">
                <p className="text-xs text-cookie-text-light dark:text-cookie-dark-text-light mb-2">
                  © {new Date().getFullYear()} Vian Cookies
                </p>
                <div
                  className="flex items-center justify-center space-x-4 text-xs 
                              text-cookie-text-light dark:text-cookie-dark-text-light"
                >
                  <Link
                    href="/privacidad"
                    onClick={handleClose}
                    className="hover:underline"
                  >
                    Privacidad
                  </Link>
                  <span>•</span>
                  <Link
                    href="/terminos"
                    onClick={handleClose}
                    className="hover:underline"
                  >
                    Términos
                  </Link>
                  <span>•</span>
                  <Link
                    href="/cookies"
                    onClick={handleClose}
                    className="hover:underline"
                  >
                    Cookies
                  </Link>
                </div>
              </div>
            </div>

            {/* Efecto de partículas al abrir/cerrar */}
            <AnimatePresence>
              {isAnimating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-cookie-gold"
                      initial={{
                        x: "50%",
                        y: "50%",
                        scale: 0,
                      }}
                      animate={{
                        x: Math.cos(i * 45 * (Math.PI / 180)) * 200 + "px",
                        y: Math.sin(i * 45 * (Math.PI / 180)) * 200 + "px",
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
