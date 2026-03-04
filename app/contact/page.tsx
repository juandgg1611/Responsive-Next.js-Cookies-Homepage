// src/components/pages/ContactoPage.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Headphones,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  Copy,
  Check,
  Star,
  Sparkles,
  Shield,
  Truck,
  Wifi,
  Zap,
  Calendar,
  Users,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ChevronRight,
  ThumbsUp,
  HelpCircle,
  Package,
  CreditCard,
  Home,
  ArrowRight,
  Gift,
  Award,
  Heart,
  Rocket,
  Compass,
  Navigation,
  Bell,
  Camera,
  Coffee,
  Sun,
  Moon,
  Cloud,
  Wind,
  Droplets,
  Flower2,
  Gem,
  Crown,
  Mountain,
  TreePine,
  Waves,
  Feather,
  Anchor,
  Ship,
  Plane,
  Car,
  Bike,
  Users2,
  Target,
  Eye,
  Lock,
  Unlock,
  Key,
  Wallet,
  PiggyBank,
  TrendingUp,
  BarChart,
  PieChart,
  Activity,
  HeartPulse,
  Brain,
  Cpu,
  Database,
  Cloud as CloudIcon,
  Server,
  Network,
  Wifi as WifiIcon,
  Bluetooth,
  Battery as BatteryIcon,
  Zap as ZapIcon,
  Cpu as CpuIcon,
} from "lucide-react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const ContactoPageContent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background-dark">
        <div className="container mx-auto px-4 py-12">
          <div className="h-12 w-48 bg-cookie-800/50 rounded-xl mx-auto mb-8 animate-pulse"></div>
          <div className="h-6 w-64 bg-cookie-800/50 rounded-xl mx-auto mb-12 animate-pulse"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-96 bg-cookie-800/50 rounded-2xl animate-pulse"></div>
            <div className="h-96 bg-cookie-800/50 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-dark">
      {/* Hero Section con Colores de Galleta */}
      <HeroSection />

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12">
        {/* Sección de Zonas de Entrega */}
        <DeliveryZonesSection />

        {/* Mapa y ubicación (Adaptado para tu taller) */}
        <div className="mt-16">
          <LocationSection />
        </div>

        {/* Horarios de atención */}
        <div className="mt-12">
          <ScheduleSection />
        </div>

        {/* Estadísticas de Atención */}
        <StatsSection />

        {/* Testimonios Rápidos */}
        <QuickTestimonialsSection />

        {/* Preguntas frecuentes rápidas */}
        <div className="mt-12">
          <QuickFAQSection />
        </div>

        {/* Redes sociales */}
        <div className="mt-12">
          <SocialSection />
        </div>
      </div>
    </div>
  );
};

// Hero Section con Colores de Galleta
const HeroSection = () => (
  <div className="relative bg-gradient-to-br from-cookie-950 via-background to-chocolate-950 py-20 md:py-28 overflow-hidden">
    {/* Elementos decorativos (chispas de chocolate) */}
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute -top-20 -right-20 w-96 h-96 border-8 border-cookie-500/20 rounded-full"
    />

    <motion.div
      animate={{
        scale: [1, 1.3, 1],
        rotate: [360, 180, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute -bottom-20 -left-20 w-80 h-80 border-8 border-chocolate-500/20 rounded-full"
    />

    {/* Partículas flotantes (chispas) */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: [0, Math.random() * 100 - 50, 0],
          x: [0, Math.random() * 100 - 50, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 15 + Math.random() * 10,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-cookie-400 to-chocolate-500"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
      />
    ))}

    <div className="container relative z-10 mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Badge className="mb-6 px-6 py-3 text-sm font-semibold bg-gradient-to-r from-cookie-600 to-chocolate-600 text-vanilla border-0 shadow-lg shadow-cookie-600/30">
          <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
          Horneado con Amor
        </Badge>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-vanilla mb-6">
          <span className="bg-gradient-to-r from-cookie-400 to-caramel bg-clip-text text-transparent">
            Endulza
          </span>
          <br />
          tu día con nosotros
        </h1>

        <p className="text-xl text-caramel max-w-2xl mx-auto mb-8">
          Estamos aquí para resolver tus dudas, tomar tu pedido o simplemente
          hablar de galletas. ¡Tu opinión es el ingrediente secreto!
        </p>

        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cookie-900/50 to-chocolate-900/50 border border-cookie-500/30 backdrop-blur-sm"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-cookie-400 to-chocolate-400 border-2 border-vanilla"
              />
            ))}
          </div>
          <span className="text-vanilla font-medium">
            +5,000 clientes satisfechos
          </span>
        </motion.div>
      </motion.div>
    </div>
  </div>
);

