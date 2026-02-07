"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Check,
  Gift,
  Mail,
  BookOpen,
  Percent,
  ChefHat,
} from "lucide-react";
import Confetti from "react-confetti";

export default function CTASection() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generar código de cupón único
    const newCouponCode = `VIAN${Math.floor(1000 + Math.random() * 9000)}`;
    setCouponCode(newCouponCode);

    setIsSubmitting(false);
    setIsSubmitted(true);
    setShowConfetti(true);

    // Resetear confeti después de 5 segundos
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <section
      id="cta"
      className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden"
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

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
          >
            <Confetti
              width={typeof window !== "undefined" ? window.innerWidth : 0}
              height={typeof window !== "undefined" ? window.innerHeight : 0}
              recycle={false}
              numberOfPieces={200}
              colors={["#D4A574", "#8B4513", "#A67C52", "#F5E9D9", "#FFD8A6"]}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== SECCIÓN PRINCIPAL ========== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Card principal */}
          <div className="bg-gradient-to-br from-background-dark to-background rounded-cookie-xl p-8 sm:p-10 md:p-12 lg:p-16 border border-border-dark shadow-cookie-xl hover:shadow-floating transition-all duration-300 overflow-hidden">
            {/* Patrón decorativo sutil */}
            <div className="absolute inset-0 opacity-[0.02]">
              <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-gradient-cookie blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-chocolate blur-3xl" />
            </div>

            <div className="relative z-10">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex justify-center mb-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cookie-400/10 to-chocolate-500/10 border border-cookie-400/30">
                  <Sparkles className="w-4 h-4 text-cookie-400" />
                  <span className="text-sm font-semibold text-cookie-400">
                    Solo por tiempo limitado
                  </span>
                </div>
              </motion.div>

              {/* Título */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-vanilla leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-cookie">
                    15% de descuento
                  </span>
                  <br />
                  en tu primera compra
                </h2>

                <p className="mt-6 text-lg sm:text-xl text-caramel max-w-2xl mx-auto leading-relaxed">
                  Suscríbete a nuestro newsletter y recibe ofertas exclusivas,
                  nuevas recetas y tu cupón de bienvenida.
                </p>
              </motion.div>

              {/* Formulario */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-12"
              >
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto"
                  >
                    {/* Cupón */}
                    <div className="bg-gradient-to-br from-cookie-900/30 to-chocolate-900/20 rounded-cookie-lg p-8 border border-cookie-500/30 shadow-cookie mb-6">
                      <div className="text-center">
                        <div className="flex justify-center mb-6">
                          <div className="w-16 h-16 rounded-full bg-gradient-cookie flex items-center justify-center shadow-glow-lg">
                            <Gift className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        <h3 className="text-2xl font-display font-bold text-vanilla mb-2">
                          ¡Cupón generado!
                        </h3>

                        <div className="mt-6 mb-4">
                          <div className="text-3xl sm:text-4xl font-handwritten text-cookie-400 font-bold tracking-wider">
                            {couponCode}
                          </div>
                          <p className="text-sm text-caramel mt-2">
                            Válido por 7 días
                          </p>
                        </div>

                        <p className="text-caramel">
                          Usa este código al finalizar tu compra
                        </p>
                      </div>
                    </div>

                    {/* Mensaje de éxito */}
                    <div className="bg-gradient-to-br from-emerald-900/20 to-green-900/10 rounded-cookie-lg p-6 border border-emerald-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-vanilla">
                            ¡Suscripción exitosa!
                          </h4>
                          <p className="text-sm text-caramel mt-1">
                            Te hemos enviado un email de confirmación
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-caramel" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Tu email"
                            required
                            className="w-full pl-12 pr-4 py-4 bg-background-surface border border-border-light rounded-cookie-lg text-vanilla placeholder-caramel focus:outline-none focus:ring-2 focus:ring-cookie-400 focus:border-transparent transition-all duration-300"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-4 rounded-lg bg-gradient-cookie text-white font-semibold shadow-cookie hover:shadow-cookie-lg transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Procesando...
                          </>
                        ) : (
                          <>
                            Obtener Cupón
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </motion.button>
                    </div>

                    <p className="text-sm text-caramel mt-4 text-center">
                      Al suscribirte aceptas nuestra{" "}
                      <a
                        href="#"
                        className="text-cookie-400 hover:text-cookie-300 hover:underline transition-colors"
                      >
                        política de privacidad
                      </a>
                      . Sin spam, solo galletas.
                    </p>
                  </form>
                )}
              </motion.div>

              {/* Beneficio simple con ICONOS PROFESIONALES */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-12 pt-8 border-t border-border-light/20"
              >
                <div className="text-center">
                  <p className="text-caramel">
                    Además del 15% de descuento, recibirás:
                  </p>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {[
                      {
                        text: "Nuevas recetas cada mes",
                        icon: BookOpen,
                        color: "from-cookie-400 to-cookie-600",
                      },
                      {
                        text: "Ofertas exclusivas",
                        icon: Percent,
                        color: "from-chocolate-500 to-chocolate-700",
                      },
                      {
                        text: "Tips de repostería",
                        icon: ChefHat,
                        color: "from-caramel to-caramel-dark",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={item.text}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="group"
                      >
                        <div className="h-full bg-gradient-to-br from-background-surface to-background-dark rounded-cookie-lg p-6 border border-border-light/20 hover:border-cookie-500/40 hover:shadow-cookie transition-all duration-300">
                          {/* Icono con gradiente */}
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-transform duration-300 mx-auto`}
                          >
                            <item.icon className="w-6 h-6 text-white" />
                          </div>

                          {/* Texto */}
                          <span className="text-sm text-vanilla group-hover:text-cookie-400 transition-colors">
                            {item.text}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Borde decorativo */}
            <div className="absolute -inset-1 bg-gradient-cookie opacity-10 rounded-cookie-xl blur-sm -z-10" />
          </div>
        </motion.div>

        {/* ========== CTA FINAL ========== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 sm:mt-20 text-center"
        >
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-vanilla mb-6">
            ¿Listo para endulzar tu día?
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="#products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg bg-gradient-cookie text-white font-semibold shadow-cookie hover:shadow-cookie-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              Ver Colección
              <ArrowRight className="w-5 h-5" />
            </motion.a>

            <motion.a
              href="https://wa.me/34910123456?text=Hola,%20me%20interesan%20las%20galletas%20de%20Vian%20Cookies"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg bg-transparent border-2 border-cookie-500 text-cookie-400 font-semibold hover:bg-cookie-500/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Pedir por WhatsApp
            </motion.a>
          </div>

          <p className="text-sm text-caramel mt-6 max-w-md mx-auto">
            Respondemos en menos de 24 horas. Tu satisfacción está garantizada.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
