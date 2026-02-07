"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Cookie,
  Star,
  Sparkles,
  Filter,
  ChefHat,
  Flame,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: "product" | "category" | "recipe" | "blog";
  title: string;
  description: string;
  price?: number;
  rating?: number;
  image?: string;
  category?: string;
  tags: string[];
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  // Datos de ejemplo para demostración
  const mockProducts: SearchResult[] = [
    {
      id: "1",
      type: "product",
      title: "Galletas de Chocolate con Avellanas",
      description: "Chocolate belga 70% con avellanas tostadas",
      price: 12.9,
      rating: 4.9,
      category: "Chocolate",
      tags: ["premium", "sin gluten", "bestseller"],
    },
    {
      id: "2",
      type: "product",
      title: "Galletas de Vainilla y Frambuesa",
      description: "Vainilla de Madagascar con frambuesas liofilizadas",
      price: 11.5,
      rating: 4.8,
      category: "Frutas",
      tags: ["orgánico", "vegano", "nuevo"],
    },
    {
      id: "3",
      type: "product",
      title: "Brownie Cookie Triple Chocolate",
      description: "Triple capa de chocolate con nueces de macadamia",
      price: 14.9,
      rating: 5.0,
      category: "Chocolate",
      tags: ["premium", "especial", "limitado"],
    },
    {
      id: "4",
      type: "category",
      title: "Galletas Sin Gluten",
      description: "Nuestra selección especial sin gluten",
      category: "Especiales",
      tags: ["saludable", "sin gluten"],
    },
    {
      id: "5",
      type: "recipe",
      title: "Cómo hacer galletas perfectas",
      description: "Receta secreta de la abuela",
      category: "Recetas",
      tags: ["tutorial", "video"],
    },
  ];

  const categories = [
    { id: "all", label: "Todo", icon: Search, count: 45 },
    { id: "chocolate", label: "Chocolate", icon: Cookie, count: 12 },
    { id: "frutas", label: "Frutas", icon: Sparkles, count: 8 },
    { id: "especiales", label: "Especiales", icon: Star, count: 6 },
    { id: "vegano", label: "Vegano", icon: ChefHat, count: 10 },
    { id: "bestseller", label: "Más Vendidas", icon: Flame, count: 15 },
  ];

  const trendingSearches = [
    "galletas de chocolate",
    "sin gluten",
    "regalos gourmet",
    "navidad",
    "vegano",
    "con nueces",
  ];

  // Enfocar input cuando se abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vian-cookies-recent-searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    }
  }, []);

  // Guardar búsqueda en recientes
  const saveToRecentSearches = (query: string) => {
    if (!query.trim()) return;

    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(
      0,
      5,
    );
    setRecentSearches(updated);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "vian-cookies-recent-searches",
        JSON.stringify(updated),
      );
    }
  };

  // Manejar búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    saveToRecentSearches(searchQuery);
    setIsLoading(true);
    setShowResults(true);

    // Simular búsqueda con delay
    setTimeout(() => {
      const results = mockProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );

      setSearchResults(results);
      setIsLoading(false);
    }, 600);
  };

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-search-dialog]")) return;
      if (isOpen) onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
    setSearchResults([]);
    if (inputRef.current) inputRef.current.focus();
  };

  // Seleccionar búsqueda rápida
  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    saveToRecentSearches(query);

    // Simular búsqueda
    setIsLoading(true);
    setShowResults(true);

    setTimeout(() => {
      const results = mockProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()),
      );

      setSearchResults(results);
      setIsLoading(false);
    }, 400);
  };

  // Obtener color según tipo
  const getTypeColor = (type: SearchResult["type"]) => {
    switch (type) {
      case "product":
        return "text-cookie-gold";
      case "category":
        return "text-cookie-berry";
      case "recipe":
        return "text-cookie-matcha";
      case "blog":
        return "text-cookie-brown";
      default:
        return "text-cookie-text-light";
    }
  };

  // Obtener ícono según tipo
  const getTypeIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "product":
        return Cookie;
      case "category":
        return Filter;
      case "recipe":
        return ChefHat;
      case "blog":
        return Sparkles;
      default:
        return Search;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay con blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100]"
          />

          {/* Diálogo principal */}
          <motion.div
            data-search-dialog
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 
                     md:top-24 md:w-full md:max-w-3xl z-[101]"
          >
            <div
              className="bg-white dark:bg-cookie-dark-card rounded-3xl shadow-2xl 
                          border border-cookie-cream dark:border-cookie-dark-cream 
                          overflow-hidden max-h-[80vh] flex flex-col"
            >
              {/* Header del diálogo */}
              <div className="p-6 border-b border-cookie-cream/30 dark:border-cookie-dark-cream/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-cookie-gold/10 to-cookie-brown/10">
                      <Search className="w-6 h-6 text-cookie-gold" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold">
                      Buscar en Vian Cookies
                    </h2>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-2 rounded-full bg-cookie-bg-light dark:bg-cookie-dark-surface 
                             hover:bg-cookie-cream/20 dark:hover:bg-cookie-dark-cream/20 
                             transition-colors"
                    aria-label="Cerrar búsqueda"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Barra de búsqueda */}
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative">
                    <Search
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 
                                    w-5 h-5 text-cookie-text-light dark:text-cookie-dark-text-light"
                    />

                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value.trim()) {
                          setShowResults(true);
                        } else {
                          setShowResults(false);
                        }
                      }}
                      placeholder="¿Qué galletas buscas hoy? Ej: 'chocolate sin gluten'..."
                      className="w-full pl-12 pr-24 py-4 text-lg rounded-2xl
                               bg-cookie-bg-light dark:bg-cookie-dark-surface
                               border-2 border-cookie-cream dark:border-cookie-dark-cream
                               focus:border-cookie-gold dark:focus:border-cookie-dark-gold
                               focus:ring-2 focus:ring-cookie-gold/20
                               outline-none transition-all duration-300"
                    />

                    {/* Acciones de búsqueda */}
                    <div
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 
                                  flex items-center space-x-2"
                    >
                      {searchQuery && (
                        <motion.button
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          type="button"
                          onClick={clearSearch}
                          className="p-2 rounded-full hover:bg-cookie-cream/20 
                                   dark:hover:bg-cookie-dark-cream/20 transition-colors"
                          aria-label="Limpiar búsqueda"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={!searchQuery.trim() || isLoading}
                        className={cn(
                          "px-4 py-2 rounded-xl font-semibold transition-all duration-300",
                          searchQuery.trim()
                            ? "bg-gradient-cookie text-white shadow-lg hover:shadow-xl"
                            : "bg-cookie-cream/20 text-cookie-text-light cursor-not-allowed",
                        )}
                      >
                        {isLoading ? "Buscando..." : "Buscar"}
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Contenido del diálogo */}
              <div className="flex-1 overflow-y-auto">
                {showResults ? (
                  // Resultados de búsqueda
                  <div className="p-6">
                    {/* Categorías */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading font-bold text-lg">
                          Filtrar por categoría
                        </h3>
                        <span className="text-sm text-cookie-text-light">
                          {searchResults.length} resultados
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => {
                          const Icon = category.icon;
                          return (
                            <motion.button
                              key={category.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setActiveCategory(category.id)}
                              className={cn(
                                "flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300",
                                activeCategory === category.id
                                  ? "bg-gradient-to-r from-cookie-gold to-cookie-brown text-white"
                                  : "bg-cookie-bg-light dark:bg-cookie-dark-surface hover:bg-cookie-cream/20",
                              )}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="font-medium">
                                {category.label}
                              </span>
                              <span className="text-xs opacity-80">
                                ({category.count})
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Estado de carga */}
                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center space-x-4 p-4 rounded-2xl 
                                     bg-cookie-bg-light dark:bg-cookie-dark-surface"
                          >
                            <div className="w-16 h-16 rounded-xl skeleton-cookie" />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 w-3/4 rounded skeleton-cookie" />
                              <div className="h-3 w-1/2 rounded skeleton-cookie" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : searchResults.length > 0 ? (
                      // Lista de resultados
                      <div className="space-y-4">
                        {searchResults.map((result, index) => {
                          const TypeIcon = getTypeIcon(result.type);
                          return (
                            <motion.div
                              key={result.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ x: 4 }}
                              className="group"
                            >
                              <div
                                className="flex items-start space-x-4 p-4 rounded-2xl 
                                           bg-cookie-bg-light dark:bg-cookie-dark-surface
                                           hover:bg-cookie-cream/20 dark:hover:bg-cookie-dark-cream/20
                                           transition-all duration-300 cursor-pointer
                                           border border-transparent hover:border-cookie-cream/50"
                              >
                                {/* Icono de tipo */}
                                <div
                                  className={cn(
                                    "p-3 rounded-xl",
                                    result.type === "product"
                                      ? "bg-cookie-gold/10"
                                      : result.type === "category"
                                        ? "bg-cookie-berry/10"
                                        : result.type === "recipe"
                                          ? "bg-cookie-matcha/10"
                                          : "bg-cookie-brown/10",
                                  )}
                                >
                                  <TypeIcon
                                    className={cn(
                                      "w-5 h-5",
                                      getTypeColor(result.type),
                                    )}
                                  />
                                </div>

                                {/* Contenido */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4
                                        className="font-bold text-lg mb-1 group-hover:text-cookie-brown 
                                                   dark:group-hover:text-cookie-dark-gold transition-colors"
                                      >
                                        {result.title}
                                      </h4>
                                      <p
                                        className="text-cookie-text-light dark:text-cookie-dark-text-light 
                                                  text-sm mb-2"
                                      >
                                        {result.description}
                                      </p>
                                    </div>

                                    {result.price && (
                                      <div className="text-right">
                                        <span className="text-2xl font-heading font-bold text-cookie-gold">
                                          {result.price.toFixed(2)}€
                                        </span>
                                        <div className="flex items-center justify-end space-x-1 mt-1">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              className={cn(
                                                "w-3 h-3",
                                                i <
                                                  Math.floor(result.rating || 0)
                                                  ? "fill-cookie-gold text-cookie-gold"
                                                  : "text-cookie-cream",
                                              )}
                                            />
                                          ))}
                                          <span className="text-xs text-cookie-text-light ml-1">
                                            {result.rating}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Tags */}
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {result.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="px-2 py-1 text-xs rounded-full 
                                                 bg-cookie-cream/20 dark:bg-cookie-dark-cream/20
                                                 text-cookie-text-light dark:text-cookie-dark-text-light"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                    {result.category && (
                                      <span
                                        className="px-2 py-1 text-xs rounded-full 
                                                     bg-gradient-to-r from-cookie-gold/20 to-cookie-brown/20
                                                     text-cookie-brown dark:text-cookie-dark-gold
                                                     font-semibold"
                                      >
                                        {result.category}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      // Sin resultados
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                      >
                        <div
                          className="w-24 h-24 mx-auto mb-6 rounded-full 
                                     bg-gradient-to-br from-cookie-cream/20 to-cookie-brown/20 
                                     flex items-center justify-center"
                        >
                          <Cookie className="w-12 h-12 text-cookie-text-light" />
                        </div>
                        <h3 className="text-2xl font-heading font-bold mb-2">
                          ¡No encontramos esa galleta!
                        </h3>
                        <p className="text-cookie-text-light mb-6 max-w-md mx-auto">
                          Lo sentimos, no tenemos resultados para "{searchQuery}
                          ". Prueba con otras palabras o explora nuestras
                          categorías.
                        </p>
                        <button
                          onClick={clearSearch}
                          className="btn-cookie-secondary"
                        >
                          Ver todas las galletas
                        </button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  // Vista inicial (sin búsqueda)
                  <div className="p-6">
                    {/* Búsquedas recientes */}
                    {recentSearches.length > 0 && (
                      <div className="mb-8">
                        <div className="flex items-center space-x-2 mb-4">
                          <Clock className="w-5 h-5 text-cookie-gold" />
                          <h3 className="font-heading font-bold text-lg">
                            Búsquedas recientes
                          </h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((search, index) => (
                            <motion.button
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleQuickSearch(search)}
                              className="flex items-center space-x-2 px-4 py-2 rounded-xl 
                                       bg-cookie-bg-light dark:bg-cookie-dark-surface
                                       hover:bg-cookie-cream/20 dark:hover:bg-cookie-dark-cream/20
                                       transition-colors"
                            >
                              <Clock className="w-4 h-4" />
                              <span>{search}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tendencias */}
                    <div className="mb-8">
                      <div className="flex items-center space-x-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-cookie-berry" />
                        <h3 className="font-heading font-bold text-lg">
                          Tendencias ahora
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {trendingSearches.map((trend, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleQuickSearch(trend)}
                            className="group p-4 rounded-2xl text-left
                                     bg-gradient-to-br from-cookie-bg-light to-white 
                                     dark:from-cookie-dark-surface dark:to-cookie-dark-card
                                     hover:from-cookie-gold/10 hover:to-cookie-brown/10
                                     dark:hover:from-cookie-dark-gold/10 dark:hover:to-cookie-dark-brown/10
                                     border border-cookie-cream/30 dark:border-cookie-dark-cream/30
                                     transition-all duration-300"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-2xl">
                                {index === 0
                                  ? "🔥"
                                  : index === 1
                                    ? "⭐"
                                    : index === 2
                                      ? "✨"
                                      : "🍪"}
                              </span>
                              <TrendingUp
                                className="w-4 h-4 text-cookie-gold 
                                                    opacity-0 group-hover:opacity-100 
                                                    transition-opacity"
                              />
                            </div>
                            <span className="font-medium">{trend}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Categorías destacadas */}
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <Sparkles className="w-5 h-5 text-cookie-gold" />
                        <h3 className="font-heading font-bold text-lg">
                          Explora categorías
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {categories.slice(1, 5).map((category, index) => {
                          const Icon = category.icon;
                          return (
                            <motion.button
                              key={category.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.05, y: -5 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setActiveCategory(category.id);
                                handleQuickSearch(category.label);
                              }}
                              className="group p-4 rounded-2xl text-center
                                       bg-gradient-to-br from-cookie-light to-cookie-bg-light
                                       dark:from-cookie-dark-card dark:to-cookie-dark-surface
                                       border-2 border-cookie-cream/30 dark:border-cookie-dark-cream/30
                                       hover:border-cookie-gold dark:hover:border-cookie-dark-gold
                                       transition-all duration-300"
                            >
                              <div
                                className="w-12 h-12 mx-auto mb-3 rounded-xl
                                           bg-gradient-to-br from-cookie-gold/20 to-cookie-brown/20
                                           flex items-center justify-center group-hover:scale-110 
                                           transition-transform duration-300"
                              >
                                <Icon
                                  className="w-6 h-6 text-cookie-brown 
                                               dark:text-cookie-dark-gold"
                                />
                              </div>
                              <span className="font-bold block mb-1">
                                {category.label}
                              </span>
                              <span className="text-sm text-cookie-text-light">
                                {category.count} productos
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                className="p-4 border-t border-cookie-cream/30 dark:border-cookie-dark-cream/30 
                            bg-cookie-bg-light/50 dark:bg-cookie-dark-surface/50"
              >
                <div className="flex items-center justify-between text-sm text-cookie-text-light">
                  <div className="flex items-center space-x-4">
                    <span>
                      Presiona{" "}
                      <kbd
                        className="px-2 py-1 rounded bg-white dark:bg-cookie-dark-surface 
                                                 border border-cookie-cream"
                      >
                        ESC
                      </kbd>{" "}
                      para cerrar
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Encuentra tu galleta perfecta</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
