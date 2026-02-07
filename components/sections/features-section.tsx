"use client";

import { motion } from "framer-motion";
import { Clock, Shield, Sparkles, Truck, Heart, Award } from "lucide-react";
import CookieBadge from "@/components/ui/cookie-badge";

const FEATURES = [
  {
    icon: Clock,
    title: "Horneado Diario",
    description:
      "Preparamos todas las galletas el mismo día para garantizar frescura máxima. Cada lote es horneado artesanalmente.",
    color: "from-cookie-400 to-cookie-600",
    delay: 0,
  },
  {
    icon: Shield,
    title: "Ingredientes Premium",
    description:
      "Solo utilizamos ingredientes 100% naturales de la más alta calidad. Sin conservantes ni aditivos artificiales.",
    color: "from-chocolate-500 to-chocolate-700",
    delay: 0.1,
  },
  {
    icon: Sparkles,
    title: "Recetas Exclusivas",
    description:
      "Fórmulas desarrolladas por nuestros maestros reposteros. Combinaciones únicas que no encontrarás en otro lugar.",
    color: "from-caramel to-caramel-dark",
    delay: 0.2,
  },
  {
    icon: Truck,
    title: "Entrega en 24h",
    description:
      "Recibe tus galletas recién horneadas al día siguiente. Empaquetadas con cuidado para mantener su frescura.",
    color: "from-honey to-honey-dark",
    delay: 0.3,
  },
  {
    icon: Heart,
    title: "Hecho con Amor",
    description:
      "Cada galleta es preparada con dedicación y pasión. Creemos que el amor es el ingrediente secreto.",
    color: "from-cookie-500 to-chocolate-500",
    delay: 0.4,
  },
  {
    icon: Award,
    title: "Calidad Certificada",
    description:
      "Certificados de calidad y seguridad alimentaria. Cumplimos con los más altos estándares del sector.",
    color: "from-butter to-butter-dark",
    delay: 0.5,
  },
];

