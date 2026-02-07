"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, Star, Heart, Eye, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PRODUCTS = [
  {
    id: "chocolate-deluxe",
    name: "New York Chocochip Deluxe",
    description:
      "Galletas con chispas de chocolate belga 70% cacao y nueces tostadas",
    price: 5.99,
    originalPrice: 9.99,
    image: "/images/products/slider1.png",
    category: "clásicas",
    rating: 4.9,
    reviews: 128,
    featured: true,
    badge: "más vendido",
  },
  {
    id: "red-velvet",
    name: "New York Lemon Pie",
    description:
      "Galletas de terciopelo rojo con crema de queso y chispas de chocolate blanco",
    price: 7.99,
    image: "/images/products/slider2.png",
    category: "premium",
    rating: 4.8,
    reviews: 96,
    featured: true,
    badge: "nuevo",
  },
  {
    id: "matcha-green",
    name: "New York Chococolor",
    description:
      "Galletas de matcha japonés premium con chips de chocolate blanco",
    price: 7.99,
    image: "/images/products/slider3.png",
    category: "especiales",
    rating: 4.7,
    reviews: 74,
    featured: true,
  },
  {
    id: "vanilla-dream",
    name: "New York Choconuez",
    description:
      "Galletas de vainilla de Madagascar con glaseado real y flor de sal",
    price: 9.99,
    originalPrice: 12.99,
    image: "/images/products/slider4.png",
    category: "clásicas",
    rating: 4.6,
    reviews: 89,
    featured: true,
  },
];

const CATEGORIES = [
  { id: "all", label: "Todas" },
  { id: "clásicas", label: "Clásicas" },
  { id: "premium", label: "Premium" },
  { id: "especiales", label: "Especiales" },
];

export default function ProductsSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredProducts =
    selectedCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === selectedCategory);

  const handleAddToCart = (product: (typeof PRODUCTS)[0]) => {
    toast.success("¡Añadido al carrito!", {
      description: `${product.name} se ha añadido a tu pedido`,
      icon: "🍪",
    });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  return (
    <section
      id="products"
      className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Fondo OSCURO con textura */}
      <div className="absolute inset-0 bg-background-dark -z-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-background/50 to-background-dark -z-20" />
      <div className="absolute inset-0 texture-cookie opacity-[0.03] -z-10" />

      {/* Elementos decorativos */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 w-64 h-64 bg-gradient-radial from-cookie-400/10 to-transparent rounded-full blur-3xl -z-10"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== ENCABEZADO ========== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cookie-400/10 to-chocolate-500/10 border border-cookie-400/30">
              <Star className="w-4 h-4 text-cookie-400" />
              <span className="text-sm font-semibold text-cookie-400">
                Nuestra Colección
              </span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-vanilla leading-tight">
            Galletas que{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-cookie">
                inspiran
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-cookie rounded-full shadow-glow"
              />
            </span>
          </h2>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-caramel max-w-2xl mx-auto leading-relaxed px-4">
            Descubre nuestras creaciones más exquisitas, horneadas con pasión y
            los mejores ingredientes.
          </p>
        </motion.div>

        {/* ========== FILTROS ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 sm:mb-16"
        >
          {CATEGORIES.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-gradient-cookie text-white shadow-cookie"
                  : "bg-background-surface text-caramel hover:bg-background-surface/80 border border-border-light"
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* ========== GRID DE PRODUCTOS ========== */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
              className="relative group"
            >
              {/* Card principal */}
              <div className="h-full bg-gradient-to-br from-background-dark to-background rounded-cookie-lg sm:rounded-cookie-xl border border-border-dark shadow-cookie-lg hover:shadow-cookie-xl transition-all duration-300 hover:border-cookie-500/40 overflow-hidden">
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.badge === "más vendido"
                          ? "bg-cookie-400 text-white"
                          : product.badge === "nuevo"
                            ? "bg-chocolate-500 text-white"
                            : "bg-emerald-500 text-white"
                      }`}
                    >
                      {product.badge}
                    </div>
                  </div>
                )}

                {/* Botón favorito */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-background-surface/80 backdrop-blur-sm flex items-center justify-center hover:bg-background-surface transition-colors"
                  aria-label={
                    favorites.includes(product.id)
                      ? "Quitar de favoritos"
                      : "Añadir a favoritos"
                  }
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      favorites.includes(product.id)
                        ? "text-red-500 fill-current"
                        : "text-caramel"
                    }`}
                  />
                </button>

                {/* Imagen */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cookie-900/30 to-chocolate-900/30" />
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Contenido */}
                <div className="p-5 sm:p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-border-light"
                        }`}
                      />
                    ))}
                    <span className="text-sm font-semibold text-vanilla-dark ml-2">
                      {product.rating}
                    </span>
                    <span className="text-xs text-caramel ml-1">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Nombre y descripción */}
                  <h3 className="text-lg sm:text-xl font-semibold text-vanilla mb-2 group-hover:text-cookie-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-caramel mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Precio y botón */}
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-2xl font-bold text-cookie-400">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="ml-2 text-sm text-caramel line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(product)}
                      className="px-4 py-2 rounded-lg bg-gradient-cookie text-white font-semibold text-sm shadow-cookie hover:shadow-cookie-lg transition-all duration-300 flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Añadir
                    </motion.button>
                  </div>
                </div>

                {/* Efecto hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-cookie-400/20 rounded-cookie-lg sm:rounded-cookie-xl transition-all duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ========== CTA FINAL ========== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-12 sm:mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 sm:px-10 sm:py-4 rounded-lg bg-gradient-chocolate text-white font-semibold shadow-cookie hover:shadow-cookie-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
            onClick={() => (window.location.href = "/products")}
          >
            Ver Todas las Variedades
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <p className="mt-4 text-sm text-caramel max-w-md mx-auto">
            Más de 50 variedades disponibles • Envío gratis en pedidos
            superiores a $50
          </p>
        </motion.div>
      </div>
    </section>
  );
}
