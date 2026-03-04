"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Award, Clock, Target, Heart, Star } from "lucide-react";
import CookieBadge from "@/components/ui/cookie-badge";

const TIMELINE = [
  {
    year: "2018",
    title: "Inicio Familiar",
    description: "Primeras recetas en la cocina de casa",
    icon: Heart,
  },
  {
    year: "2020",
    title: "Primera Pastelería",
    description: "Apertura de nuestro primer local en el barrio histórico",
    icon: Users,
  },
  {
    year: "2022",
    title: "Expansión Local",
    description: "Tres nuevas sucursales y equipo de 15 artesanos",
    icon: Target,
  },
  {
    year: "2023",
    title: "Reconocimiento Nacional",
    description: "Premio a la mejor repostería artesanal del año",
    icon: Award,
  },
  {
    year: "2024",
    title: "E-commerce",
    description: "Plataforma online con envíos a toda la nación",
    icon: Star,
  },
  {
    year: "2026",
    title: "Innovación Continua",
    description: "Más de 50 variedades y recetas exclusivas",
    icon: Clock,
  },
];

const STATS = [
  {
    value: "15K+",
    label: "Clientes Satisfechos",
    color: "from-cookie-400 to-cookie-600",
  },
  {
    value: "50+",
    label: "Variedades Únicas",
    color: "from-chocolate-500 to-chocolate-700",
  },
  {
    value: "14",
    label: "Años de Experiencia",
    color: "from-caramel to-caramel-dark",
  },
  {
    value: "98%",
    label: "Clientes Recomiendan",
    color: "from-honey to-honey-dark",
  },
];

const VALUES = [
  { icon: Heart, title: "Pasión", desc: "En cada galleta" },
  { icon: Award, title: "Calidad", desc: "Ingredientes premium" },
  { icon: Users, title: "Comunidad", desc: "Clientes primero" },
  { icon: Target, title: "Excelencia", desc: "Siempre mejorando" },
];

