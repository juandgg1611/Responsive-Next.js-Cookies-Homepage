// src/components/auth/recovery/NewPasswordForm.tsx
import React, { useState, useEffect } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Zap,
  AlertCircle,
  Cookie,
  Shield,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

interface NewPasswordFormProps {
  onPasswordSubmit: (password: string) => void;
  onCancel?: () => void;
}

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  matchesConfirm: boolean;
}

export const NewPasswordForm: React.FC<NewPasswordFormProps> = ({
  onPasswordSubmit,
  onCancel,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validation, setValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    matchesConfirm: false,
  });

  // Validar contraseña en tiempo real
  useEffect(() => {
    const newValidation: PasswordValidation = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      matchesConfirm: password === confirmPassword && password !== "",
    };

    setValidation(newValidation);
  }, [password, confirmPassword]);

  // Calcular fortaleza con nombres de galletas
  const calculateStrength = () => {
    const criteria = Object.values(validation);
    const passed = criteria.filter(Boolean).length;
    const total = criteria.length;
    const percentage = (passed / total) * 100;

    if (percentage >= 100)
      return {
        level: "Muy fuerte",
        color: "text-cookie-400",
        bg: "bg-cookie-400",
        emoji: "",
      };
    if (percentage >= 80)
      return {
        level: "Fuerte",
        color: "text-chocolate-400",
        bg: "bg-chocolate-400",
        emoji: "",
      };
    if (percentage >= 60)
      return {
        level: "Moderada",
        color: "text-caramel",
        bg: "bg-caramel",
        emoji: "",
      };
    if (percentage >= 40)
      return {
        level: "Débil",
        color: "text-orange-400",
        bg: "bg-orange-400",
        emoji: "",
      };
    return {
      level: "Muy débil",
      color: "text-red-400",
      bg: "bg-red-400",
      emoji: "",
    };
  };

  const strength = calculateStrength();
  const isFormValid = Object.values(validation).every(Boolean);

  // Generar sugerencia de contraseña segura
  const generateSuggestion = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let suggestion = "";

    // Asegurar que tenga al menos un carácter de cada tipo
    suggestion += "V"; // Mayúscula (V de Vian)
    suggestion += "c"; // Minúscula (c de cookies)
    suggestion += "7"; // Número
    suggestion += "!"; // Especial

    // Añadir caracteres aleatorios hasta llegar a 12
    for (let i = 4; i < 12; i++) {
      suggestion += chars[Math.floor(Math.random() * chars.length)];
    }

    // Mezclar
    suggestion = suggestion
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
    return suggestion;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onPasswordSubmit(password);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con estilo cookie */}
      <div className="space-y-2">
        <h3 className="text-xl font-display font-bold text-vanilla flex items-center gap-2">
          <Lock className="h-5 w-5 text-cookie-400" />
          Nueva Contraseña
        </h3>
        <p className="text-caramel">
          Crea una contraseña tan única como nuestras galletas
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo de contraseña */}
        <div className="space-y-3">
          <label className="block text-sm text-caramel">Nueva contraseña</label>
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu nueva contraseña"
              autoComplete="new-password"
              className="w-full px-4 py-3 pl-11 pr-11 bg-background-surface/30 backdrop-blur-sm border-2 border-cookie-500/30 rounded-xl text-vanilla placeholder:text-caramel/50 focus:outline-none focus:border-cookie-400 focus:ring-4 focus:ring-cookie-400/20 transition-all duration-300"
              autoFocus
            />
            <Lock className="absolute left-3 top-3 h-4 w-4 text-caramel/60 group-focus-within:text-cookie-400 transition-colors" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-caramel/60 hover:text-cookie-400 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Campo de confirmación */}
        <div className="space-y-3">
          <label className="block text-sm text-caramel">
            Confirmar contraseña
          </label>
          <div className="relative group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu nueva contraseña"
              autoComplete="new-password"
              className="w-full px-4 py-3 pl-11 pr-11 bg-background-surface/30 backdrop-blur-sm border-2 border-cookie-500/30 rounded-xl text-vanilla placeholder:text-caramel/50 focus:outline-none focus:border-cookie-400 focus:ring-4 focus:ring-cookie-400/20 transition-all duration-300"
            />
            <Lock className="absolute left-3 top-3 h-4 w-4 text-caramel/60 group-focus-within:text-cookie-400 transition-colors" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-caramel/60 hover:text-cookie-400 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Indicador de fortaleza - Estilo galleta */}
        <div className="bg-gradient-to-br from-background-surface/50 to-background-dark/30 backdrop-blur-sm border border-cookie-500/20 rounded-xl p-4 shadow-cookie-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-caramel">Seguridad:</span>
            <span
              className={`font-semibold ${strength.color} flex items-center gap-1`}
            >
              {strength.emoji} {strength.level}
            </span>
          </div>

          <div className="h-2 bg-background-surface/50 rounded-full overflow-hidden mb-4">
            <motion.div
              className={`h-full ${strength.bg}`}
              initial={{ width: 0 }}
              animate={{
                width: `${(Object.values(validation).filter(Boolean).length / 6) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Requisitos con iconos de galleta */}
          <div className="space-y-2">
            {[
              {
                key: "minLength" as keyof PasswordValidation,
                label: "Mínimo 8 caracteres ",
              },
              {
                key: "hasUppercase" as keyof PasswordValidation,
                label: "Una mayúscula (A-Z)",
              },
              {
                key: "hasLowercase" as keyof PasswordValidation,
                label: "Una minúscula (a-z)",
              },
              {
                key: "hasNumber" as keyof PasswordValidation,
                label: "Un número (0-9)",
              },
              {
                key: "hasSpecialChar" as keyof PasswordValidation,
                label: "Un carácter especial (!@#$...)",
              },
              {
                key: "matchesConfirm" as keyof PasswordValidation,
                label: "Las contraseñas coinciden - ¡Perfecto!",
              },
            ].map((req) => (
              <div key={req.key} className="flex items-center gap-2">
                {validation[req.key] ? (
                  <CheckCircle2 className="h-4 w-4 text-cookie-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-caramel/50" />
                )}
                <span
                  className={`text-sm ${validation[req.key] ? "text-cookie-400" : "text-caramel/70"}`}
                >
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sugerencia de contraseña */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-cookie-400/10 to-chocolate-500/5 border border-cookie-400/20 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cookie-400/20">
              <Zap className="h-4 w-4 text-cookie-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-caramel mb-2">
                {" "}
                <span className="font-medium text-vanilla">
                  Sugerencia del chef:
                </span>{" "}
                Usa una contraseña única, como nuestras recetas secretas
              </p>
              <button
                type="button"
                onClick={() => {
                  const suggestion = generateSuggestion();
                  setPassword(suggestion);
                  setConfirmPassword(suggestion);
                }}
                className="text-xs text-cookie-400 hover:text-cookie-300 font-medium flex items-center gap-1 transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                Generar contraseña segura
              </button>
            </div>
          </div>
        </motion.div>

        {/* Botones */}
        <div className="flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 bg-background-surface/30 backdrop-blur-sm border-2 border-cookie-500/30 text-caramel hover:text-cookie-400 rounded-xl font-medium transition-colors hover:border-cookie-400/50"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
              isFormValid && !isSubmitting
                ? "bg-gradient-cookie text-white hover:shadow-cookie-lg hover:scale-[1.02]"
                : "bg-background-surface/30 text-caramel/50 cursor-not-allowed border-2 border-cookie-500/20"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Horneando...
              </>
            ) : (
              "Restablecer Contraseña"
            )}
          </button>
        </div>
      </form>

      {/* Nota de seguridad con temática de galletas */}
      <div className="pt-4 border-t border-cookie-500/20">
        <div className="flex items-start gap-2 text-xs text-caramel/60">
          <Shield className="h-3 w-3 mt-0.5 flex-shrink-0 text-cookie-400" />
          <span>
            Tu contraseña se almacena con la misma seguridad con la que
            guardamos nuestra receta secreta de galletas con chispas de
            chocolate.
          </span>
        </div>
      </div>
    </div>
  );
};
