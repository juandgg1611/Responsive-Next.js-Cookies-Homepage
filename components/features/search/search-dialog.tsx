"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Clock,
  Star,
  Flame,
  Leaf,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/cart-provider";
import { PRODUCTS, type Product } from "@/lib/products-data";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const TAG_STYLES: Record<string, string> = {
  "best seller": "bg-amber-500/20 text-amber-700 dark:text-amber-400",
  "más vendido": "bg-amber-500/20 text-amber-700 dark:text-amber-400",
  nuevo: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  limitado: "bg-rose-500/20 text-rose-700 dark:text-rose-400",
  "fan favorite": "bg-violet-500/20 text-violet-700 dark:text-violet-400",
};

function searchProducts(query: string): Product[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.ingredients.some((i) => i.toLowerCase().includes(q)) ||
      (p.tag && p.tag.toLowerCase().includes(q)) ||
      p.pairings.some((p) => p.toLowerCase().includes(q)) ||
      (q === "vegano" && p.isVegan) ||
      (q === "nuevo" && p.isNew) ||
      (q === "bestseller" && p.isBestSeller)
  );
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { addItem } = useCart();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const saved = localStorage.getItem("vian-recent-searches");
      if (saved) setRecentSearches(JSON.parse(saved).slice(0, 5));
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    setResults(searchProducts(query));
  }, [query]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const saveSearch = useCallback((term: string) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const updated = [term, ...prev.filter((s) => s !== term)].slice(0, 5);
      localStorage.setItem("vian-recent-searches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleProductClick = (product: Product) => {
    saveSearch(query || product.name);
    onClose();
    router.push(`/products`);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, badge: product.tag ?? undefined, maxQuantity: 10 });
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("vian-recent-searches");
  };

  const featuredProducts = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-24 md:w-full md:max-w-2xl z-[101]"
          >
            <div className="bg-background dark:bg-background border border-border-light dark:border-border-dark rounded-2xl shadow-cookie-xl overflow-hidden flex flex-col max-h-[80vh]">

              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border-light dark:border-border-dark">
                <Search className="w-5 h-5 text-cookie-500 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar galletas, sabores, ingredientes..."
                  className="flex-1 bg-transparent text-vanilla dark:text-vanilla placeholder-caramel text-base outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 rounded-full hover:bg-background-surface transition-colors"
                  >
                    <X className="w-4 h-4 text-caramel" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-background-surface transition-colors ml-1"
                >
                  <X className="w-5 h-5 text-caramel" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1">
                <AnimatePresence mode="wait">

                  {/* ── Results ── */}
                  {query.trim() && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {results.length > 0 ? (
                        <div className="p-2">
                          <p className="text-xs text-caramel px-3 py-2 font-medium">
                            {results.length} resultado{results.length !== 1 ? "s" : ""} para "{query}"
                          </p>
                          {results.map((product, i) => (
                            <motion.button
                              key={product.id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04 }}
                              onClick={() => handleProductClick(product)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-background-surface transition-colors group text-left"
                            >
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-background-surface">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-sm font-medium text-vanilla truncate">
                                    {product.name}
                                  </span>
                                  {product.tag && (
                                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0", TAG_STYLES[product.tag] ?? "bg-cookie-500/20 text-cookie-400")}>
                                      {product.tag}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Star className="w-3 h-3 fill-cookie-400 text-cookie-400" />
                                  <span className="text-xs text-caramel">{product.rating}</span>
                                  <span className="text-xs text-caramel">·</span>
                                  <span className="text-xs text-caramel capitalize">{product.category}</span>
                                  {product.isVegan && (
                                    <>
                                      <span className="text-xs text-caramel">·</span>
                                      <Leaf className="w-3 h-3 text-emerald-400" />
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-sm font-semibold text-cookie-400">
                                  ${product.price.toFixed(2)}
                                </span>
                                <button
                                  onClick={(e) => handleQuickAdd(e, product)}
                                  className="p-1.5 rounded-lg bg-cookie-500/10 hover:bg-cookie-500/20 text-cookie-400 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <motion.div
                          key="no-results"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="py-12 text-center px-6"
                        >
                          <div className="w-16 h-16 rounded-full bg-background-surface flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-caramel" />
                          </div>
                          <p className="text-vanilla font-medium mb-1">Sin resultados para "{query}"</p>
                          <p className="text-sm text-caramel mb-4">Prueba con chocolate, caramelo o vainilla 🍪</p>
                          <button
                            onClick={() => setQuery("")}
                            className="text-sm text-cookie-400 hover:text-cookie-300 transition-colors"
                          >
                            Ver todas las galletas
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* ── Initial state ── */}
                  {!query.trim() && (
                    <motion.div
                      key="initial"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-4 space-y-5"
                    >


                      {/* Recent searches */}
                      {recentSearches.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-cookie-400" />
                              <span className="text-xs font-medium text-caramel uppercase tracking-wider">Recientes</span>
                            </div>
                            <button onClick={clearRecent} className="text-xs text-caramel hover:text-cookie-400 transition-colors">
                              Borrar
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {recentSearches.map((s) => (
                              <button
                                key={s}
                                onClick={() => setQuery(s)}
                                className="px-3 py-1.5 rounded-full text-sm bg-background-surface border border-border-light dark:border-border-dark text-caramel hover:text-cookie-400 hover:border-cookie-500/40 transition-colors flex items-center gap-1.5"
                              >
                                <Clock className="w-3 h-3" />
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Popular */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Flame className="w-4 h-4 text-cookie-400" />
                          <span className="text-xs font-medium text-caramel uppercase tracking-wider">Más populares</span>
                        </div>
                        <div className="space-y-1">
                          {featuredProducts.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => handleProductClick(product)}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-background-surface transition-colors group text-left"
                            >
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-background-surface">
                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-vanilla truncate">{product.name}</p>
                                <p className="text-xs text-caramel">${product.price.toFixed(2)}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-caramel opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-border-light dark:border-border-dark flex items-center justify-between">
                <span className="text-xs text-caramel">
                  Presiona <kbd className="px-1.5 py-0.5 rounded bg-background-surface border border-border-light text-xs">ESC</kbd> para cerrar
                </span>
                <span className="text-xs text-caramel">{PRODUCTS.length} galletas disponibles 🍪</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}