const TEAM = [
  {
    name: "Ana Martínez",
    role: "Maestra Repostera",
    image: "/images/team/chef1.jpg",
    description:
      "Especialista en pastelería francesa con 20 años de experiencia",
  },
  {
    name: "Carlos Rodríguez",
    role: "Chocolatier",
    image: "/images/team/chef2.jpg",
    description: "Certificado por la Academia del Chocolate de Bruselas",
  },
  {
    name: "María González",
    role: "Innovación Culinaria",
    image: "/images/team/chef3.jpg",
    description: "Creadora de nuestras recetas más innovadoras",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Fondo OSCURO */}
      <div className="absolute inset-0 bg-background -z-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-background to-background-dark -z-20" />
      <div className="absolute inset-0 texture-cookie opacity-[0.03] -z-10" />

      {/* Elementos decorativos de fondo */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-10 w-72 h-72 bg-gradient-radial from-cookie-400/10 to-transparent rounded-full blur-3xl -z-10"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-radial from-chocolate-500/10 to-transparent rounded-full blur-3xl -z-10"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== HEADER DE SECCIÓN ========== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="flex justify-center">
            <CookieBadge text="Nuestra Historia" />
          </div>

          <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-vanilla leading-tight">
            Una pasión que se{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-cookie">
                hornea
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

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-caramel max-w-3xl mx-auto leading-relaxed">
            Desde nuestro humilde comienzo en una pequeña cocina familiar hasta
            convertirnos en referencia de la repostería artesanal premium.
          </p>
        </motion.div>

        {/* ========== FILOSOFÍA + IMAGEN ========== */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center mb-16 sm:mb-20 lg:mb-24">
          {/* Contenido textual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-4 sm:mb-6 text-vanilla">
              Nuestra{" "}
              <span className="text-transparent bg-clip-text bg-gradient-cookie">
                Filosofía
              </span>
            </h3>

            <div className="space-y-4 sm:space-y-6">
              <p className="text-sm sm:text-base lg:text-lg text-caramel leading-relaxed">
                En Vian Cookies creemos que las mejores galletas nacen de la
                combinación perfecta entre tradición, ingredientes excepcionales
                y, sobre todo, mucho amor.
              </p>

              <p className="text-sm sm:text-base lg:text-lg text-caramel leading-relaxed">
                Cada mañana, nuestros maestros reposteros seleccionan
                personalmente los ingredientes, respetando siempre la
                estacionalidad y procedencia local cuando es posible.
              </p>

              <p className="text-sm sm:text-base lg:text-lg text-caramel leading-relaxed">
                Rechazamos los atajos industriales. Nuestras galletas se hornean
                en pequeños lotes, vigilando cada detalle del proceso para
                garantizar esa textura y sabor inigualables que nuestros
                clientes adoran.
              </p>
            </div>

            {/* Valores en grid */}
            <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {VALUES.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                  className="flex items-start gap-3 sm:gap-4 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-cookie-lg bg-gradient-cookie flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-vanilla group-hover:text-cookie-400 transition-colors">
                      {value.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-caramel">
                      {value.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Imagen con efectos decorativos */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative rounded-cookie-lg sm:rounded-cookie-xl overflow-hidden h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gradient-to-br from-background-light to-background-surface border border-border-light shadow-cookie-xl">
              {/* Placeholder de imagen - reemplazar con imagen real */}
              <div className="absolute inset-0 bg-gradient-to-br from-cookie-500/20 to-chocolate-600/20" />

              {/* Elementos decorativos animados */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/4 left-1/4 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-cookie opacity-30 blur-xl"
              />
              <motion.div
                animate={{
                  y: [0, 20, 0],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: 1,
                  ease: "easeInOut",
                }}
                className="absolute bottom-1/4 right-1/4 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-chocolate opacity-30 blur-xl"
              />

              {/* Icono central decorativo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-cookie-400 to-chocolate-500 flex items-center justify-center shadow-glow-lg"
                >
                  <Heart className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
                </motion.div>
              </div>
            </div>

            {/* Estadísticas flotantes */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-gradient-to-br from-background-light to-background-surface p-4 sm:p-6 rounded-cookie-lg border border-border-light shadow-cookie-lg"
            >
              <div className="text-2xl sm:text-3xl font-bold text-gradient-cookie">
                98%
              </div>
              <div className="text-xs sm:text-sm text-caramel font-medium">
                Clientes Satisfechos
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-gradient-to-br from-background-light to-background-surface p-4 sm:p-6 rounded-cookie-lg border border-border-light shadow-cookie-lg"
            >
              <div className="text-2xl sm:text-3xl font-bold text-gradient-cookie">
                15K+
              </div>
              <div className="text-xs sm:text-sm text-caramel font-medium">
                Galletas Horneadas
              </div>
            </motion.div>

            {/* Borde decorativo */}
            <div className="absolute -inset-1 bg-gradient-cookie opacity-20 rounded-cookie-lg sm:rounded-cookie-xl blur-sm -z-10" />
          </motion.div>
        </div>

        {/* ========== TIMELINE ========== */}
        <div className="mb-16 sm:mb-20 lg:mb-24">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-center mb-8 sm:mb-12 text-vanilla">
            Nuestro{" "}
            <span className="text-transparent bg-clip-text bg-gradient-cookie">
              Camino
            </span>
          </h3>

          <div className="relative max-w-5xl mx-auto">
            {/* Línea de tiempo central (solo visible en desktop) */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-cookie-400 via-chocolate-500 to-cookie-400 hidden lg:block" />

            <div className="space-y-8 sm:space-y-12">
              {TIMELINE.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className={`flex flex-col lg:flex-row items-center gap-4 ${
                    index % 2 === 0 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Punto en la línea de tiempo */}
                  <div className="relative z-10 flex-shrink-0 hidden lg:block">
                    <div className="w-6 h-6 rounded-full bg-gradient-cookie shadow-glow" />
                    <div className="absolute inset-0 rounded-full bg-cookie-400 animate-ping opacity-20" />
                  </div>

                  {/* Contenido de timeline */}
                  <div
                    className={`flex-1 w-full lg:w-auto ${index % 2 === 0 ? "lg:pr-8 lg:text-right" : "lg:pl-8"}`}
                  >
                    <div className="bg-gradient-to-br from-background-light to-background-surface p-4 sm:p-6 rounded-cookie-lg border border-border-light shadow-cookie hover:shadow-cookie-lg transition-all duration-300 group">
                      <div
                        className={`flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 ${index % 2 === 0 ? "lg:justify-end" : ""}`}
                      >
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-cookie-lg bg-gradient-to-br ${
                            index % 4 === 0
                              ? "from-cookie-400 to-cookie-600"
                              : index % 4 === 1
                                ? "from-chocolate-500 to-chocolate-700"
                                : index % 4 === 2
                                  ? "from-caramel to-caramel-dark"
                                  : "from-honey to-honey-dark"
                          } flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300`}
                        >
                          <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>

                        <div>
                          <div className="text-xl sm:text-2xl font-bold text-gradient-cookie">
                            {item.year}
                          </div>
                          <h4 className="text-sm sm:text-base font-semibold text-vanilla">
                            {item.title}
                          </h4>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm lg:text-base text-caramel leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ========== ESTADÍSTICAS ========== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-16 sm:mb-20 lg:mb-24">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center group"
            >
              <div
                className={`h-24 sm:h-28 md:h-32 rounded-cookie-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 sm:mb-4 md:mb-6 relative overflow-hidden shadow-cookie group-hover:shadow-cookie-lg transition-all duration-300`}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  {stat.value}
                </div>

                {/* Efecto de brillo animado */}
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </div>

              <div className="text-sm sm:text-base lg:text-lg font-semibold text-vanilla group-hover:text-cookie-400 transition-colors">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ========== EQUIPO ========== */}
        <div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-center mb-8 sm:mb-12 text-vanilla">
            Nuestro{" "}
            <span className="text-transparent bg-clip-text bg-gradient-cookie">
              Equipo
            </span>
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {TEAM.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-gradient-to-br from-background-light to-background-surface rounded-cookie-lg sm:rounded-cookie-xl overflow-hidden border border-border-light shadow-cookie-lg hover:shadow-cookie-xl transition-all duration-300 group"
              >
                {/* Avatar del equipo */}
                <div className="h-48 sm:h-56 md:h-64 bg-gradient-to-br from-cookie-500/20 to-chocolate-600/20 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-cookie flex items-center justify-center shadow-glow-lg"
                    >
                      <span className="text-3xl sm:text-4xl font-bold text-white">
                        {member.name.charAt(0)}
                      </span>
                    </motion.div>
                  </div>

                  {/* Overlay en hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-4 sm:p-6">
                  <h4 className="text-lg sm:text-xl font-semibold mb-2 text-vanilla group-hover:text-cookie-400 transition-colors">
                    {member.name}
                  </h4>
                  <div className="text-sm sm:text-base text-cookie-400 mb-3 font-medium">
                    {member.role}
                  </div>
                  <p className="text-xs sm:text-sm text-caramel leading-relaxed">
                    {member.description}
                  </p>

                  {/* Redes sociales (placeholder) */}
                  <div className="flex gap-3 mt-4">
                    {["instagram", "linkedin", "twitter"].map((social) => (
                      <motion.a
                        key={social}
                        href="#"
                        whileHover={{ y: -3, scale: 1.1 }}
                        className="w-8 h-8 rounded-full bg-background-surface border border-border-light flex items-center justify-center text-caramel hover:text-cookie-400 hover:border-cookie-400 transition-all duration-300"
                        aria-label={social}
                      >
                        <div className="w-4 h-4 rounded-full bg-current" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
