// src/components/auth/recovery/RecoverySuccess.tsx
import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Mail,
  Lock,
  Sparkles,
  PartyPopper,
  Bell,
  Smartphone,
  Key,
  Cookie,
  Heart,
  Star,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

interface RecoverySuccessProps {
  email: string;
  onContinue: () => void;
  onSecuritySettings?: () => void;
}

export const RecoverySuccess: React.FC<RecoverySuccessProps> = ({
  email,
  onContinue,
  onSecuritySettings,
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [securityActions] = useState([
    {
      id: 1,
      title: "Activar 2FA",
      icon: ShieldCheck,
      description:
        "Añade una capa extra de seguridad como glaseado a una galleta",
    },
  ]);

  // Confeti solo por 3 segundos
  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const formatEmail = (email: string) => {
    const [username, domain] = email.split("@");
    return `${username.charAt(0)}***@${domain}`;
  };

  return (
    <div className="space-y-8">
      {/* Confeti simplificado con colores de galleta */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5"
              style={{
                background:
                  i % 3 === 0
                    ? "#D4A574" // cookie
                    : i % 3 === 1
                      ? "#8B4513" // chocolate
                      : "#F5E9D9", // vanilla
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                borderRadius: "50%",
              }}
              initial={{ y: -100, opacity: 1, scale: 0 }}
              animate={{
                y: window.innerHeight,
                opacity: 0,
                scale: [0, 1, 0.5],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2 + Math.random(),
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Header de éxito - Con galleta gigante */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-block"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-br from-cookie-400/30 to-chocolate-500/20 border-2 border-cookie-400/30 shadow-cookie-xl shadow-cookie-400/20">
            <div className="relative">
              <CheckCircle2 className="h-16 w-16 text-cookie-400" />
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-4"
              >
                <Cookie className="h-6 w-6 text-cookie-400" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-display font-bold text-vanilla">
            ¡Contraseña Restablecida!
          </h1>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-cookie-400/20 to-chocolate-500/10 border border-cookie-400/20"
        >
          <Sparkles className="h-3 w-3 text-cookie-400" />
          <span className="text-xs text-cookie-400 font-medium">
            ¡Listo para más galletas!
          </span>
        </motion.div>
      </div>

      {/* Información clave - Con estilo de receta */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-6"
      >
        {/* Confirmación de envío */}
        <div className="bg-gradient-to-br from-background-surface/50 to-background-dark/30 backdrop-blur-sm border border-cookie-500/20 rounded-xl p-5 shadow-cookie-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-cookie-400/20">
              <Mail className="h-5 w-5 text-cookie-400" />
            </div>
            <div>
              <h3 className="font-semibold text-vanilla">
                Confirmación Enviada
              </h3>
              <p className="text-sm text-caramel">
                Hemos enviado una notificación a:
              </p>
            </div>
          </div>
          <div className="text-sm text-vanilla bg-background-surface/50 rounded-lg p-3 text-center border border-cookie-500/20">
            {formatEmail(email)}
          </div>
        </div>
      </motion.div>

      {/* Botones de acción */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="space-y-4"
      >
        <button
          onClick={onContinue}
          className="w-full py-3 px-6 bg-gradient-cookie hover:from-cookie-500 hover:to-chocolate-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-cookie-lg hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <PartyPopper className="h-5 w-5" />
          ¡A comer galletas! (Iniciar Sesión)
        </button>
      </motion.div>
    </div>
  );
};
