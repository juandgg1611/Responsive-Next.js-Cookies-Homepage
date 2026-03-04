"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Star,
  Heart,
  Search,
  Cookie,
  ArrowLeft,
  Sparkles,
  ChevronDown,
  X,
  Users,
  Truck,
  ArrowRight,
  Flame,
  Leaf,
  Zap,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Filter,
  ChevronLeft,
  ChevronRight,
  Package,
  Crown,
  Scale,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback, CSSProperties } from "react";
import { cn } from "@/lib/utils";

// ─── Productos ────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "triple-chocolate",
    name: "Triple Chocolate Overdose",
    description:
      "Para los choco-adictos: masa de cacao oscuro, chispas blancas, oscuras y con leche fundidas en un solo bocado eterno.",
    price: 9.49,
    originalPrice: 11.99,
    image: "/images/products/slider1.png",
    category: "premium",
    tag: "best seller",
    rating: 5.0,
    reviews: 312,
    calories: 290,
    weight: "100g",
    ingredients: ["Cacao 72%", "Choco Blanco", "Choco Oscuro"],
    isNew: false,
    isBestSeller: true,
    isVegan: false,
    isFeatured: true,
    texture: "crujiente",
    intensity: "intenso",
    pairings: ["Café", "Vino tinto"],
    accentClass: "from-cookie-600 to-chocolate-700",
  },
  {
    id: "chocolate-deluxe",
    name: "NY Chocochip Deluxe",
    description:
      "Chispas de chocolate belga 70% cacao con nueces tostadas sobre masa de mantequilla dorada.",
    price: 5.99,
    originalPrice: 9.99,
    image: "/images/products/slider2.png",
    category: "clásicas",
    tag: "más vendido",
    rating: 4.9,
    reviews: 128,
    calories: 220,
    weight: "80g",
    ingredients: ["Chocolate Belga", "Nueces", "Mantequilla"],
    isNew: false,
    isBestSeller: true,
    isVegan: false,
    isFeatured: false,
    texture: "crujiente",
    intensity: "medio",
    pairings: ["Leche", "Té"],
    accentClass: "from-cookie-500 to-chocolate-600",
  },
  {
    id: "caramel-sea-salt",
    name: "Caramel Sea Salt Bliss",
    description:
      "Caramelo artesanal, flor de sal y pepitas de chocolate oscuro. Una explosión salada-dulce inigualable.",
    price: 8.49,
    originalPrice: null,
    image: "/images/products/slider3.png",
    category: "premium",
    tag: "limitado",
    rating: 4.9,
    reviews: 112,
    calories: 210,
    weight: "80g",
    ingredients: ["Caramelo", "Sal Marina", "Choco Oscuro"],
    isNew: false,
    isBestSeller: true,
    isVegan: false,
    isFeatured: false,
    texture: "suave",
    intensity: "medio",
    pairings: ["Café", "Whisky"],
    accentClass: "from-cookie-400 to-cookie-700",
  },
  {
    id: "red-velvet",
    name: "NY Lemon Pie",
    description:
      "Galleta cítrica con crema de queso y chispas de chocolate blanco. Fresca, aterciopelada y perfecta.",
    price: 7.99,
    originalPrice: null,
    image: "/images/products/slider4.png",
    category: "premium",
    tag: "nuevo",
    rating: 4.8,
    reviews: 96,
    calories: 195,
    weight: "75g",
    ingredients: ["Limón", "Crema de Queso", "Vainilla"],
    isNew: true,
    isBestSeller: false,
    isVegan: false,
    isFeatured: false,
    texture: "suave",
    intensity: "suave",
    pairings: ["Té", "Champán"],
    accentClass: "from-cookie-500 to-chocolate-500",
  },
  {
    id: "oreo-crunch",
    name: "Oreo Crunch Supreme",
    description:
      "Galleta doble con crema de Oreo, trozos crujientes y chocolate cremoso. El favorito sin discusión.",
    price: 6.99,
    originalPrice: null,
    image: "/images/products/slider5.png",
    category: "clásicas",
    tag: "fan favorite",
    rating: 4.8,
    reviews: 203,
    calories: 260,
    weight: "95g",
    ingredients: ["Oreo", "Crema", "Choco Leche"],
    isNew: false,
    isBestSeller: true,
    isVegan: false,
    isFeatured: false,
    texture: "crujiente",
    intensity: "medio",
    pairings: ["Leche", "Café"],
    accentClass: "from-chocolate-600 to-chocolate-800",
  },
  {
    id: "matcha-green",
    name: "NY Chococolor",
    description:
      "Matcha japonés premium con chips de chocolate blanco. Un contraste que despierta todos los sentidos.",
    price: 7.99,
    originalPrice: null,
    image: "/images/products/slider6.png",
    category: "especiales",
    tag: null,
    rating: 4.7,
    reviews: 74,
    calories: 180,
    weight: "70g",
    ingredients: ["Matcha", "Choco Blanco", "Almendra"],
    isNew: false,
    isBestSeller: false,
    isVegan: true,
    isFeatured: false,
    texture: "suave",
    intensity: "suave",
    pairings: ["Té verde", "Leche de almendras"],
    accentClass: "from-cookie-600 to-cookie-900",
  },
  // ─── Nuevo producto para el carrusel ──────────────────────────────────────
  {
    id: "brown-butter-pecan",
    name: "Brown Butter Pecan",
    description:
      "Mantequilla dorada a fuego lento, nueces pecanas tostadas y una pizca de canela. Otoño en cada mordisco.",
    price: 8.99,
    originalPrice: 10.99,
    image: "/images/products/slider7.png",
    category: "premium",
    tag: "nuevo",
    rating: 4.9,
    reviews: 87,
    calories: 240,
    weight: "90g",
    ingredients: ["Mantequilla Dorada", "Pecan", "Canela"],
    isNew: true,
    isBestSeller: true, // ← entra al carrusel
    isVegan: false,
    isFeatured: false,
    texture: "crujiente",
    intensity: "medio",
    pairings: ["Café", "Sidra"],
    accentClass: "from-amber-700 to-cookie-800",
  },
  // ─── 10 nuevos productos para el grid ─────────────────────────────────────
  {
    id: "pistachio-rose",
    name: "Pistachio Rose Dream",
    description:
      "Pistachos iraníes molidos sobre masa de agua de rosas y chocolate blanco. Exótico y delicado.",
    price: 9.99,
    originalPrice: 12.49,
    image: "/images/products/slider8.png",
    category: "especiales",
    tag: "nuevo",
    rating: 4.8,
    reviews: 53,
    calories: 200,
    weight: "75g",
    ingredients: ["Pistacho", "Agua de Rosas", "Choco Blanco"],
    isNew: true,
    isBestSeller: false,
    isVegan: true,
    isFeatured: false,
    texture: "suave",
    intensity: "suave",
    pairings: ["Té de rosas", "Champán"],
    accentClass: "from-cookie-400 to-cookie-600",
  },
  {
    id: "funfetti-birthday",
    name: "Funfetti Birthday Blast",
    description:
      "Masa de vainilla con confeti de colores y crema de buttercream. Una fiesta en cada bocado.",
    price: 6.49,
    originalPrice: null,
    image: "/images/products/slider9.png",
    category: "clásicas",
    tag: "fan favorite",
    rating: 4.7,
    reviews: 166,
    calories: 215,
    weight: "85g",
    ingredients: ["Vainilla", "Confeti", "Buttercream"],
    isNew: false,
    isBestSeller: false,
    isVegan: false,
    isFeatured: false,
    texture: "suave",
    intensity: "suave",
    pairings: ["Leche", "Limonada"],
    accentClass: "from-cookie-500 to-chocolate-500",
  },
  {
    id: "peanut-butter-crunch",
    name: "Peanut Butter Crunch",
    description:
      "Mantequilla de maní tostado, trozos de cacahuete y chips de chocolate oscuro. Adictivo sin remedio.",
    price: 7.49,
    originalPrice: 8.99,
    image: "/images/products/slider10.jpg",
    category: "clásicas",
    tag: "más vendido",
    rating: 4.8,
    reviews: 241,
    calories: 280,
    weight: "95g",
    ingredients: ["Maní Tostado", "Choco Oscuro", "Miel"],
    isNew: false,
    isBestSeller: false,
    isVegan: false,
    isFeatured: false,
    texture: "crujiente",
    intensity: "medio",
    pairings: ["Leche", "Café"],
    accentClass: "from-cookie-600 to-chocolate-700",
  },
  {
    id: "salted-pretzel-caramel",
    name: "Salted Pretzel Caramel",
    description:
      "Trozos de pretzel salado sobre lecho de caramelo suave y masa de mantequilla. El equilibrio perfecto.",
    price: 8.99,
    originalPrice: null,
    image: "/images/products/slider11.png",
    category: "premium",
    tag: "limitado",
    rating: 4.9,
    reviews: 78,
    calories: 255,
    weight: "90g",
    ingredients: ["Pretzel", "Caramelo", "Flor de Sal"],
    isNew: false,
    isBestSeller: false,
    isVegan: false,
    isFeatured: false,
    texture: "crujiente",
    intensity: "medio",
    pairings: ["Cerveza Artesanal", "Whisky"],
    accentClass: "from-cookie-400 to-cookie-700",
  },
  {
    id: "cinnamon-roll-swirl",
    name: "Cinnamon Roll Swirl",
    description:
      "Remolinos de canela y azúcar morena con glaseado de queso crema. El cinnamon roll reinventado.",
    price: 7.99,
    originalPrice: 9.49,
    image: "/images/products/slider12.png",
    category: "especiales",
    tag: "nuevo",
    rating: 4.7,
    reviews: 61,
    calories: 230,
    weight: "85g",
    ingredients: ["Canela", "Azúcar Morena", "Crema de Queso"],
    isNew: true,
    isBestSeller: false,
    isVegan: false,
    isFeatured: false,
    texture: "suave",
    intensity: "suave",
    pairings: ["Té Chai", "Café con leche"],
    accentClass: "from-amber-600 to-cookie-700",
  },
  {
    id: "smores-supreme",
    name: "S'mores Supreme",
    description:
      "Graham cracker, malvavisco tostado y chocolate oscuro fundido. La hoguera en formato galleta.",
    price: 8.49,
    originalPrice: null,
    image: "/images/products/slider13.png",
    category: "especiales",
    tag: null,
    rating: 4.8,
    reviews: 134,
    calories: 270,
    weight: "92g",
    ingredients: ["Graham", "Malvavisco", "Choco Oscuro"],
    isNew: false,
    isBestSeller: false,
    isVegan: false,
    isFeatured: false,
    texture: "suave",
    intensity: "intenso",
    pairings: ["Chocolate Caliente", "Vino Tinto"],
    accentClass: "from-chocolate-600 to-cookie-800",
  },
  {
    id: "raspberry-white-choco",
    name: "Raspberry White Choco",
    description:
      "Frambuesas liofilizadas, chips de chocolate blanco belga y masa de almendra. Fresco y elegante.",
    price: 9.49,
    originalPrice: 11.49,
    image: "/images/products/slider14.png",
    category: "premium",
    tag: "nuevo",
    rating: 4.6,
    reviews: 45,
    calories: 185,
    weight: "70g",
    ingredients: ["Frambuesa", "Choco Blanco", "Almendra"],
    isNew: true,
    isBestSeller: false,
    isVegan: true,
    isFeatured: false,
    texture: "crujiente",
    intensity: "suave",
    pairings: ["Prosecco", "Té frutal"],
    accentClass: "from-cookie-400 to-chocolate-500",
  },
  {
    id: "espresso-dark-roast",
    name: "Espresso Dark Roast",
    description:
      "Doble shot de espresso, cacao al 85% y trozos de chocolate negro. Para los que necesitan energía real.",
    price: 8.99,
    originalPrice: 10.49,
    image: "/images/products/slider15.png",
    category: "premium",
    tag: "best seller",
    rating: 4.9,
    reviews: 189,
    calories: 195,
    weight: "75g",
    ingredients: ["Espresso", "Cacao 85%", "Sal Negra"],
    isNew: false,
    isBestSeller: false,
    isVegan: true,
    isFeatured: false,
    texture: "crujiente",
    intensity: "intenso",
    pairings: ["Espresso", "Brandy"],
    accentClass: "from-chocolate-700 to-chocolate-900",
  },
  {
    id: "coconut-lime-zest",
    name: "Coconut Lime Zest",
    description:
      "Coco tostado rallado, ralladura de lima y leche condensada. Una galleta tropical de primera.",
    price: 7.49,
    originalPrice: null,
    image: "/images/products/slider16.png",
    category: "especiales",
    tag: null,
    rating: 4.6,
    reviews: 58,
    calories: 170,
    weight: "70g",
    ingredients: ["Coco Tostado", "Lima", "Leche Condensada"],
    isNew: false,
    isBestSeller: false,
    isVegan: true,
    isFeatured: false,
    texture: "crujiente",
    intensity: "suave",
    pairings: ["Piña Colada", "Té de menta"],
    accentClass: "from-cookie-500 to-cookie-700",
  },
];

