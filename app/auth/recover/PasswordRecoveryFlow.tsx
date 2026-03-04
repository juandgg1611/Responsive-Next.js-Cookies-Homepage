// app/auth/recover/PasswordRecoveryFlow.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Key,
  Mail,
  Shield,
  CheckCircle2,
  Clock,
  Sparkles,
  Cookie,
  Lock,
  AlertCircle,
  Loader2,
  Heart,
  Star,
  Award,
  Users,
  ChefHat,
  Truck,
  ArrowRight,
} from "lucide-react";
import emailjs from "@emailjs/browser";

import { VerificationCodeInput } from "@/app/auth/recover/VerificationCodeInput";
import { NewPasswordForm } from "@/app/auth/recover/NewPasswordForm";
import { RecoverySuccess } from "@/app/auth/recover/RecoverySuccess";
import { updateUserPassword } from "@/app/auth/recover/actions";

// ── Animaciones ───────────────────────────────────────────────────────────────
const floatingAnimation = {
  y: [0, -15, 0],
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
};

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

interface PasswordRecoveryFlowProps {
  initialEmail?: string;
}

export const PasswordRecoveryFlow: React.FC<PasswordRecoveryFlowProps> = ({
  initialEmail = "",
}) => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  // Reloj
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Inicializar EmailJS
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      try {
        emailjs.init(publicKey);
      } catch (err) {
        console.warn("EmailJS init failed:", err);
      }
    }
  }, []);

  // ── Paso 1: enviar código por email ──────────────────────────────────────
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Por favor, ingresa un email válido.");
      }

      // Generar código de 6 dígitos
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSentCode(code);

      const now = new Date();
      const dateFormatted = now.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const timeFormatted = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

      if (!serviceID || !templateID) {
        throw new Error("EmailJS no está configurado correctamente.");
      }

      const templateParams = {
        to_name: email.split("@")[0],
        to_email: email,
        from_name: "Vian Cookies",
        reply_to: "hola@viancookies.com",
        code,
        link: `${window.location.origin}/auth/recover`,
        year: now.getFullYear().toString(),
        date: dateFormatted,
        time: timeFormatted,
      };

      try {
        await emailjs.send(serviceID, templateID, templateParams);
      } catch (emailError: any) {
        // Algunos entornos lanzan un error de extensión de navegador aunque
        // el email se envíe correctamente — lo ignoramos.
        if (
          !emailError?.message?.includes(
            "listener indicated an asynchronous response",
          )
        ) {
          throw new Error(
            "No pudimos enviar el código. Verifica tu correo e inténtalo de nuevo.",
          );
        }
      }

      setStep(2);
    } catch (err: any) {
      setError(err.message ?? "Ocurrió un error. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Paso 2: verificar código ──────────────────────────────────────────────
  const handleCodeComplete = (code: string) => {
    if (code === sentCode) {
      setTimeout(() => setStep(3), 500);
    } else {
      setError("Código incorrecto. Intenta nuevamente.");
    }
  };

  // ── Reenviar código ───────────────────────────────────────────────────────
  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSentCode(code);

      const now = new Date();
      const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

      if (serviceID && templateID) {
        await emailjs.send(serviceID, templateID, {
          to_name: email.split("@")[0],
          to_email: email,
          from_name: "Vian Cookies",
          reply_to: "hola@viancookies.com",
          code,
          link: `${window.location.origin}/auth/recover`,
          year: now.getFullYear().toString(),
          date: now.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          time: now.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        });
      }
    } catch (err) {
      setError("Error al reenviar el código. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Paso 3: actualizar contraseña con Supabase Admin ─────────────────────
  const handlePasswordSubmit = async (newPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await updateUserPassword(email, newPassword);

      if (!result.success) {
        throw new Error(result.error);
      }

      setStep(4);
    } catch (err: any) {
      setError(
        err.message ??
          "No se pudo actualizar la contraseña. Intenta nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToLogin = () => router.push("/auth/login");
  const handleSecuritySettings = () => router.push("/configuracion/seguridad");

  // ── Config por paso ───────────────────────────────────────────────────────
  const stepConfig = {
    1: {
      icon: <Key className="h-5 w-5" />,
      title: "Recuperar Acceso",
      description: "Ingresa tu correo para enviarte un código de verificación",
    },
    2: {
      icon: <Shield className="h-5 w-5" />,
      title: "Verificación de Seguridad",
      description: "Ingresa el código de 6 dígitos que enviamos a tu correo",
    },
    3: {
      icon: <Lock className="h-5 w-5" />,
      title: "Nueva Contraseña",
      description: "Crea una contraseña segura para proteger tu cuenta",
    },
    4: {
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: "¡Recuperación Exitosa!",
      description: "Tu contraseña ha sido actualizada exitosamente",
    },
  };

  const currentStep = stepConfig[step];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#2C1810] relative overflow-hidden">
      {/* Fondo decorativo */}
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
      <motion.div
        animate={{ ...floatingAnimation, transition: { delay: 3 } }}
        className="absolute bottom-40 left-40 text-cookie-400/10"
      >
        <Sparkles className="w-16 h-16" />
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
                <p className="text-xs text-caramel">Recuperar acceso</p>
              </div>
            </Link>
            <div className="flex items-center gap-2 text-caramel bg-[#3A2318]/50 px-4 py-2 rounded-full backdrop-blur-sm border border-[#4A2F20] w-fit">
              <Clock className="h-4 w-4 text-cookie-400" />
              <span className="text-sm">
                {time.toLocaleDateString("es-ES", {
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
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-vanilla flex items-center gap-2">
                      {currentStep.icon}
                      {currentStep.title}
                    </h3>
                    <p className="text-sm text-caramel mt-1">
                      {currentStep.description}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-cookie/20 border border-cookie-500/30 flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-cookie-400" />
                  </div>
                </div>

                {/* Barra de progreso (pasos 2-4) */}
                {step > 1 && (
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-caramel mb-2">
                      <span>Paso {step - 1} de 3</span>
                      <span>{Math.round(((step - 1) / 3) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-[#4A2F20]/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cookie-400 to-chocolate-500 transition-all duration-500"
                        style={{ width: `${((step - 1) / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

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

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Paso 1: Email */}
                    {step === 1 && (
                      <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                              autoFocus
                            />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-caramel/60 group-focus-within:text-cookie-400 transition-colors" />
                          </div>
                        </div>

                        <motion.button
                          type="submit"
                          disabled={isLoading || !email}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative w-full py-4 bg-gradient-cookie text-white font-semibold rounded-xl shadow-cookie hover:shadow-cookie-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
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
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Enviando código...
                              </>
                            ) : (
                              <>
                                Enviar código de verificación
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                              </>
                            )}
                          </span>
                        </motion.button>
                      </form>
                    )}

                    {/* Paso 2: Código */}
                    {step === 2 && (
                      <VerificationCodeInput
                        email={email}
                        onCodeComplete={handleCodeComplete}
                        onResendCode={handleResendCode}
                        expectedCode={sentCode}
                      />
                    )}

                    {/* Paso 3: Nueva contraseña */}
                    {step === 3 && (
                      <NewPasswordForm
                        onPasswordSubmit={handlePasswordSubmit}
                        onCancel={() => setStep(2)}
                      />
                    )}

                    {/* Paso 4: Éxito */}
                    {step === 4 && (
                      <RecoverySuccess
                        email={email}
                        onContinue={handleContinueToLogin}
                        onSecuritySettings={handleSecuritySettings}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Volver al login */}
                {step < 4 && (
                  <div className="mt-6 pt-4 border-t border-[#4A2F20]/50">
                    <Link
                      href="/auth/login"
                      className="text-cookie-400 hover:text-cookie-300 text-sm font-medium transition-colors flex items-center justify-center mx-auto group"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                      Volver al inicio de sesión
                    </Link>
                  </div>
                )}

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
              </div>
            </motion.div>
          </div>

          {/* ── Columna derecha: info ── */}
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cookie-400 to-chocolate-500 flex items-center justify-center shadow-glow">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-display font-semibold text-vanilla">
                  Proceso de{" "}
                  <span className="text-cookie-400">recuperación</span>
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    n: "1",
                    color: "cookie-400",
                    title: "Ingresa tu correo",
                    desc: "Usa el email asociado a tu cuenta",
                  },
                  {
                    n: "2",
                    color: "chocolate-400",
                    title: "Revisa tu bandeja",
                    desc: "Recibirás un código de 6 dígitos",
                  },
                  {
                    n: "3",
                    color: "caramel",
                    title: "Crea una nueva contraseña",
                    desc: "Accede de nuevo a tu cuenta",
                  },
                ].map((s) => (
                  <div key={s.n} className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full bg-${s.color}/20 flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <span className={`text-xs font-bold text-${s.color}`}>
                        {s.n}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-vanilla">
                        {s.title}
                      </h4>
                      <p className="text-xs text-caramel">{s.desc}</p>
                    </div>
                  </div>
                ))}
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
      </div>
    </div>
  );
};
