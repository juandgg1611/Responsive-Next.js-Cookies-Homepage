"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  User,
  Check,
  X,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Building,
  BookOpen,
  Zap,
  Gift,
  Gamepad2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ── Animaciones ──────────────────────────────────────────────────────────────
const floatingAnimation = {
  y: [0, -15, 0],
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
};
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className={className}
    viewBox="0 0 16 16"
  >
    <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
  </svg>
);

const pulseGlow = {
  scale: [1, 1.05, 1],
  opacity: [0.2, 0.3, 0.2],
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};

// ── Datos estáticos ───────────────────────────────────────────────────────────
const STATS = [
  { icon: Cookie, label: "50+ variedades", color: "text-cookie-400" },
  { icon: Users, label: "15K+ clientes", color: "text-chocolate-400" },
  { icon: Truck, label: "Envío 24h", color: "text-caramel" },
  { icon: Award, label: "Premium 2024", color: "text-cookie-400" },
];

const BENEFITS = [
  {
    icon: Star,
    title: "20% OFF primera compra",
    description: "Descuento exclusivo para nuevos miembros",
    color: "from-cookie-400 to-cookie-600",
  },
  {
    icon: Heart,
    title: "Acceso anticipado",
    description: "Prueba nuevas recetas antes que nadie",
    color: "from-chocolate-500 to-chocolate-700",
  },
  {
    icon: Gift,
    title: "Regalo de bienvenida",
    description: "Una galleta sorpresa en tu primer pedido",
    color: "from-caramel to-caramel-dark",
  },
  {
    icon: Zap,
    title: "Envío gratis",
    description: "Sin costo en pedidos mayores a $500",
    color: "from-honey to-honey-dark",
  },
];

