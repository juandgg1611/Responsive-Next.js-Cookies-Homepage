// app/auth/recover/page.tsx - DISEÑO HORIZONTAL CON ESTILO VIAN COOKIES
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Cookie,
  Mail,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Heart,
  Star,
  Shield,
  Clock,
  Award,
  Users,
  ChefHat,
  Truck,
  Leaf,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// Animaciones personalizadas
const floatingAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const pulseGlow = {
  scale: [1, 1.05, 1],
  opacity: [0.2, 0.3, 0.2],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const STATS = [
  { icon: Cookie, label: "50+ variedades", color: "text-cookie-400" },
  { icon: Users, label: "15K+ clientes", color: "text-chocolate-400" },
  { icon: Truck, label: "Envío 24h", color: "text-caramel" },
  { icon: Award, label: "Premium 2024", color: "text-cookie-400" },
];

const BENEFITS = [
  {
    icon: Shield,
    title: "Seguro",
    description: "Encriptación de datos",
    color: "from-cookie-400 to-cookie-600",
  },
  {
    icon: Clock,
    title: "Rápido",
    description: "Respuesta inmediata",
    color: "from-chocolate-500 to-chocolate-700",
  },
  {
    icon: Heart,
    title: "Confiable",
    description: "Soporte 24/7",
    color: "from-caramel to-caramel-dark",
  },
  {
    icon: Star,
    title: "Efectivo",
    description: "95% de éxito",
    color: "from-honey to-honey-dark",
  },
];

export default function RecoverPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular envío de correo
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      console.log("Recuperación enviada a:", email);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#2C1810] relative overflow-hidden">
      {/* ========== FONDO EXTRAVAGANTE ========== */}

      {/* Gradientes animados gigantes */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-radial from-cookie-400/20 via-chocolate-500/15 to-transparent rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, -180, -270, -360],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-radial from-chocolate-500/20 via-caramel/15 to-transparent rounded-full blur-3xl"
      />

      {/* Patrón de chocolate */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, #D4A574 2px, transparent 2px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Partículas flotantes */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
          }}
          animate={{
            y: [null, Math.random() * -100 + "%"],
            x: [null, (Math.random() - 0.5) * 50 + "%"],
            rotate: [0, 360],
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
          className="absolute w-1.5 h-1.5 bg-cookie-400/20 rounded-full blur-sm"
        />
      ))}

      {/* Elementos decorativos flotantes */}
      <motion.div
        animate={floatingAnimation}
        className="absolute top-20 left-20 text-cookie-400/10"
      >
        <Cookie className="w-20 h-20" />
      </motion.div>
      <motion.div
        animate={{ ...floatingAnimation, transition: { delay: 1 } }}
        className="absolute bottom-20 right-20 text-chocolate-500/10"
      >
        <Star className="w-24 h-24" />
      </motion.div>
      <motion.div
        animate={{ ...floatingAnimation, transition: { delay: 2 } }}
        className="absolute top-40 right-40 text-caramel/10"
      >
        <Heart className="w-16 h-16" />
      </motion.div>
      <motion.div
        animate={{ ...floatingAnimation, transition: { delay: 3 } }}
        className="absolute bottom-40 left-40 text-cookie-400/10"
      >
        <Sparkles className="w-16 h-16" />
      </motion.div>

      {/* ========== CONTENIDO PRINCIPAL ========== */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header con fecha y hora */}
        <header className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 rounded-full bg-gradient-cookie flex items-center justify-center shadow-glow"
              >
                <Cookie className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-cookie-500">
                  Vian Cookies
                </h1>
                <p className="text-xs text-caramel">Recuperar acceso</p>
              </div>
            </Link>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-caramel bg-[#3A2318]/50 px-4 py-2 rounded-full backdrop-blur-sm border border-[#4A2F20]">
                <Clock className="h-4 w-4 text-cookie-400" />
                <span>
                  {new Date().toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ========== GRID PRINCIPAL HORIZONTAL ========== */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* ========== COLUMNA IZQUIERDA - FORMULARIO (5 columnas) - PRIMERO EN RESPONSIVE ========== */}
          <div className="lg:col-span-5 order-first lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="relative"
            >
              {/* Efecto de borde animado */}
              <motion.div
                animate={pulseGlow}
                className="absolute -inset-1 bg-gradient-cookie rounded-3xl blur-xl opacity-20"
              />

              {/* Tarjeta de recuperación */}
              <div className="relative bg-gradient-to-br from-[#3A2318]/90 to-[#2C1810]/80 backdrop-blur-xl rounded-3xl p-8 border border-[#4A2F20]/50 shadow-2xl">
                {/* Header del formulario */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-vanilla flex items-center gap-2">
                      <Shield className="w-6 h-6 text-cookie-400" />
                      Recuperar acceso
                    </h3>
                    <p className="text-sm text-caramel mt-1">
                      Te enviaremos un enlace seguro
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-cookie/20 border border-cookie-500/30 flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-cookie-400" />
                  </div>
                </div>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-vanilla flex items-center gap-2">
                        <Mail className="w-4 h-4 text-cookie-400" />
                        Correo electrónico
                      </label>
                      <div className="relative group">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 pl-11 bg-[#4A2F20]/60 backdrop-blur-sm border-2 border-[#5D3A2B] rounded-xl text-vanilla placeholder-caramel/60 focus:outline-none focus:border-cookie-400 focus:ring-4 focus:ring-cookie-400/20 transition-all duration-300"
                          placeholder="tu@viancookies.com"
                          required
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-caramel/60 group-focus-within:text-cookie-400 transition-colors" />
                      </div>
                      <p className="text-xs text-caramel/60 mt-1">
                        Ingresa el email con el que te registraste
                      </p>
                    </div>

                    {/* Botón de enviar */}
                    <motion.button
                      type="submit"
                      disabled={isLoading || !email}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative w-full py-4 bg-gradient-cookie text-white font-semibold rounded-xl shadow-cookie hover:shadow-cookie-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
                    >
                      {/* Efecto de brillo */}
                      <motion.div
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      />

                      <span className="relative flex items-center justify-center gap-3">
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            Enviar enlace de recuperación
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                          </>
                        )}
                      </span>
                    </motion.button>

                    {/* Botón para volver al login */}
                    <div className="mt-6">
                      <Link href="/auth/login">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          className="w-full py-3 bg-[#4A2F20]/40 backdrop-blur-sm border-2 border-[#5D3A2B] text-caramel hover:text-cookie-400 rounded-xl font-semibold hover:border-cookie-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Volver al inicio de sesión
                        </motion.button>
                      </Link>
                    </div>
                  </form>
                ) : (
                  /* Mensaje de éxito */
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-display font-bold text-green-400 mb-2">
                        ¡Correo enviado!
                      </h4>
                      <p className="text-sm text-caramel mb-4">
                        Hemos enviado un enlace de recuperación a:
                      </p>
                      <p className="text-base font-semibold text-cookie-400 bg-[#4A2F20]/30 py-2 px-4 rounded-lg border border-cookie-500/30">
                        {email}
                      </p>
                      <p className="text-xs text-caramel/70 mt-4">
                        Revisa tu bandeja de entrada y sigue las instrucciones.
                        Si no lo encuentras, revisa tu carpeta de spam.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="w-full py-3 bg-[#4A2F20]/40 backdrop-blur-sm border-2 border-[#5D3A2B] text-caramel hover:text-cookie-400 rounded-xl font-semibold hover:border-cookie-500/50 transition-all duration-300"
                      >
                        Intentar con otro correo
                      </button>

                      <Link href="/auth/login">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 bg-gradient-to-r from-cookie-500/20 to-chocolate-600/20 border-2 border-cookie-500/30 text-cookie-400 hover:text-cookie-300 rounded-xl font-semibold hover:border-cookie-400 hover:bg-cookie-500/10 transition-all duration-300"
                        >
                          Volver al inicio de sesión
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* ========== COLUMNA DERECHA - CONTEXTO (7 columnas) - SEGUNDO EN RESPONSIVE ========== */}
          <div className="lg:col-span-7 order-last lg:order-2 space-y-8">
            {/* Tarjeta principal de ayuda */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[#3A2318]/80 to-[#2C1810]/60 backdrop-blur-xl rounded-3xl p-8 border border-[#4A2F20]/50 shadow-2xl hover:border-cookie-500/30 transition-all duration-500"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-cookie flex items-center justify-center shadow-glow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <motion.div
                    animate={pulseGlow}
                    className="absolute -inset-1 bg-cookie-400/20 rounded-2xl blur-lg -z-10"
                  />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-vanilla mb-2">
                    ¿Olvidaste tu contraseña?
                  </h2>
                  <p className="text-caramel text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cookie-400" />
                    <span>No te preocupes, te ayudamos</span>
                    <Sparkles className="w-5 h-5 text-cookie-400" />
                  </p>
                </div>
              </div>

              {/* Stats rápidas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {STATS.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-[#4A2F20]/40 backdrop-blur-sm rounded-xl p-4 border border-[#5D3A2B]/50 hover:border-cookie-500/50 transition-all duration-300 group"
                  >
                    <stat.icon
                      className={`w-6 h-6 ${stat.color} mb-2 group-hover:scale-110 transition-transform`}
                    />
                    <p className="text-sm font-medium text-vanilla">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Beneficios grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {BENEFITS.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gradient-to-br from-[#3A2318]/60 to-[#2C1810]/40 backdrop-blur-sm rounded-xl p-4 border border-[#4A2F20]/50 hover:border-cookie-500/50 transition-all duration-300"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-3 shadow-glow`}
                  >
                    <benefit.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-vanilla text-sm mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-caramel">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Proceso de recuperación */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-gradient-to-br from-[#3A2318]/60 to-[#2C1810]/40 backdrop-blur-xl rounded-2xl p-6 border border-[#4A2F20]/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cookie-400 to-chocolate-500 flex items-center justify-center shadow-glow">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-display font-semibold text-vanilla">
                  Proceso de{" "}
                  <span className="text-cookie-400">recuperación</span>
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cookie-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-cookie-400">1</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-vanilla">
                      Ingresa tu correo
                    </h4>
                    <p className="text-xs text-caramel">
                      Usa el email asociado a tu cuenta
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-chocolate-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-chocolate-400">
                      2
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-vanilla">
                      Revisa tu bandeja
                    </h4>
                    <p className="text-xs text-caramel">
                      Te enviaremos un enlace seguro
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-caramel/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-caramel">3</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-vanilla">
                      Crea una nueva contraseña
                    </h4>
                    <p className="text-xs text-caramel">
                      Accede de nuevo a tu cuenta
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#4A2F20]/50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cookie-400" />
                  <span className="text-xs text-caramel">
                    Proceso 100% seguro y encriptado
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ========== FOOTER CON GRADIENTE ========== */}
        <div className="mt-12 text-center relative">
          {/* Enlace para volver al inicio */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-caramel hover:text-cookie-400 transition-colors group"
          >
            <span className="w-8 h-px bg-[#4A2F20] group-hover:bg-cookie-400 transition-colors" />
            <span>Regresar a la tienda</span>
            <span className="w-8 h-px bg-[#4A2F20] group-hover:bg-cookie-400 transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