const PROCESS_STEPS = [
  "Selección manual de ingredientes premium",
  "Mezcla tradicional sin máquinas industriales",
  "Horneado controlado temperatura por temperatura",
  "Enfriado natural para mantener textura perfecta",
  "Empaquetado artesanal con materiales ecológicos",
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Fondo CLARO con textura para contrastar con secciones oscuras */}
      <div className="absolute inset-0 bg-background-surface -z-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-background-light via-background-surface to-background-light -z-20" />
      <div className="absolute inset-0 texture-cookie opacity-[0.08] -z-10" />

      {/* Elementos decorativos de fondo */}
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
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-radial from-chocolate-500/10 to-transparent rounded-full blur-3xl -z-10"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== ENCABEZADO DE SECCIÓN ========== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="flex justify-center">
            <CookieBadge text="¿Por qué elegirnos?" />
          </div>

          <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-vanilla leading-tight">
            La esencia de lo{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-cookie">
                artesanal
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
            Cada detalle cuenta en nuestro proceso de elaboración. Descubre lo
            que nos hace diferentes.
          </p>
        </motion.div>

        {/* ========== GRID DE CARACTERÍSTICAS ========== */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-16 sm:mb-20 lg:mb-24">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: feature.delay, duration: 0.6 }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="relative group cursor-pointer"
            >
              {/* Card principal - MÁS OSCURA para destacar en fondo claro */}
              <div className="relative h-full bg-gradient-to-br from-background to-background-dark rounded-cookie-lg sm:rounded-cookie-xl p-6 sm:p-8 border border-border-dark shadow-cookie-lg hover:shadow-cookie-xl transition-all duration-300 hover:border-cookie-500/40">
                {/* Efecto de brillo al hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-cookie-lg sm:rounded-cookie-xl`}
                />

                {/* Borde animado en hover */}
                <div className="absolute inset-0 rounded-cookie-lg sm:rounded-cookie-xl overflow-hidden">
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-cookie-400/30 transition-all duration-300 rounded-cookie-lg sm:rounded-cookie-xl" />
                </div>

                <div className="relative z-10">
                  {/* Icono */}
                  <div className="relative mb-6">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-cookie-lg bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />

                      {/* Efecto de brillo en el icono */}
                      <div className="absolute inset-0 bg-white/20 rounded-cookie-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Contenido */}
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-vanilla group-hover:text-cookie-400 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-sm sm:text-base text-caramel group-hover:text-vanilla-dark transition-colors duration-300 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Indicador hover animado */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-cookie rounded-full group-hover:w-16 sm:group-hover:w-20 transition-all duration-300 shadow-glow" />
                </div>

                {/* Número de feature (decorativo) */}
                <div className="absolute top-4 right-4 text-3xl sm:text-4xl font-display font-bold text-vanilla/5 group-hover:text-vanilla/10 transition-colors duration-300 select-none">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ========== SECCIÓN DE PROCESO ARTESANAL ========== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-background-dark to-background rounded-cookie-lg sm:rounded-cookie-xl p-6 sm:p-8 md:p-12 lg:p-16 border border-border-dark shadow-cookie-xl overflow-hidden hover:shadow-floating transition-all duration-300">
            {/* Patrón decorativo de fondo */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-cookie blur-2xl" />
              <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-gradient-chocolate blur-2xl" />
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center">
              {/* ===== CONTENIDO TEXTUAL ===== */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-4 sm:mb-6 text-vanilla leading-tight">
                    Nuestro{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-cookie">
                      Proceso
                    </span>{" "}
                    Artesanal
                  </h3>

                  <p className="text-sm sm:text-base lg:text-lg text-caramel mb-6 sm:mb-8 leading-relaxed">
                    Desde la selección de ingredientes hasta el empaquetado
                    final, cada paso es realizado con atención al detalle y
                    respeto por la tradición repostera.
                  </p>
                </motion.div>

                {/* Lista de pasos del proceso */}
                <div className="space-y-3 sm:space-y-4">
                  {PROCESS_STEPS.map((step, index) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                      className="flex items-start sm:items-center gap-3 sm:gap-4 group"
                    >
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-cookie flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-sm sm:text-base text-vanilla-dark group-hover:text-vanilla transition-colors duration-300 leading-relaxed">
                        {step}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ===== VISUALIZACIÓN DECORATIVA ===== */}
              <div className="relative order-first lg:order-last">
                <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 rounded-cookie-lg overflow-hidden bg-gradient-to-br from-background-surface to-background border border-border-light shadow-cookie">
                  {/* Overlay de gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cookie-500/10 to-chocolate-600/10" />

                  {/* Elementos decorativos animados */}
                  <motion.div
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-cookie opacity-40 blur-sm"
                  />

                  <motion.div
                    animate={{
                      y: [0, 15, 0],
                      rotate: [0, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: 1,
                      ease: "easeInOut",
                    }}
                    className="absolute top-1/2 right-1/4 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-chocolate opacity-40 blur-sm"
                  />

                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-caramel opacity-30 blur-md"
                  />

                  {/* Icono central decorativo */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.5,
                      duration: 0.8,
                      type: "spring",
                      bounce: 0.4,
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-cookie-400 to-chocolate-500 flex items-center justify-center shadow-glow-lg">
                      <Award className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </div>
                  </motion.div>

                  {/* Patrón de puntos decorativo */}
                  <div className="absolute inset-0">
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, rgba(212, 165, 116, 0.1) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                  </div>
                </div>

                {/* Badge flotante */}
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.8,
                    type: "spring",
                    bounce: 0.6,
                  }}
                  className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-10"
                >
                  <CookieBadge text="100% Artesanal" variant="popular" />
                </motion.div>

                {/* Borde decorativo con brillo */}
                <div className="absolute -inset-1 bg-gradient-cookie opacity-20 rounded-cookie-lg blur-sm -z-10" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
