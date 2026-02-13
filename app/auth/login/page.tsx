// app/auth/login/page.tsx - DISEÑO HORIZONTAL SIN ACCESOS RÁPIDOS
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Cookie,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Heart,
  Star,
  Shield,
  Clock,
  Award,
  Users,
  ChefHat,
  Truck,
  Eye,
  EyeOff,
  Leaf,
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

const FEATURES = [
  {
    icon: Heart,
    title: "Artesanal",
    description: "Horneado diario con amor",
    color: "from-cookie-400 to-cookie-600",
  },
  {
    icon: Leaf,
    title: "Natural",
    description: "Ingredientes seleccionados",
    color: "from-chocolate-500 to-chocolate-700",
  },
  {
    icon: Star,
    title: "Premium",
    description: "Calidad superior",
    color: "from-caramel to-caramel-dark",
  },
  {
    icon: Shield,
    title: "Garantía",
    description: "Satisfacción asegurada",
    color: "from-honey to-honey-dark",
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "low" | "medium" | "high"
  >("low");

  // Evaluar seguridad de contraseña
  useEffect(() => {
    if (!password) {
      setPasswordStrength("low");
      return;
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;

    let score = 0;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    if (length >= 8) score++;
    if (length >= 12) score++;

    if (score >= 5) setPasswordStrength("high");
    else if (score >= 3) setPasswordStrength("medium");
    else setPasswordStrength("low");
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular autenticación
    setTimeout(() => {
      setIsLoading(false);
      console.log("Login:", { email, password, rememberMe });
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-0px)] bg-[#2C1810] relative overflow-hidden">
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
                <p className="text-xs text-caramel">Área de miembros</p>
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

              {/* Tarjeta de login */}
              <div className="relative bg-gradient-to-br from-[#3A2318]/90 to-[#2C1810]/80 backdrop-blur-xl rounded-3xl p-8 border border-[#4A2F20]/50 shadow-2xl">
                {/* Header del formulario */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-vanilla flex items-center gap-2">
                      <Lock className="w-6 h-6 text-cookie-400" />
                      Iniciar Sesión
                    </h3>
                    <p className="text-sm text-caramel mt-1">
                      Accede a tu cuenta de miembro
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-cookie/20 border border-cookie-500/30 flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-cookie-400" />
                  </div>
                </div>

                {/* Formulario */}
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
                  </div>

                  {/* Contraseña */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-vanilla flex items-center gap-2">
                        <Lock className="w-4 h-4 text-cookie-400" />
                        Contraseña
                      </label>

                      {/* Indicador de seguridad */}
                      {password && (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1.5 h-4 rounded-full transition-all duration-500 ${
                                  i <
                                  (passwordStrength === "high"
                                    ? 3
                                    : passwordStrength === "medium"
                                      ? 2
                                      : 1)
                                    ? passwordStrength === "high"
                                      ? "bg-green-500"
                                      : passwordStrength === "medium"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    : "bg-[#5D3A2B]"
                                }`}
                              />
                            ))}
                          </div>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full border ${
                              passwordStrength === "high"
                                ? "text-green-400 border-green-500/30 bg-green-500/10"
                                : passwordStrength === "medium"
                                  ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                                  : "text-red-400 border-red-500/30 bg-red-500/10"
                            }`}
                          >
                            {passwordStrength === "high"
                              ? "Alta"
                              : passwordStrength === "medium"
                                ? "Media"
                                : "Baja"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pl-11 pr-11 bg-[#4A2F20]/60 backdrop-blur-sm border-2 border-[#5D3A2B] rounded-xl text-vanilla placeholder-caramel/60 focus:outline-none focus:border-cookie-400 focus:ring-4 focus:ring-cookie-400/20 transition-all duration-300"
                        placeholder="••••••••"
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-caramel/60 group-focus-within:text-cookie-400 transition-colors" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-caramel/60 hover:text-cookie-400 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Opciones */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-[#5D3A2B] bg-[#4A2F20] text-cookie-400 focus:ring-cookie-400 focus:ring-offset-0 focus:ring-offset-[#2C1810] transition-colors"
                      />
                      <span className="text-sm text-caramel group-hover:text-cookie-400 transition-colors">
                        Recordarme
                      </span>
                    </label>

                    <Link
                      href="/auth/recover"
                      className="text-sm text-caramel hover:text-cookie-400 transition-colors relative group"
                    >
                      ¿Olvidaste tu contraseña?
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-cookie group-hover:w-full transition-all duration-300" />
                    </Link>
                  </div>

                  {/* Botón de login */}
                  <motion.button
                    type="submit"
                    disabled={isLoading || !email || !password}
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
                          Autenticando...
                        </>
                      ) : (
                        <>
                          Acceder a mi cuenta
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </span>
                  </motion.button>

                  {/* Separador */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#4A2F20]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gradient-to-br from-[#3A2318]/90 to-[#2C1810]/80 text-caramel">
                        ¿Primera vez en Vian Cookies?
                      </span>
                    </div>
                  </div>

                  {/* Botones de registro y recuperación */}
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/auth/register" className="flex-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="w-full py-3 bg-gradient-to-r from-cookie-500/20 to-chocolate-600/20 border-2 border-cookie-500/30 text-cookie-400 hover:text-cookie-300 rounded-xl font-semibold hover:border-cookie-400 hover:bg-cookie-500/10 transition-all duration-300 group"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Crear cuenta
                          <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        </span>
                      </motion.button>
                    </Link>

                    <Link href="/auth/recover" className="flex-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="w-full py-3 bg-[#4A2F20]/40 backdrop-blur-sm border-2 border-[#5D3A2B] text-caramel hover:text-cookie-400 rounded-xl font-semibold hover:border-cookie-500/50 transition-all duration-300"
                      >
                        Recuperar
                      </motion.button>
                    </Link>
                  </div>

                  {/* Enlace para volver al inicio */}
                  <div className="mt-6 text-center">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 text-sm text-caramel hover:text-cookie-400 transition-colors group"
                    >
                      <span className="w-8 h-px bg-[#4A2F20] group-hover:bg-cookie-400 transition-colors" />
                      <span>Regresar a la tienda</span>
                      <span className="w-8 h-px bg-[#4A2F20] group-hover:bg-cookie-400 transition-colors" />
                    </Link>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* ========== COLUMNA DERECHA - CONTEXTO (7 columnas) - SEGUNDO EN RESPONSIVE ========== */}
          <div className="lg:col-span-7 order-last lg:order-2 space-y-8">
            {/* Tarjeta principal de bienvenida */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[#3A2318]/80 to-[#2C1810]/60 backdrop-blur-xl rounded-3xl p-8 border border-[#4A2F20]/50 shadow-2xl hover:border-cookie-500/30 transition-all duration-500"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-cookie flex items-center justify-center shadow-glow-lg">
                    <ChefHat className="w-8 h-8 text-white" />
                  </div>
                  <motion.div
                    animate={pulseGlow}
                    className="absolute -inset-1 bg-cookie-400/20 rounded-2xl blur-lg -z-10"
                  />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-vanilla mb-2">
                    Bienvenido de vuelta
                  </h2>
                  <p className="text-caramel text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cookie-400" />
                    <span>Tu momento dulce comienza aquí</span>
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

            {/* Features grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gradient-to-br from-[#3A2318]/60 to-[#2C1810]/40 backdrop-blur-sm rounded-xl p-4 border border-[#4A2F20]/50 hover:border-cookie-500/50 transition-all duration-300"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 shadow-glow`}
                  >
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-vanilla text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-caramel">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Testimonios rápidos */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-gradient-to-br from-[#3A2318]/60 to-[#2C1810]/40 backdrop-blur-xl rounded-2xl p-6 border border-[#4A2F20]/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-cookie border-2 border-[#2C1810] flex items-center justify-center"
                    >
                      <Users className="w-4 h-4 text-white" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-cookie-400 text-cookie-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-caramel mt-1">
                    +15,000 clientes felices
                  </p>
                </div>
              </div>
              <p className="text-sm text-vanilla/90 italic">
                "Las mejores galletas artesanales que he probado. El sabor es
                incomparable."
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