// Sección de Zonas de Entrega - TODOS LOS ICONOS EN COLORES COOKIE/CHOCOLATE
const DeliveryZonesSection = () => {
  const zones = [
    {
      name: "Norte",
      time: "20min",
      gradient: "from-cookie-400 to-chocolate-500",
      icon: <Compass />,
      bg: "bg-cookie-900/30",
    },
    {
      name: "Sur",
      time: "40min",
      gradient: "from-cookie-500 to-chocolate-600",
      icon: <Navigation />,
      bg: "bg-cookie-900/30",
    },
    {
      name: "Este",
      time: "25min",
      gradient: "from-cookie-400 to-chocolate-500",
      icon: <Sun />,
      bg: "bg-cookie-900/30",
    },
    {
      name: "Oeste",
      time: "25min",
      gradient: "from-cookie-500 to-chocolate-600",
      icon: <Moon />,
      bg: "bg-cookie-900/30",
    },
    {
      name: "Centro",
      time: "30min",
      gradient: "from-cookie-400 to-chocolate-500",
      icon: <Target />,
      bg: "bg-cookie-900/30",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-background-surface to-chocolate-950/50 border border-cookie-500/30"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-vanilla mb-2">
          Zonas de <span className="text-cookie-400">entrega</span>
        </h2>
        <p className="text-caramel">
          Llevamos nuestras galletas recién horneadas a toda la ciudad
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {zones.map((zone, index) => (
          <motion.div
            key={zone.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative group"
          >
            <Card
              className={cn(
                "relative border-2 border-cookie-500/30 bg-background-surface group-hover:border-cookie-400 transition-all duration-300",
                zone.bg,
              )}
            >
              <CardContent className="p-6 text-center">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className={cn(
                    "w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-r flex items-center justify-center text-white",
                    zone.gradient,
                  )}
                >
                  {zone.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-vanilla mb-2">
                  {zone.name}
                </h3>
                <Badge
                  className={cn(
                    "text-white border-0",
                    `bg-gradient-to-r ${zone.gradient}`,
                  )}
                >
                  {zone.time}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Componente Ubicación - ADAPTADO PARA TU TALLER DE GALLETAS
const LocationSection = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="space-y-6"
  ></motion.div>
);

// Componente Horarios - ICONOS EN COLORES COOKIE/CHOCOLATE
const ScheduleSection = () => {
  const schedule = [
    {
      day: "Lunes",
      hours: "9:00 AM - 7:00 PM",
      status: "Horneando",
      icon: <Sun />,
    },
    {
      day: "Martes",
      hours: "9:00 AM - 7:00 PM",
      status: "Horneando",
      icon: <Sun />,
    },
    {
      day: "Miércoles",
      hours: "9:00 AM - 7:00 PM",
      status: "Horneando",
      icon: <Sun />,
    },
    {
      day: "Jueves",
      hours: "9:00 AM - 7:00 PM",
      status: "Horneando",
      icon: <Sun />,
    },
    {
      day: "Viernes",
      hours: "9:00 AM - 7:00 PM",
      status: "Horneando",
      icon: <Sun />,
    },
    {
      day: "Sábado",
      hours: "9:00 AM - 2:00 PM",
      status: "Horneado matutino",
      icon: <Coffee />,
    },
    {
      day: "Domingo",
      hours: "Cerrado",
      status: "WhatsApp 24/7",
      icon: <Moon />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold text-vanilla mb-2">
          Horarios de <span className="text-cookie-400">horneado</span>
        </h2>
        <p className="text-caramel">
          WhatsApp siempre disponible para pedidos urgentes
        </p>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-7 gap-3">
        {schedule.map((item, index) => (
          <motion.div
            key={item.day}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={cn(
              "p-4 rounded-xl border-2 text-center transition-all bg-background-surface",
              item.day === "Domingo"
                ? "border-cookie-500 bg-cookie-900/30"
                : "border-cookie-700 hover:border-cookie-500 hover:shadow-cookie",
            )}
          >
            <motion.div
              animate={{
                rotate: item.day === "Domingo" ? [0, 360] : 0,
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-8 h-8 mx-auto mb-2 text-cookie-400"
            >
              {item.icon}
            </motion.div>
            <h3 className="font-semibold text-vanilla mb-2">{item.day}</h3>
            <p className="text-sm text-caramel mb-2">{item.hours}</p>
            <Badge
              variant={item.day === "Domingo" ? "outline" : "default"}
              className={cn(
                item.day === "Domingo"
                  ? "border-cookie-400 text-cookie-400 bg-transparent"
                  : "bg-cookie-500/20 text-cookie-400 border-cookie-500/30",
              )}
            >
              {item.status}
            </Badge>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Estadísticas de Atención - TODOS LOS ICONOS EN COLORES COOKIE/CHOCOLATE
const StatsSection = () => {
  const stats = [
    {
      value: "24/7",
      label: "WhatsApp",
      icon: <MessageCircle />,
      gradient: "from-cookie-400 to-chocolate-500",
      bg: "bg-cookie-900/30",
    },
    {
      value: "<1h",
      label: "Tiempo de respuesta",
      icon: <Clock />,
      gradient: "from-cookie-500 to-chocolate-600",
      bg: "bg-cookie-900/30",
    },
    {
      value: "5K+",
      label: "Clientes atendidos",
      icon: <Users />,
      gradient: "from-cookie-400 to-chocolate-500",
      bg: "bg-cookie-900/30",
    },
    {
      value: "100%",
      label: "Satisfacción",
      icon: <ThumbsUp />,
      gradient: "from-cookie-500 to-chocolate-600",
      bg: "bg-cookie-900/30",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="relative group"
        >
          <Card
            className={cn(
              "relative border-2 border-cookie-500/30 group-hover:border-cookie-400 transition-all duration-300",
              stat.bg,
            )}
          >
            <CardContent className="p-6 text-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
                className={cn(
                  "w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-r flex items-center justify-center text-white",
                  stat.gradient,
                )}
              >
                {stat.icon}
              </motion.div>
              <div className="text-2xl font-bold text-vanilla mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-caramel">{stat.label}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Testimonios Rápidos - CON ESTRELLAS EN COLOR COOKIE
const QuickTestimonialsSection = () => {
  const testimonials = [
    {
      name: "María G.",
      comment:
        "Las mejores galletas de la ciudad! El servicio es tan dulce como sus productos.",
      rating: 5,
      product: "Chocolate Chip",
    },
    {
      name: "Carlos R.",
      comment:
        "Rápidos en la entrega y las galletas llegaron calientitas. ¡Excelente!",
      rating: 5,
      product: "Red Velvet",
    },
    {
      name: "Ana L.",
      comment:
        "Personalizaron las galletas para mi evento y fueron un éxito total.",
      rating: 5,
      product: "Personalizadas",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-8 p-8 rounded-2xl bg-gradient-to-br from-background-surface to-chocolate-950/50 border border-cookie-500/30"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-vanilla mb-2">
          Opiniones con{" "}
          <span className="text-cookie-400">chispas de chocolate</span>
        </h2>
        <p className="text-caramel">Experiencias reales de nuestros clientes</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl bg-background-surface border border-cookie-500/30 shadow-cookie"
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                >
                  <Star className="h-4 w-4 fill-cookie-400 text-cookie-400" />
                </motion.div>
              ))}
            </div>
            <p className="text-caramel mb-4">
              &ldquo;{testimonial.comment}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-vanilla">
                {testimonial.name}
              </span>
              <Badge className="bg-gradient-to-r from-cookie-500/20 to-chocolate-600/20 text-cookie-400 border-cookie-500/30">
                {testimonial.product}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Componente Preguntas Frecuentes - TODOS LOS ICONOS EN COLORES COOKIE/CHOCOLATE
const QuickFAQSection = () => {
  const faqs = [
    {
      question: "¿Cómo puedo hacer un pedido?",
      answer:
        "Elige tus galletas favoritas, contáctanos por WhatsApp y coordinamos la entrega.",
      icon: <ShoppingBag />,
      gradient: "from-cookie-400 to-chocolate-500",
      bg: "bg-cookie-900/30",
    },
    {
      question: "¿Hacen envíos a domicilio?",
      answer: "Sí, entregamos en todas las zonas de la ciudad en 15-45min.",
      icon: <Truck />,
      gradient: "from-cookie-500 to-chocolate-600",
      bg: "bg-cookie-900/30",
    },
    {
      question: "¿Trabajan con ingredientes naturales?",
      answer:
        "100% ingredientes naturales, sin conservantes. Horneamos diario.",
      icon: <Shield />,
      gradient: "from-cookie-400 to-chocolate-500",
      bg: "bg-cookie-900/30",
    },
    {
      question: "¿Aceptan pagos electrónicos?",
      answer: "Sí, aceptamos transferencias, pago móvil y efectivo al recibir.",
      icon: <CreditCard />,
      gradient: "from-cookie-500 to-chocolate-600",
      bg: "bg-cookie-900/30",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold text-vanilla mb-2">
          Preguntas <span className="text-cookie-400">frecuentes</span>
        </h2>
        <p className="text-caramel">
          Las dudas más comunes sobre nuestras galletas
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className={cn(
              "p-6 rounded-xl bg-background-surface border border-cookie-500/30 hover:border-cookie-400 transition-all group",
              faq.bg,
            )}
          >
            <div className="flex gap-4">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
                className={cn(
                  "w-12 h-12 rounded-lg bg-gradient-to-r flex items-center justify-center text-white flex-shrink-0",
                  faq.gradient,
                )}
              >
                {faq.icon}
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-vanilla mb-2">
                  {faq.question}
                </h3>
                <p className="text-caramel">{faq.answer}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="link"
          className="text-cookie-400 hover:text-cookie-300"
          onClick={() => (window.location.href = "/faq")}
        >
          Ver todas las preguntas
          <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};

// Componente Redes Sociales - TODOS LOS ICONOS EN COLORES COOKIE/CHOCOLATE
const SocialSection = () => {
  const socials = [
    {
      name: "Instagram",
      icon: <Instagram className="h-6 w-6" />,
      followers: "2.5K",
      link: "https://instagram.com/tusgalletas",
      gradient: "from-cookie-400 to-chocolate-500",
      bg: "bg-cookie-900/30",
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-6 w-6" />,
      followers: "1.8K",
      link: "https://facebook.com/tusgalletas",
      gradient: "from-cookie-500 to-chocolate-600",
      bg: "bg-cookie-900/30",
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="h-6 w-6" />,
      followers: "24/7",
      link: "https://wa.me/584141234567",
      gradient: "from-cookie-400 to-chocolate-500",
      bg: "bg-cookie-900/30",
    },
    {
      name: "TikTok",
      icon: <Video className="h-6 w-6" />,
      followers: "Pronto",
      link: "#",
      gradient: "from-cookie-500 to-chocolate-600",
      bg: "bg-cookie-900/30",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold text-vanilla mb-2">
          Síguenos en <span className="text-cookie-400">redes</span>
        </h2>
        <p className="text-caramel">
          Enterate de nuevas recetas, promos y el aroma del día
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {socials.map((social, index) => (
          <motion.a
            key={social.name}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.05 }}
            className="relative group"
          >
            <Card
              className={cn(
                "relative border-2 border-cookie-500/30 group-hover:border-cookie-400 transition-all duration-300",
                social.bg,
              )}
            >
              <CardContent className="p-6 text-center">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className={cn(
                    "w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-r flex items-center justify-center text-white",
                    social.gradient,
                  )}
                >
                  {social.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-vanilla mb-1">
                  {social.name}
                </h3>
                <p className="text-sm text-caramel">
                  {social.followers} seguidores
                </p>
              </CardContent>
            </Card>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

// Componente auxiliar para el ícono de galleta (si no existe en lucide-react)
const CookieIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="8" cy="8" r="1" fill="currentColor" />
    <circle cx="16" cy="9" r="1" fill="currentColor" />
    <circle cx="9" cy="16" r="1" fill="currentColor" />
    <circle cx="15" cy="15" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

// Import Video icon from lucide-react if needed
import { Video } from "lucide-react";

export default ContactoPageContent;
