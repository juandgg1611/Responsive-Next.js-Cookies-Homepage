"use client";

import { motion } from "framer-motion";
import { Star, Quote, Heart, Award, Sparkles } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "María González",
    role: "Food Blogger",
    image: "/images/testimonials/pfp1.jpg",
    rating: 5,
    content:
      "Las mejores galletas que he probado en mi vida. El sabor del chocolate es increíble y la textura perfecta. Cada bocado es una experiencia única que te transporta directamente a la cocina de la abuela.",
    date: "Hace 2 semanas",
  },
  {
    id: 2,
    name: "Ana Martínez",
    role: "Chef Repostera",
    image: "/images/testimonials/pfp2.jpg",
    rating: 5,
    content:
      "Como profesional, valoro enormemente la calidad de los ingredientes y la técnica. Vian Cookies no decepciona en ningún aspecto. Su atención al detalle y pasión se nota en cada galleta.",
    date: "Hace 1 mes",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    role: "Cliente Frecuente",
    image: "/images/testimonials/pfp3.jpg",
    rating: 5,
    content:
      "Desde que descubrí Vian Cookies, no he comprado galletas en otro sitio. Son simplemente insuperables. El servicio al cliente es excepcional y las entregas siempre llegan perfectas.",
    date: "Hace 3 días",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Fondo CLARO igual que Features */}
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
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cookie-400/10 to-chocolate-500/10 border border-cookie-400/30">
              <Heart className="w-4 h-4 text-cookie-400" />
              <span className="text-sm font-semibold text-cookie-400">
                Lo que dicen nuestros clientes
              </span>
            </div>
          </div>

          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-vanilla leading-tight">
            Historias que endulzan el{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-cookie">
                día
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
            Descubre las experiencias de quienes ya han probado la magia de
            nuestras galletas.
          </p>
        </motion.div>

        {/* ========== GRID DE TESTIMONIOS (SIN CARRUSEL) ========== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20 lg:mb-24">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="relative group"
            >
              {/* Card principal */}
              <div className="relative h-full bg-gradient-to-br from-background to-background-dark rounded-cookie-lg sm:rounded-cookie-xl p-6 sm:p-8 border border-border-dark shadow-cookie-lg hover:shadow-cookie-xl transition-all duration-300 hover:border-cookie-500/40">
                {/* Efecto de brillo al hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cookie-400/5 to-chocolate-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-cookie-lg sm:rounded-cookie-xl" />

                {/* Icono de comillas decorativo */}
                <div className="absolute top-6 right-6 opacity-5">
                  <Quote className="w-16 h-16 text-cookie-400" />
                </div>

                {/* Estrellas de calificación */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 + index * 0.05 }}
                        whileHover={{ scale: 1.2, rotate: 15 }}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            i < Math.floor(testimonial.rating)
                              ? "text-yellow-400 fill-current"
                              : testimonial.rating % 1 > 0 &&
                                  i === Math.floor(testimonial.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-border-light"
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-vanilla-dark ml-2">
                    {testimonial.rating.toFixed(1)}
                  </span>
                </div>

                {/* Contenido del testimonio */}
                <p className="text-base text-caramel mb-8 relative leading-relaxed">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-cookie-400/30" />
                  {testimonial.content}
                </p>

                {/* Información del cliente */}
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-border-light/30">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cookie-400 to-chocolate-500 flex items-center justify-center shadow-glow">
                        <span className="text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cookie-400 border-2 border-background" />
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold text-vanilla">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-caramel">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-caramel">{testimonial.date}</div>
                </div>

                {/* Indicador hover animado */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-cookie rounded-full group-hover:w-16 sm:group-hover:w-20 transition-all duration-300 shadow-glow" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ========== ESTADÍSTICAS DE RESEÑAS ========== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-16 sm:mb-20 lg:mb-24"
        >
          <div className="bg-gradient-to-br from-background-dark to-background rounded-cookie-lg sm:rounded-cookie-xl p-6 sm:p-8 md:p-12 border border-border-dark shadow-cookie-xl overflow-hidden hover:shadow-floating transition-all duration-300">
            {/* Título de estadísticas */}
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-vanilla mb-4">
                Nuestras{" "}
                <span className="text-transparent bg-clip-text bg-gradient-cookie">
                  Métricas
                </span>
              </h3>
              <p className="text-caramel max-w-2xl mx-auto">
                La calidad se mide en números. Estos son algunos de los
                resultados que nos llenan de orgullo.
              </p>
            </div>

            {/* Grid de estadísticas */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
              {[
                {
                  value: "4.9",
                  label: "Puntuación promedio",
                  icon: Star,
                  color: "from-cookie-400 to-cookie-600",
                },
                {
                  value: "1,200+",
                  label: "Reseñas verificadas",
                  icon: Quote,
                  color: "from-chocolate-500 to-chocolate-700",
                },
                {
                  value: "95%",
                  label: "Clientes recurrentes",
                  icon: Heart,
                  color: "from-caramel to-caramel-dark",
                },
                {
                  value: "24h",
                  label: "Tiempo respuesta",
                  icon: Award,
                  color: "from-honey to-honey-dark",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-cookie-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <div
                    className={`text-3xl sm:text-4xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-2`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-caramel">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Barra de calificaciones */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-vanilla mb-6">
                Distribución de calificaciones
              </h4>
              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div
                    key={rating}
                    className="flex items-center gap-3 sm:gap-4"
                  >
                    <div className="w-12 sm:w-16 text-sm text-caramel flex items-center gap-1">
                      <span>{rating}</span>
                      <Star className="w-3 h-3 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-4 bg-background-surface rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${rating * 20}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: rating * 0.1 }}
                        className={`h-full rounded-full ${
                          rating === 5
                            ? "bg-gradient-to-r from-cookie-400 to-cookie-600"
                            : rating === 4
                              ? "bg-gradient-to-r from-amber-200 to-amber-400"
                              : rating === 3
                                ? "bg-gradient-to-r from-chocolate-500 to-chocolate-700"
                                : rating === 2
                                  ? "bg-gradient-to-r from-honey to-honey-dark"
                                  : "bg-gradient-to-r from-butter to-butter-dark"
                        } shadow-glow`}
                      />
                    </div>
                    <div className="w-12 text-right text-sm font-semibold text-vanilla-dark">
                      {rating * 20}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========== CTA RESEÑAS ========== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-br from-background-dark to-background rounded-cookie-lg sm:rounded-cookie-xl p-8 sm:p-12 border border-border-dark shadow-cookie-xl hover:shadow-floating transition-all duration-300">
            {/* Elemento decorativo sutil */}
            <div className="absolute inset-0 rounded-cookie-lg sm:rounded-cookie-xl opacity-5">
              <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-gradient-cookie blur-2xl" />
              <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full bg-gradient-chocolate blur-2xl" />
            </div>

            <div className="relative z-10">
              <h4 className="text-2xl sm:text-3xl font-display font-bold text-vanilla mb-4">
                ¿Ya has probado nuestras galletas?
              </h4>
              <p className="text-lg text-caramel mb-8 max-w-2xl mx-auto">
                Comparte tu experiencia y ayuda a otros a descubrir la magia de
                nuestras galletas artesanales.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-lg bg-gradient-cookie text-white font-semibold shadow-cookie hover:shadow-cookie-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                  onClick={() => window.open("#review", "_blank")}
                >
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Escribir Reseña
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-lg bg-transparent border-2 border-cookie-400 text-cookie-400 font-semibold hover:bg-cookie-400/10 transition-all duration-300 flex items-center justify-center gap-2 group"
                  onClick={() => window.open("#testimonials", "_blank")}
                >
                  <Star className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Ver Más Testimonios
                </motion.button>
              </div>
            </div>

            {/* Borde decorativo */}
            <div className="absolute -inset-1 bg-gradient-cookie opacity-10 rounded-cookie-lg sm:rounded-cookie-xl blur-sm -z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