// ── Componente ────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isDiscordLoading, setIsDiscordLoading] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // ── Fortaleza de contraseña ────────────────────────────────────────────────
  useEffect(() => {
    if (!password) {
      setPasswordScore(0);
      return;
    }
    let score = 0;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[a-z]/.test(password)) score += 20;
    if (/\d/.test(password)) score += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;
    if (password.length >= 8) score += 10;
    if (password.length >= 12) score += 10;
    setPasswordScore(Math.min(score, 100));
  }, [password]);

  const getPasswordStrength = () => {
    if (passwordScore >= 80)
      return {
        label: "Fuerte",
        color: "text-green-400",
        bg: "bg-green-500/10",
        border: "border-green-500/30",
      };
    if (passwordScore >= 60)
      return {
        label: "Moderada",
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
      };
    if (passwordScore >= 40)
      return {
        label: "Débil",
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
      };
    return {
      label: "Muy débil",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
    };
  };

  const passwordStrength = getPasswordStrength();

  const passwordRequirements = [
    { met: password.length >= 8, text: "Mínimo 8 caracteres" },
    { met: /[A-Z]/.test(password), text: "Una mayúscula" },
    { met: /[a-z]/.test(password), text: "Una minúscula" },
    { met: /\d/.test(password), text: "Un número" },
    {
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      text: "Un carácter especial",
    },
  ];

  // ── Registro con email/password ───────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("No se pudo crear el usuario.");

      setSuccess(true);

      if (data.session) {
        router.push("/");
      }
    } catch (err: any) {
      const msg: Record<string, string> = {
        "User already registered":
          "Este correo ya está registrado. ¿Quieres iniciar sesión?",
        "Password should be at least 6 characters":
          "La contraseña debe tener al menos 6 caracteres.",
        "Unable to validate email address: invalid format":
          "El formato del correo no es válido.",
      };
      setError(
        msg[err.message] ??
          "Ocurrió un error al registrarte. Inténtalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Registro / login con Google ───────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError("No se pudo conectar con Google. Inténtalo de nuevo.");
      setIsGoogleLoading(false);
    }
  };

  // ── Registro / login con Discord ───────────────────────────────────────────
  const handleDiscordSignIn = async () => {
    setError(null);
    setIsDiscordLoading(true);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError("No se pudo conectar con Discord. Inténtalo de nuevo.");
      setIsDiscordLoading(false);
    }
  };

  // ── Vista de éxito (confirmación de email pendiente) ──────────────────────
  if (success && !isLoading) {
    return (
      <div className="min-h-screen bg-[#2C1810] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#3A2318]/90 to-[#2C1810]/80 backdrop-blur-xl rounded-3xl p-10 border border-[#4A2F20]/50 shadow-2xl text-center max-w-md w-full"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-vanilla mb-3">
            ¡Cuenta creada!
          </h2>
          <p className="text-caramel mb-6">
            Revisa tu bandeja de entrada y confirma tu correo para activar tu
            cuenta.
          </p>
          <Link href="/auth/login">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-cookie text-white font-semibold rounded-xl shadow-cookie"
            >
              Ir a iniciar sesión
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── Vista principal ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#2C1810] relative overflow-hidden">
      {/* Fondo decorativo (igual que antes) */}
      <motion.div
        animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 180, 270, 360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-radial from-cookie-400/20 via-chocolate-500/15 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], rotate: [0, -90, -180, -270, -360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-radial from-chocolate-500/20 via-caramel/15 to-transparent rounded-full blur-3xl"
      />
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, #D4A574 2px, transparent 2px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
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

      {/* Contenido */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
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
                <p className="text-xs text-caramel">Registro de miembros</p>
              </div>
            </Link>
            <div className="flex items-center gap-2 text-caramel bg-[#3A2318]/50 px-4 py-2 rounded-full backdrop-blur-sm border border-[#4A2F20] w-fit">
              <Clock className="h-4 w-4 text-cookie-400" />
              <span className="text-sm">
                {new Date().toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Grid principal */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* ── Columna izquierda: formulario ── */}
          <div className="lg:col-span-5 order-first lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="relative"
            >
              <motion.div
                animate={pulseGlow}
                className="absolute -inset-1 bg-gradient-cookie rounded-3xl blur-xl opacity-20"
              />

              <div className="relative bg-gradient-to-br from-[#3A2318]/90 to-[#2C1810]/80 backdrop-blur-xl rounded-3xl p-8 border border-[#4A2F20]/50 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-vanilla flex items-center gap-2">
                      <User className="w-6 h-6 text-cookie-400" />
                      Crear cuenta
                    </h3>
                    <p className="text-sm text-caramel mt-1">
                      Completa tus datos para registrarte
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-cookie/20 border border-cookie-500/30 flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-cookie-400" />
                  </div>
                </div>

                {/* Error global */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 mb-4"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* ── Formulario ── */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Nombre completo */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-vanilla flex items-center gap-2">
                      <User className="w-4 h-4 text-cookie-400" />
                      Nombre completo
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 pl-11 bg-[#4A2F20]/60 backdrop-blur-sm border-2 border-[#5D3A2B] rounded-xl text-vanilla placeholder-caramel/60 focus:outline-none focus:border-cookie-400 focus:ring-4 focus:ring-cookie-400/20 transition-all duration-300"
                        placeholder="María González"
                        required
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-caramel/60 group-focus-within:text-cookie-400 transition-colors" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
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
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-caramel/60 group-focus-within:text-cookie-400 transition-colors" />
                    </div>
                  </div>

                  {/* Contraseña */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-vanilla flex items-center gap-2">
                        <Lock className="w-4 h-4 text-cookie-400" />
                        Contraseña
                      </label>
                      {password && (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 h-4 rounded-full transition-all duration-500 ${
                                  passwordScore >= (i + 1) * 20
                                    ? passwordScore >= 80
                                      ? "bg-green-500"
                                      : passwordScore >= 60
                                        ? "bg-yellow-500"
                                        : passwordScore >= 40
                                          ? "bg-orange-500"
                                          : "bg-red-500"
                                    : "bg-[#5D3A2B]"
                                }`}
                              />
                            ))}
                          </div>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full border ${passwordStrength.border} ${passwordStrength.bg} ${passwordStrength.color}`}
                          >
                            {passwordStrength.label}
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
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-caramel/60 group-focus-within:text-cookie-400 transition-colors" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-caramel/60 hover:text-cookie-400 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-2 space-y-1.5 p-3 bg-[#4A2F20]/30 rounded-lg border border-[#5D3A2B]/50">
                        {passwordRequirements.map((req, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs"
                          >
                            {req.met ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-caramel/60" />
                            )}
                            <span
                              className={
                                req.met ? "text-green-400" : "text-caramel/80"
                              }
                            >
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirmar contraseña */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-vanilla flex items-center gap-2">
                      <Lock className="w-4 h-4 text-cookie-400" />
                      Confirmar contraseña
                    </label>
                    <div className="relative group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 pl-11 pr-11 bg-[#4A2F20]/60 backdrop-blur-sm border-2 border-[#5D3A2B] rounded-xl text-vanilla placeholder-caramel/60 focus:outline-none focus:border-cookie-400 focus:ring-4 focus:ring-cookie-400/20 transition-all duration-300"
                        placeholder="••••••••"
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-caramel/60 group-focus-within:text-cookie-400 transition-colors" />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-caramel/60 hover:text-cookie-400 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <div className="flex items-center gap-2 text-xs text-red-400 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Las contraseñas no coinciden</span>
                      </div>
                    )}
                  </div>

                  {/* Términos */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-[#5D3A2B] bg-[#4A2F20] text-cookie-400 focus:ring-cookie-400 focus:ring-offset-0 transition-colors"
                    />
                    <span className="text-sm text-caramel group-hover:text-cookie-400 transition-colors">
                      Acepto los términos y condiciones, y autorizo el uso de
                      mis datos para recibir ofertas y novedades.
                    </span>
                  </label>

                  {/* Botón submit */}
                  <motion.button
                    type="submit"
                    disabled={
                      isLoading ||
                      !fullName ||
                      !email ||
                      !password ||
                      !confirmPassword ||
                      password !== confirmPassword ||
                      !acceptTerms
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full py-4 bg-gradient-cookie text-white font-semibold rounded-xl shadow-cookie hover:shadow-cookie-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group mt-6"
                  >
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
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
                          Registrando...
                        </>
                      ) : (
                        <>
                          Crear mi cuenta
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </span>
                  </motion.button>

                  {/* ── NUEVA SECCIÓN: BOTONES SOCIALES (AHORA ABAJO) ── */}
                  <div className="mt-6">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#4A2F20]" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-gradient-to-br from-[#3A2318]/90 to-[#2C1810]/80 text-caramel">
                          o continúa con
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Botón Google */}
                      <motion.button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading || isDiscordLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border-2 border-[#5D3A2B] hover:border-cookie-500/50 rounded-xl text-vanilla font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGoogleLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              />
                              <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              />
                              <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                              />
                              <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              />
                            </svg>
                            <span>Google</span>
                          </>
                        )}
                      </motion.button>

                      {/* Botón Discord */}
                      <motion.button
                        type="button"
                        onClick={handleDiscordSignIn}
                        disabled={isGoogleLoading || isDiscordLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 py-3 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border-2 border-[#5D3A2B] hover:border-[#5865F2]/50 rounded-xl text-vanilla font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDiscordLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <DiscordIcon className="w-5 h-5 text-[#5865F2]" />
                            <span>Discord</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Separador / ir a login */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#4A2F20]" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gradient-to-br from-[#3A2318]/90 to-[#2C1810]/80 text-caramel">
                        ¿Ya tienes cuenta?
                      </span>
                    </div>
                  </div>

                  <Link href="/auth/login" className="block mt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      className="w-full py-3 bg-[#4A2F20]/40 backdrop-blur-sm border-2 border-[#5D3A2B] text-caramel hover:text-cookie-400 rounded-xl font-semibold hover:border-cookie-500/50 transition-all duration-300"
                    >
                      Iniciar sesión
                    </motion.button>
                  </Link>

                  <div className="mt-4 text-center">
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

          {/* ── Columna derecha: info/beneficios ── */}
          <div className="lg:col-span-7 order-last lg:order-2 space-y-8">
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
                    Únete a la familia
                  </h2>
                  <p className="text-caramel text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cookie-400" />
                    <span>y recibe 20% OFF en tu primera compra</span>
                    <Sparkles className="w-5 h-5 text-cookie-400" />
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
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

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {BENEFITS.map((b) => (
                <motion.div
                  key={b.title}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gradient-to-br from-[#3A2318]/60 to-[#2C1810]/40 backdrop-blur-sm rounded-xl p-4 border border-[#4A2F20]/50 hover:border-cookie-500/50 transition-all duration-300"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${b.color} flex items-center justify-center mb-3 shadow-glow`}
                  >
                    <b.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-vanilla text-sm mb-1">
                    {b.title}
                  </h3>
                  <p className="text-xs text-caramel">{b.description}</p>
                </motion.div>
              ))}
            </motion.div>

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
                "La mejor decisión fue unirme a Vian Cookies. ¡Calidad y sabor
                incomparables!"
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