const CAROUSEL_ITEMS = PRODUCTS.filter(
  (p) => p.isBestSeller || p.isFeatured,
).slice(0, 6);

const CATEGORIES = [
  {
    id: "all",
    label: "Todas",
    icon: "✦",
    color: "from-cookie-500 to-chocolate-600",
  },
  {
    id: "clásicas",
    label: "Clásicas",
    icon: "🍪",
    color: "from-cookie-400 to-cookie-700",
  },
  {
    id: "premium",
    label: "Premium",
    icon: "⭐",
    color: "from-cookie-500 to-chocolate-700",
  },
  {
    id: "especiales",
    label: "Especiales",
    icon: "✿",
    color: "from-cookie-400 to-chocolate-500",
  },
];

const SORT_OPTIONS = [
  { id: "featured", label: "Destacados" },
  { id: "price-asc", label: "Menor precio" },
  { id: "price-desc", label: "Mayor precio" },
  { id: "rating", label: "Mejor valorados" },
  { id: "newest", label: "Más nuevos" },
];

const TAG_STYLES: Record<string, string> = {
  "best seller": "bg-amber-500 text-black",
  "más vendido": "bg-amber-500 text-black",
  nuevo: "bg-emerald-500 text-white",
  limitado: "bg-rose-600 text-white",
  "fan favorite": "bg-violet-600 text-white",
  vegano: "bg-green-600 text-white",
  otoño: "bg-orange-500 text-white",
  artesanal: "bg-amber-700 text-white",
};

