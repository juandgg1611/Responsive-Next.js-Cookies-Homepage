"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles, Star, Truck, Clock, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import CookieBadge from "@/components/ui/cookie-badge";

const HERO_IMAGES = [
  {
    src: "/images/products/slider1.png",
    alt: "Chocolate Chip Deluxe",
    title: "NewYork ChocoChips",
    description: "Con chispas de chocolate belga 70% cacao",
  },
  {
    src: "/images/products/slider2.png",
    alt: "Red Velvet Premium",
    title: "NewYork Pie de Limòn",
    description: "Limòn y chocolate blanco artesanal",
  },
  {
    src: "/images/products/slider3.png",
    alt: "Matcha Green Tea",
    title: "NewYork ChocoColor",
    description: "Chocolate negro con lluvia de colores",
  },
  {
    src: "/images/products/slider4.png",
    alt: "Vanilla Dream",
    title: "NewYork ChocoNuez",
    description: "Vainilla de Madagascar con nueces importadas",
  },
];

const STATS = [
  { value: "5K+", label: "Clientes Felices", icon: Star },
  { value: "50+", label: "Variedades", icon: Sparkles },
  { value: "24h", label: "Envío Express", icon: Truck },
];

const FEATURES_MINI = [
  { icon: Clock, text: "Horneado Diario" },
  { icon: Shield, text: "Ingredientes Premium" },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length,
    );
  };

  // Auto slide cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-24 md:-mt-32 pb-12 md:pb-20"
    >
      {/* Fondo OSCURO con textura */}
      <div className="absolute inset-0 bg-background-dark -z-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-background/50 to-background-dark -z-20" />
      <div className="absolute inset-0 texture-cookie opacity-[0.03] -z-10" />

      {/* Elementos decorativos de fondo */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 30, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-20 right-10 w-72 h-72 bg-gradient-radial from-cookie-400/10 to-transparent rounded-full blur-3xl -z-10"
      />
      <motion.div
        animate={{
          rotate: -360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 40, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-radial from-chocolate-500/10 to-transparent rounded-full blur-3xl -z-10"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* ========== CONTENIDO DE TEXTO ========== */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center lg:text-left"
          >
            {/* Badge superior */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="flex justify-center lg:justify-start"
            >
              <CookieBadge text="Artesanal & Premium" variant="new" />
            </motion.div>

            {/* Título principal */}
            <motion.h1
              className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight text-vanilla"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Galletas que{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-cookie">
                  derriten
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-cookie rounded-full shadow-glow"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>{" "}
              <span className="block mt-2">corazones</span>
            </motion.h1>

            {/* Descripción */}
            <motion.p
              className="mt-6 text-lg sm:text-xl text-caramel max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Cada galleta es una obra maestra horneada a mano con ingredientes
              naturales y mucho amor. Descubre el sabor de la auténtica
              repostería artesanal.
            </motion.p>

            {/* Features mini */}
            <motion.div
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {FEATURES_MINI.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cookie-500/20 to-chocolate-500/20 border border-cookie-500/30 flex items-center justify-center group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-cookie-400" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-vanilla-dark group-hover:text-cookie-400 transition-colors">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Botones de acción */}
            <motion.div
              className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-cookie text-white font-semibold text-base sm:text-lg shadow-cookie hover:shadow-cookie-lg transition-all duration-300"
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Ver Colección
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-transparent border-2 border-cookie-500 text-cookie-400 hover:bg-cookie-500/10 hover:border-cookie-400 font-semibold text-base sm:text-lg transition-all duration-300"
                onClick={() =>
                  document
                    .getElementById("cta")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Obtener Descuento
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {STATS.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  className="text-center group cursor-default"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-cookie-400 mr-1 sm:mr-2" />
                      <div className="text-2xl sm:text-3xl font-bold text-gradient-cookie">
                        {stat.value}
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-caramel font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ========== CARRUSEL DE IMÁGENES ========== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="relative order-first lg:order-last"
          >
            <div className="relative w-full max-w-2xl mx-auto">
              {/* Elemento decorativo giratorio */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 z-0 hidden sm:block"
              >
                <div className="w-full h-full rounded-full bg-gradient-radial from-cookie-400/20 via-chocolate-500/10 to-transparent blur-xl" />
              </motion.div>

              {/* Contenedor del carrusel */}
              <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-cookie-lg overflow-hidden bg-gradient-to-br from-background-light to-background-surface border border-border-light shadow-cookie-xl">
                {/* Slides */}
                {HERO_IMAGES.map((image, index) => (
                  <motion.div
                    key={image.src}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: index === currentSlide ? 1 : 0,
                      scale: index === currentSlide ? 1 : 0.9,
                      zIndex: index === currentSlide ? 10 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                        priority={index === 0}
                      />

                      {/* Overlay gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

                      {/* Info de la imagen */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{
                            y: index === currentSlide ? 0 : 20,
                            opacity: index === currentSlide ? 1 : 0,
                          }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <CookieBadge
                            text={
                              index === 0
                                ? "Más Vendido"
                                : index === 1
                                  ? "Nuevo"
                                  : "Premium"
                            }
                            variant={
                              index === 0
                                ? "popular"
                                : index === 1
                                  ? "new"
                                  : "default"
                            }
                          />
                          <h3 className="text-xl sm:text-2xl font-bold mt-4 text-vanilla">
                            {image.title}
                          </h3>
                          <p className="text-sm sm:text-base text-caramel mt-1">
                            {image.description}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Indicadores de slide */}
                <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 flex gap-2">
                  {HERO_IMAGES.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-cookie-400 w-8 shadow-glow"
                          : "bg-vanilla-dark/30 w-2 hover:bg-vanilla-dark/50"
                      }`}
                      aria-label={`Ir a slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Botones de navegación */}
                <button
                  onClick={prevSlide}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background-surface/80 backdrop-blur-sm border border-border-light flex items-center justify-center hover:bg-background-surface hover:border-cookie-500/50 hover:shadow-glow transition-all duration-300 group"
                  aria-label="Imagen anterior"
                >
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 rotate-180 text-vanilla-dark group-hover:text-cookie-400 transition-colors" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background-surface/80 backdrop-blur-sm border border-border-light flex items-center justify-center hover:bg-background-surface hover:border-cookie-500/50 hover:shadow-glow transition-all duration-300 group"
                  aria-label="Siguiente imagen"
                >
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-vanilla-dark group-hover:text-cookie-400 transition-colors" />
                </button>
              </div>

              {/* Efecto de brillo animado */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-radial from-cookie-400/10 via-transparent to-transparent rounded-cookie-lg blur-2xl -z-10"
              />

              {/* Borde decorativo */}
              <div className="absolute -inset-1 bg-gradient-cookie opacity-20 rounded-cookie-lg blur-sm -z-20" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