// ─── Distancia circular más corta ────────────────────────────────────────────
function circularDiff(index: number, active: number, total: number): number {
  let diff = (((index - active) % total) + total) % total;
  if (diff > total / 2) diff -= total;
  return diff;
}

// ─── Partículas flotantes ─────────────────────────────────────────────────────
function Particles() {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; delay: number }[]
  >([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: i % 5 === 0 ? 4 : 2,
        delay: Math.random() * 6,
      })),
    );
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cookie-400/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -35, 0],
            opacity: [0.06, 0.22, 0.06],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: 8 + p.delay,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Carrusel 3D Compacto & Responsive ────────────────────────────────────────
// ─── Carrusel 3D Compacto & Responsive ────────────────────────────────────────
function Carousel3D({
  onAddToCart,
}: {
  onAddToCart: (p: (typeof PRODUCTS)[0]) => void;
}) {
  const total = CAROUSEL_ITEMS.length;
  const [active, setActive] = useState(0);
  const [prev2, setPrev2] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;
    const id = setInterval(() => goNext(), 5000);
    return () => clearInterval(id);
  }, [isAutoPlay, active]);

  const pauseAutoplay = (ms = 7000) => {
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), ms);
  };

  const goTo = (next: number, dir: 1 | -1) => {
    setPrev2(active);
    setDirection(dir);
    setActive(next);
    pauseAutoplay();
  };

  const goPrev = () => goTo((active - 1 + total) % total, -1);
  const goNext = () => goTo((active + 1) % total, 1);

  // Touch / drag
  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    pauseAutoplay();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging) setDragDelta(e.clientX - startX);
  };
  const onPointerUp = () => {
    if (Math.abs(dragDelta) > 50) dragDelta < 0 ? goNext() : goPrev();
    setIsDragging(false);
    setDragDelta(0);
  };

  // Responsive card dimensions
  const CARD_W = isMobile ? 280 : 460;
  const CARD_H = isMobile ? 420 : 620;
  const GAP = isMobile ? 240 : 480;
  const Z_SIDE = isMobile ? 180 : 320;
  const ROT_DEG = isMobile ? 38 : 42;

  type CardPos = "center" | "left1" | "right1" | "left2" | "right2" | "hidden";

  const getPos = (index: number): CardPos => {
    const diff = circularDiff(index, active, total);
    if (diff === 0) return "center";
    if (diff === -1) return "left1";
    if (diff === 1) return "right1";
    if (diff === -2) return "left2";
    if (diff === 2) return "right2";
    return "hidden";
  };

  const posStyles: Record<CardPos, React.CSSProperties> = {
    center: {
      opacity: 1,
      transform: `translateX(0) translateZ(0) rotateY(0deg) scale(1)`,
      zIndex: 10,
      pointerEvents: "auto",
      filter: "brightness(1)",
    },
    left1: {
      opacity: 0.82,
      transform: `translateX(${-GAP}px) translateZ(${-Z_SIDE}px) rotateY(${ROT_DEG}deg) scale(0.92)`,
      zIndex: 9,
      pointerEvents: "auto",
      filter: "brightness(0.7)",
    },
    right1: {
      opacity: 0.82,
      transform: `translateX(${GAP}px) translateZ(${-Z_SIDE}px) rotateY(${-ROT_DEG}deg) scale(0.92)`,
      zIndex: 9,
      pointerEvents: "auto",
      filter: "brightness(0.7)",
    },
    left2: {
      opacity: 0.22,
      transform: `translateX(${-GAP * 2}px) translateZ(${-Z_SIDE * 1.8}px) rotateY(${ROT_DEG * 0.55}deg) scale(0.82)`,
      zIndex: 8,
      pointerEvents: "none",
      filter: "brightness(0.4)",
    },
    right2: {
      opacity: 0.22,
      transform: `translateX(${GAP * 2}px) translateZ(${-Z_SIDE * 1.8}px) rotateY(${-ROT_DEG * 0.55}deg) scale(0.82)`,
      zIndex: 8,
      pointerEvents: "none",
      filter: "brightness(0.4)",
    },
    hidden: {
      opacity: 0,
      transform: `translateX(0) translateZ(${-Z_SIDE * 2.5}px) scale(0.7)`,
      zIndex: 7,
      pointerEvents: "none",
      filter: "brightness(0.2)",
    },
  };

  const handleAddToCart = (product: (typeof PRODUCTS)[0]) => {
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const current = CAROUSEL_ITEMS[active];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* ── Ambient background per card ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-[900px] h-[600px] rounded-full blur-[180px] opacity-[0.10]",
              `bg-gradient-to-r ${current.accentClass}`,
            )}
          />
        </motion.div>
      </AnimatePresence>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
        }}
      />

      {/* ── Heading ── */}
      <div className="relative z-10 text-center mb-12 md:mb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cookie-900/60 border border-cookie-500/30 backdrop-blur-sm mb-5"
        >
          <Sparkles className="w-3.5 h-3.5 text-cookie-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cookie-400">
            Colección Destacada
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-vanilla mb-3 leading-none"
        >
          Nuestras{" "}
          <span className="bg-gradient-to-r from-cookie-400 to-caramel bg-clip-text text-transparent">
            mejores
          </span>{" "}
          galletas
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mx-auto w-24 h-px bg-gradient-to-r from-transparent via-cookie-500 to-transparent"
        />
      </div>

      {/* ── Carousel stage ── */}
      <div
        className="relative mx-auto select-none touch-pan-y"
        style={{ width: "100%", height: CARD_H + 60, perspective: "1400px" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {CAROUSEL_ITEMS.map((product, i) => {
            const pos = getPos(i);
            const isActive = pos === "center";
            const isAdded = addedId === product.id;

            return (
              <div
                key={product.id}
                className="absolute"
                style={{
                  width: CARD_W,
                  transformStyle: "preserve-3d",
                  transition: isDragging
                    ? "none"
                    : "transform 0.65s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease, filter 0.5s ease",
                  ...posStyles[pos],
                }}
              >
                {/* ── Card ── */}
                <div
                  className="relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer"
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    boxShadow: isActive
                      ? `0 0 0 1px rgba(212,165,116,0.35), 0 40px 100px rgba(139,69,19,0.5)`
                      : `0 20px 50px rgba(0,0,0,0.6)`,
                  }}
                  onClick={() => {
                    if (!isDragging && !isActive) goTo(i, i > active ? 1 : -1);
                  }}
                >
                  {/* ── Imagen full-card ── */}
                  <motion.div
                    className="absolute inset-0"
                    animate={isActive ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                    transition={{
                      duration: 9,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width:768px) 280px, 460px"
                      style={{ filter: "brightness(1.2) contrast(1)" }}
                    />
                  </motion.div>

                  {/* Degradado inferior para contraste del texto */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060301] from-[15%] via-[#060301]/30 via-[45%] to-transparent z-10 pointer-events-none" />

                  {/* Degradado superior sutil */}
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#060301]/25 to-transparent z-10 pointer-events-none" />

                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cookie-400/40 to-transparent z-20" />

                  {/* Glow de acento sobre la imagen (solo en activa) */}
                  {isActive && (
                    <motion.div
                      animate={{ opacity: [0.08, 0.18, 0.08] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className={cn(
                        "absolute inset-0 z-10 pointer-events-none",
                        `bg-gradient-to-t ${product.accentClass} opacity-10`,
                      )}
                    />
                  )}

                  {/* Bottom info panel */}
                  <div
                    className="absolute inset-x-0 bottom-0 p-5 md:p-6 z-20"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(6,3,1,0.99) 0%, rgba(6,3,1,0.88) 50%, transparent 100%)",
                    }}
                  >
                    {/* Tag + rating */}
                    <div className="flex items-center justify-between mb-2.5">
                      {product.tag ? (
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                            TAG_STYLES[product.tag] ??
                              "bg-amber-500 text-black",
                          )}
                        >
                          {product.tag}
                        </span>
                      ) : (
                        <span />
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-cookie-400 text-cookie-400" />
                        <span className="text-xs font-bold text-cookie-400">
                          {product.rating}
                        </span>
                        <span className="text-[10px] text-caramel/40">
                          ({product.reviews})
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display text-base md:text-lg font-bold text-vanilla uppercase tracking-tight leading-tight mb-2">
                      {product.name}
                    </h3>

                    <AnimatePresence mode="wait">
                      {isActive ? (
                        <motion.div
                          key="active"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-xs text-caramel/65 leading-relaxed mb-3 line-clamp-2">
                            {product.description}
                          </p>

                          {/* Ingredients - hidden on very small screens */}
                          <div className="hidden sm:flex flex-wrap gap-1 mb-4">
                            {product.ingredients.slice(0, 3).map((ing) => (
                              <span
                                key={ing}
                                className="px-2 py-0.5 rounded-full text-[9px] text-cookie-400 bg-cookie-900/70 border border-cookie-700/40"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>

                          {/* Price + CTA */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="shrink-0">
                              <span className="font-display text-2xl md:text-3xl font-bold text-cookie-400">
                                ${product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-caramel/35 line-through ml-1.5">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.92 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              className={cn(
                                "relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl",
                                "font-black text-xs uppercase tracking-wide overflow-hidden transition-colors duration-300 shrink-0",
                                isAdded
                                  ? "bg-emerald-600 text-white"
                                  : `bg-gradient-to-r ${product.accentClass} text-vanilla shadow-md`,
                              )}
                            >
                              <motion.div
                                animate={{ x: ["-120%", "220%"] }}
                                transition={{
                                  duration: 2.2,
                                  repeat: Infinity,
                                  repeatDelay: 4,
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                              />
                              <AnimatePresence mode="wait">
                                {isAdded ? (
                                  <motion.span
                                    key="ok"
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="relative flex items-center gap-1"
                                  >
                                    ✓ Añadido
                                  </motion.span>
                                ) : (
                                  <motion.span
                                    key="add"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="relative flex items-center gap-1.5"
                                  >
                                    <ShoppingCart className="w-3.5 h-3.5" />{" "}
                                    Añadir
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="inactive"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-between pt-1"
                        >
                          <span className="font-display text-xl font-bold text-cookie-400">
                            ${product.price}
                          </span>
                          <span className="text-[10px] text-caramel/35 uppercase tracking-widest">
                            Ver más
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Active border pulse */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none"
                      style={{
                        boxShadow: "inset 0 0 0 1px rgba(212,165,116,0.25)",
                      }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  )}

                  {/* Vegan badge */}
                  {product.isVegan && (
                    <div className="absolute top-4 right-4 z-30">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-700/90 text-white">
                        <Leaf className="w-2.5 h-2.5" /> Vegan
                      </span>
                    </div>
                  )}

                  {/* Number badge */}
                  <div className="absolute top-4 left-4 z-30">
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black",
                        isActive
                          ? `bg-gradient-to-br ${product.accentClass} text-vanilla`
                          : "bg-[#1a0d07]/80 text-cookie-700 border border-cookie-900",
                      )}
                    >
                      {i + 1}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Controls: dots + arrows inline ── */}
      <div className="relative z-10 flex items-center justify-center gap-5 mt-8 px-4">
        {/* Prev */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={goPrev}
          className="w-11 h-11 rounded-full bg-[#1a0d07] border border-cookie-800/60 hover:border-cookie-500 text-cookie-400 flex items-center justify-center transition-all shadow-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {CAROUSEL_ITEMS.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i, i > active ? 1 : -1)}
              animate={{
                width: i === active ? 32 : 8,
                opacity: i === active ? 1 : 0.3,
              }}
              transition={{ type: "spring", stiffness: 600, damping: 40 }}
              className={cn(
                "h-2 rounded-full",
                i === active
                  ? `bg-gradient-to-r ${current.accentClass}`
                  : "bg-cookie-800 hover:bg-cookie-600",
              )}
            />
          ))}
        </div>

        {/* Next */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={goNext}
          className="w-11 h-11 rounded-full bg-[#1a0d07] border border-cookie-800/60 hover:border-cookie-500 text-cookie-400 flex items-center justify-center transition-all shadow-md"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* ── Ingredient tags ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 flex flex-wrap items-center justify-center gap-2 mt-6 px-6"
        >
          {current.ingredients.map((ing, idx) => (
            <motion.span
              key={ing}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.06 }}
              className="px-3 py-1 rounded-full bg-cookie-900/50 border border-cookie-800/60 text-xs text-cookie-400 backdrop-blur-sm"
            >
              {ing}
            </motion.span>
          ))}
          <span className="px-3 py-1 rounded-full bg-[#1a0d07]/60 border border-cookie-900 text-xs text-caramel/40">
            {current.weight} · {current.calories} cal
          </span>
        </motion.div>
      </AnimatePresence>

      <p className="relative z-10 text-center text-[10px] text-cookie-900/60 mt-5 font-medium tracking-widest uppercase">
        ← desliza o arrastra →
      </p>
    </section>
  );
}

// ─── Hook tilt 3D para las tarjetas del grid ─────────────────────────────────
function useTilt(ref: React.RefObject<HTMLDivElement | null>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 350,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 350,
    damping: 30,
  });
  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      x.set((e.clientX - r.left) / r.width - 0.5);
      y.set((e.clientY - r.top) / r.height - 0.5);
    },
    [ref, x, y],
  );
  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);
  return { rotateX, rotateY, onMouseMove, onMouseLeave };
}

// ─── Tarjeta GRID ─────────────────────────────────────────────────────────────
function GridCard({
  product,
  index,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: {
  product: (typeof PRODUCTS)[0];
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (p: (typeof PRODUCTS)[0]) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt(cardRef);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{
        delay: index * 0.06,
        duration: 0.55,
        type: "spring",
        bounce: 0.25,
      }}
      layout
      style={{ perspective: 900 }}
      className="group"
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => {
          if (!cardRef.current) return;
          const r = cardRef.current.getBoundingClientRect();
          mouseX.set(((e.clientX - r.left) / r.width) * 100);
          mouseY.set(((e.clientY - r.top) / r.height) * 100);
          onMouseMove(e);
          setHovered(true);
        }}
        onMouseLeave={() => {
          onMouseLeave();
          setHovered(false);
        }}
        className="relative h-full cursor-pointer"
      >
        {hovered && (
          <div
            className="absolute -inset-px rounded-2xl pointer-events-none z-0"
            style={{
              background: `radial-gradient(circle at ${mouseX.get()}% ${mouseY.get()}%, rgba(212,165,116,0.16), transparent 65%)`,
            }}
          />
        )}

        <div className="relative h-full bg-gradient-to-br from-cookie-950 to-background rounded-2xl border border-cookie-900 hover:border-cookie-600/50 shadow-xl overflow-hidden flex flex-col transition-colors duration-300">
          <div className="relative h-48 sm:h-52 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <motion.div
              animate={{ scale: hovered ? 1.08 : 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
              />
            </motion.div>
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-3 left-3 right-3 z-20 flex gap-1.5 flex-wrap"
                >
                  {product.ingredients.map((ing, i) => (
                    <motion.span
                      key={ing}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="px-2 py-0.5 bg-background/90 backdrop-blur-md rounded-full text-[10px] text-cookie-400 border border-cookie-800"
                    >
                      {ing}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
              {product.tag && (
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide",
                    TAG_STYLES[product.tag] ?? "bg-amber-500 text-black",
                  )}
                >
                  {product.tag}
                </span>
              )}
              {discount && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-600 text-white">
                  -{discount}%
                </span>
              )}
              {product.isVegan && (
                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-700/90 text-white flex items-center gap-1">
                  <Leaf className="w-3 h-3" />
                  Vegan
                </span>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.75 }}
              onClick={() => onToggleFavorite(product.id)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm border border-cookie-900 flex items-center justify-center hover:border-rose-500/50 transition-colors"
            >
              <Heart
                className={cn(
                  "w-3.5 h-3.5 transition-all",
                  isFavorite ? "text-rose-500 fill-current" : "text-caramel/30",
                )}
              />
            </motion.button>
          </div>

          <div className="p-4 sm:p-5 flex flex-col flex-1">
            <div className="flex items-center gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3 h-3",
                    i < Math.floor(product.rating)
                      ? "text-cookie-400 fill-current"
                      : "text-cookie-900",
                  )}
                />
              ))}
              <span className="text-xs font-bold text-cookie-400 ml-1">
                {product.rating}
              </span>
              <span className="text-xs text-caramel/40 ml-0.5">
                ({product.reviews})
              </span>
            </div>
            <h3 className="font-display text-sm font-bold text-vanilla mb-1.5 group-hover:text-cookie-400 transition-colors uppercase tracking-tight leading-snug">
              {product.name}
            </h3>
            <p className="text-xs text-caramel/55 line-clamp-2 mb-3 leading-relaxed flex-1">
              {product.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-caramel/35 mb-3 border-t border-cookie-950 pt-2.5">
              <Package className="w-3 h-3" />
              <span>{product.weight}</span>
              <span>·</span>
              <Flame className="w-3 h-3" />
              <span>{product.calories} cal</span>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div>
                <div className="font-display text-xl sm:text-2xl font-bold text-cookie-400 leading-none">
                  ${product.price}
                </div>
                {product.originalPrice && (
                  <div className="text-xs text-caramel/35 line-through">
                    ${product.originalPrice}
                  </div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleAdd}
                className={cn(
                  "relative px-3 sm:px-4 py-2 rounded-xl font-black text-[11px] uppercase tracking-wide overflow-hidden transition-all duration-300",
                  added
                    ? "bg-emerald-600 text-white"
                    : `bg-gradient-to-r ${product.accentClass} text-vanilla shadow-lg`,
                )}
              >
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                />
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span
                      key="ok"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative flex items-center gap-1"
                    >
                      ✓ Ok
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span className="hidden sm:inline">Añadir</span>
                      <span className="sm:hidden">+</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Tarjeta LISTA — rediseñada ───────────────────────────────────────────────
function ListCard({
  product,
  index,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: {
  product: (typeof PRODUCTS)[0];
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (p: (typeof PRODUCTS)[0]) => void;
}) {
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ delay: index * 0.045, duration: 0.4, type: "spring" }}
      layout
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group"
    >
      <div
        className={cn(
          "flex flex-col sm:flex-row overflow-hidden rounded-2xl border transition-all duration-300",
          "bg-gradient-to-br from-cookie-950 via-background to-chocolate-950",
          hovered
            ? "border-cookie-600/50 shadow-[0_8px_40px_rgba(139,69,19,0.25)]"
            : "border-cookie-900",
        )}
      >
        {/* ── Imagen ── */}
        <div className="relative sm:w-52 md:w-64 lg:w-72 h-52 sm:h-auto shrink-0 overflow-hidden">
          {/* fondo con degradado sutil */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-30",
              product.accentClass,
            )}
          />
          <motion.div
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="280px"
            />
          </motion.div>
          {/* overlay bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-cookie-950/60 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-cookie-950/40" />

          {/* badges apilados */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.tag && (
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide shadow-lg",
                  TAG_STYLES[product.tag] ?? "bg-amber-500 text-black",
                )}
              >
                {product.tag}
              </span>
            )}
            {discount && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-lg">
                -{discount}%
              </span>
            )}
            {product.isVegan && (
              <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-700/90 text-white flex items-center gap-1 shadow-lg">
                <Leaf className="w-3 h-3" />
                Vegan
              </span>
            )}
          </div>

          {/* favorito */}
          <motion.button
            whileTap={{ scale: 0.7 }}
            onClick={() => onToggleFavorite(product.id)}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm border border-cookie-800 flex items-center justify-center hover:border-rose-500/50 transition-colors"
          >
            <Heart
              className={cn(
                "w-3.5 h-3.5 transition-all",
                isFavorite ? "text-rose-500 fill-current" : "text-caramel/30",
              )}
            />
          </motion.button>
        </div>

        {/* ── Contenido ── */}
        <div className="flex flex-col sm:flex-row flex-1 min-w-0">
          {/* info principal */}
          <div className="flex-1 min-w-0 p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div>
              {/* rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3.5 h-3.5",
                      i < Math.floor(product.rating)
                        ? "text-cookie-400 fill-current"
                        : "text-cookie-900",
                    )}
                  />
                ))}
                <span className="text-xs font-bold text-cookie-400 ml-1">
                  {product.rating}
                </span>
                <span className="text-xs text-caramel/40 ml-0.5">
                  ({product.reviews} reseñas)
                </span>
              </div>

              {/* nombre */}
              <h3 className="font-display text-lg sm:text-xl font-bold text-vanilla group-hover:text-cookie-400 transition-colors uppercase tracking-tight leading-tight mb-2">
                {product.name}
              </h3>

              {/* descripción */}
              <p className="text-sm text-caramel/55 leading-relaxed line-clamp-2 mb-4">
                {product.description}
              </p>

              {/* ingredientes */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {product.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="px-2.5 py-0.5 rounded-full text-[10px] text-cookie-400 bg-cookie-900/70 border border-cookie-800/60"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* meta info row */}
            <div className="flex items-center flex-wrap gap-3 pt-3 border-t border-cookie-950/80">
              <div className="flex items-center gap-1.5 text-xs text-caramel/40">
                <Package className="w-3.5 h-3.5 text-cookie-800" />
                <span>{product.weight}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-caramel/40">
                <Flame className="w-3.5 h-3.5 text-cookie-800" />
                <span>{product.calories} cal</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-caramel/40">
                <Scale className="w-3.5 h-3.5 text-cookie-800" />
                <span className="capitalize">{product.texture}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-caramel/40">
                <Sparkles className="w-3.5 h-3.5 text-cookie-800" />
                <span className="capitalize">{product.intensity}</span>
              </div>
            </div>
          </div>

          {/* ── Panel de compra ── */}
          <div className="shrink-0 sm:w-52 md:w-56 flex flex-col justify-between p-5 sm:p-6 border-t sm:border-t-0 sm:border-l border-cookie-900/60">
            {/* precio */}
            <div className="mb-5">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-display text-3xl font-bold text-cookie-400">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-caramel/35 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              {discount && (
                <span className="inline-block text-[11px] font-bold text-rose-400">
                  Ahorra {discount}%
                </span>
              )}

              {/* pairings */}
              <div className="mt-3">
                <p className="text-[10px] uppercase tracking-widest text-caramel/30 mb-1.5 font-bold">
                  Marida con
                </p>
                <div className="flex flex-wrap gap-1">
                  {product.pairings.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 rounded-full text-[10px] text-caramel/50 bg-cookie-950 border border-cookie-900"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* botones */}
            <div className="flex flex-col gap-2.5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAdd}
                className={cn(
                  "relative w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wide overflow-hidden transition-all duration-300",
                  added
                    ? "bg-emerald-600 text-white"
                    : `bg-gradient-to-r ${product.accentClass} text-vanilla shadow-lg`,
                )}
              >
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                />
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span
                      key="ok"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative flex items-center gap-2"
                    >
                      ✓ Añadido
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" /> Añadir al carrito
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onToggleFavorite(product.id)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 border",
                  isFavorite
                    ? "bg-rose-900/30 border-rose-700/50 text-rose-400"
                    : "bg-cookie-950/60 border-cookie-900 text-caramel/40 hover:border-cookie-700 hover:text-caramel/70",
                )}
              >
                <Heart
                  className={cn(
                    "w-3.5 h-3.5 transition-all",
                    isFavorite && "fill-current",
                  )}
                />
                {isFavorite ? "En favoritos" : "Guardar"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSort, setShowSort] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setShowSort(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = PRODUCTS.filter((p) => {
    const matchCat =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.ingredients.some((i) => i.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "newest") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
  });

  const toggleFavorite = (id: string) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  const handleAddToCart = (p: (typeof PRODUCTS)[0]) =>
    console.log("Cart:", p.name);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-dark overflow-hidden">
      <Particles />

      {/* ══ CARRUSEL 3D ═══════════════════════════════════════════════════════ */}
      <Carousel3D onAddToCart={handleAddToCart} />

      {/* ══ BARRA STICKY ══════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-40 bg-background/88 backdrop-blur-xl border-b border-cookie-950">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 flex-1">
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wide transition-all duration-300",
                    selectedCategory === cat.id
                      ? `bg-gradient-to-r ${cat.color} text-vanilla shadow-md`
                      : "bg-cookie-950 text-caramel/50 hover:text-cookie-400 border border-cookie-900 hover:border-cookie-800",
                  )}
                >
                  {cat.icon} {cat.label}
                </motion.button>
              ))}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center gap-2 px-3 py-1.5 bg-cookie-950 border border-cookie-900 rounded-full text-[11px] text-caramel/55"
            >
              <Filter className="w-3.5 h-3.5 text-cookie-400" />
              {CATEGORIES.find((c) => c.id === selectedCategory)?.label}
              <ChevronDown
                className={cn(
                  "w-3 h-3 transition-transform",
                  showFilters && "rotate-180",
                )}
              />
            </button>

            <div className="flex-1 hidden sm:block" />

            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cookie-950 border border-cookie-900 rounded-full text-[11px] text-caramel/50 hover:border-cookie-800 transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-cookie-400" />
                <span className="hidden sm:inline">
                  {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
                </span>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 transition-transform",
                    showSort && "rotate-180",
                  )}
                />
              </button>
              <AnimatePresence>
                {showSort && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.96 }}
                    className="absolute right-0 top-full mt-2 w-44 bg-cookie-950 border border-cookie-900 rounded-xl overflow-hidden shadow-2xl z-50"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id);
                          setShowSort(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-xs transition-colors hover:bg-cookie-900 font-medium",
                          sortBy === opt.id
                            ? "text-cookie-400"
                            : "text-caramel/45",
                        )}
                      >
                        {sortBy === opt.id && <span className="mr-2">✓</span>}
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center bg-cookie-950 border border-cookie-900 rounded-full p-1 gap-0.5">
              {(
                [
                  ["grid", LayoutGrid, "Grilla"],
                  ["list", List, "Lista"],
                ] as const
              ).map(([mode, Icon, label]) => (
                <motion.button
                  key={mode}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setViewMode(mode)}
                  title={label}
                  className={cn(
                    "p-1.5 rounded-full transition-all",
                    viewMode === mode
                      ? "bg-gradient-to-r from-cookie-500 to-chocolate-600 text-vanilla"
                      : "text-cookie-900 hover:text-cookie-500",
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-3 pb-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setShowFilters(false);
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase",
                        selectedCategory === cat.id
                          ? `bg-gradient-to-r ${cat.color} text-vanilla`
                          : "bg-cookie-950 text-caramel/50 border border-cookie-900",
                      )}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ══ GRID / LISTA ══════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[11px] text-caramel/35 uppercase tracking-wider font-bold">
            {filtered.length === 0 ? (
              "Sin resultados"
            ) : (
              <>
                <span className="text-cookie-400">{filtered.length}</span>{" "}
                productos
              </>
            )}
            {search && (
              <span>
                {" "}
                · "<span className="text-cookie-400">{search}</span>"
              </span>
            )}
          </p>
          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 text-[11px] text-caramel/35"
            >
              <Heart className="w-3 h-3 text-rose-500 fill-current" />
              {favorites.length} fav{favorites.length !== 1 ? "s" : ""}
            </motion.div>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            viewMode === "grid" ? (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5"
              >
                {filtered.map((product, i) => (
                  <GridCard
                    key={product.id}
                    product={product}
                    index={i}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                layout
                className="flex flex-col gap-4 max-w-4xl mx-auto"
              >
                {filtered.map((product, i) => (
                  <ListCard
                    key={product.id}
                    product={product}
                    index={i}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </motion.div>
            )
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-28"
            >
              <Cookie className="w-14 h-14 text-cookie-950 mb-4" />
              <h3 className="font-display text-base font-bold text-vanilla uppercase mb-2">
                Sin resultados
              </h3>
              <p className="text-xs text-caramel/40 mb-5">
                No encontramos galletas con "{search}"
              </p>
              <button
                onClick={() => setSearch("")}
                className="px-5 py-2 bg-gradient-to-r from-cookie-500 to-chocolate-600 rounded-full text-vanilla font-black text-xs uppercase"
              >
                Ver todas
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ══ BANNER CTA ════════════════════════════════════════════════════════ */}
      <section className="mx-4 sm:mx-6 lg:mx-8 mb-14 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cookie-950 via-background to-chocolate-950 border border-cookie-900"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cookie-500/30 to-transparent" />
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 14, repeat: Infinity }}
            className="absolute right-0 top-0 w-80 h-80 bg-cookie-400/6 rounded-full blur-3xl pointer-events-none"
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-8 sm:p-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-cookie-400 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-cookie-400">
                  Oferta de bienvenida
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-vanilla uppercase leading-tight mb-2">
                Primera compra con{" "}
                <span className="bg-gradient-to-r from-cookie-400 to-caramel bg-clip-text text-transparent">
                  20% OFF
                </span>
              </h2>
              <p className="text-xs text-caramel/50 max-w-xs">
                Regístrate hoy, recibe tu descuento y una galleta sorpresa en tu
                primer pedido.
              </p>
            </div>
            <Link href="/auth/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-cookie-500 to-chocolate-600 text-vanilla font-black rounded-2xl shadow-lg cursor-pointer uppercase tracking-wide text-xs whitespace-nowrap"
              >
                <Zap className="w-4 h-4" />
                Crear cuenta gratis
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
