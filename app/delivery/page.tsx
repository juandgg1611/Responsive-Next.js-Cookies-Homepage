// app/delivery/page.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Truck,
  MapPin,
  Clock,
  Package,
  Sparkles,
  Star,
  Shield,
  Navigation,
  Home,
  Briefcase,
  Building2,
  CheckCircle2,
  XCircle,
  CreditCard,
  DollarSign,
  Calendar,
  ArrowRight,
  Loader2,
  Zap,
  Gift,
  Cookie,
  Heart,
  Sun,
  Moon,
  Wind,
  Droplets,
  Locate,
  X,
  Layers,
  Route,
  Target,
  WifiOff,
  ChevronDown,
  Info,
  Minus,
  Plus,
  Map,
  Search,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

// ─── Lazy-load Leaflet map (SSR safe) ────────────────────────────────────────
const DeliveryMap = dynamic(() => import("@/components/delivery/DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-cookie-950 rounded-3xl border border-cookie-900">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <Map className="w-10 h-10 text-cookie-400" />
      </motion.div>
      <p className="text-caramel/60 text-sm mt-3 font-medium tracking-widest uppercase">
        Cargando mapa…
      </p>
    </div>
  ),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type LatLng = { lat: number; lng: number };

export type CoverageZone = {
  name: string;
  center: LatLng;
  radius: number;
  fee: number;
  time: string;
  color: string;
  minOrder: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────
export const MARACAIBO_CENTER: LatLng = { lat: 10.6315, lng: -71.6405 };

export const COVERAGE_ZONES: CoverageZone[] = [
  {
    name: "Centro",
    center: { lat: 10.6427, lng: -71.6125 },
    radius: 3000,
    fee: 2.99,
    time: "25-35 min",
    color: "#D4A574",
    minOrder: "$15",
  },
  {
    name: "Bellas Artes",
    center: { lat: 10.6756, lng: -71.6489 },
    radius: 2500,
    fee: 3.49,
    time: "30-40 min",
    color: "#C4914A",
    minOrder: "$20",
  },
  {
    name: "La Lago",
    center: { lat: 10.6189, lng: -71.6517 },
    radius: 2800,
    fee: 3.99,
    time: "35-45 min",
    color: "#A67040",
    minOrder: "$20",
  },
  {
    name: "Sabaneta",
    center: { lat: 10.6606, lng: -71.6256 },
    radius: 3200,
    fee: 4.49,
    time: "40-50 min",
    color: "#8B5A32",
    minOrder: "$25",
  },
  {
    name: "Vereda del Lago",
    center: { lat: 10.635, lng: -71.67 },
    radius: 2200,
    fee: 3.29,
    time: "28-38 min",
    color: "#BA7D4E",
    minOrder: "$15",
  },
  {
    name: "Las Delicias",
    center: { lat: 10.65, lng: -71.635 },
    radius: 2600,
    fee: 3.79,
    time: "33-43 min",
    color: "#9C6B3A",
    minOrder: "$20",
  },
];

const SAVED_ADDRESSES = [
  {
    id: "home",
    label: "Casa",
    address: "Av. 5 de Julio, Maracaibo 4001",
    icon: Home,
    latLng: { lat: 10.6427, lng: -71.6125 },
    accent: "from-cookie-500 to-cookie-700",
  },
  {
    id: "work",
    label: "Trabajo",
    address: "Lago Mall, Maracaibo",
    icon: Briefcase,
    latLng: { lat: 10.6189, lng: -71.6517 },
    accent: "from-chocolate-500 to-chocolate-700",
  },
  {
    id: "gym",
    label: "Gimnasio",
    address: "CC Sabaneta, Av. 15, Maracaibo",
    icon: Building2,
    latLng: { lat: 10.6606, lng: -71.6256 },
    accent: "from-amber-700 to-cookie-800",
  },
];

const PAYMENT_METHODS = [
  { id: "cash", label: "Efectivo", icon: DollarSign, fee: 0 },
  { id: "card", label: "Tarjeta de crédito/débito", icon: CreditCard, fee: 0 },
  {
    id: "transfer",
    label: "Transferencia bancaria",
    icon: CreditCard,
    fee: 0,
  },
  { id: "zelle", label: "Zelle", icon: Zap, fee: 0 },
  { id: "paypal", label: "PayPal", icon: CreditCard, fee: 0.5 },
];

const SCHEDULES = [
  { id: "asap", label: "Lo más pronto posible", time: "25-35 min" },
  { id: "morning", label: "Mañana (9am – 12pm)", time: "~2h" },
  { id: "afternoon", label: "Tarde (12pm – 5pm)", time: "~3h" },
  { id: "evening", label: "Noche (5pm – 9pm)", time: "~4h" },
  { id: "scheduled", label: "Programar entrega", time: "A elegir" },
];

const CART_ITEMS = [
  { name: "Triple Chocolate Overdose", qty: 2, price: 9.49 },
  { name: "Caramel Sea Salt Bliss", qty: 1, price: 8.49 },
  { name: "Brown Butter Pecan", qty: 1, price: 8.99 },
];

// ─── Particles ────────────────────────────────────────────────────────────────
function FloatingParticles() {
  const [pts, setPts] = useState<
    { id: number; x: number; y: number; s: number; d: number }[]
  >([]);
  useEffect(() => {
    setPts(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 2 + Math.random() * 3,
        d: Math.random() * 6,
      })),
    );
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {pts.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cookie-400/15"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
          animate={{
            y: [0, -32, 0],
            opacity: [0.05, 0.25, 0.05],
            scale: [1, 1.7, 1],
          }}
          transition={{
            duration: 9 + p.d,
            repeat: Infinity,
            delay: p.d,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Weather widget ───────────────────────────────────────────────────────────
function WeatherBar() {
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour <= 6;
  const isHot = hour >= 12 && hour <= 15;
  const temp = isNight ? 26 : isHot ? 35 : 32;
  const label = isNight ? "Noche clara" : isHot ? "Muy caluroso" : "Soleado";
  const Icon = isNight ? Moon : Sun;

  return (
    <div className="flex items-center gap-4 px-4 py-2.5 rounded-2xl bg-cookie-950/60 border border-cookie-900/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-cookie-400" />
        <span className="text-sm font-bold text-vanilla">{temp}°C</span>
        <span className="text-xs text-caramel/60">{label}</span>
      </div>
      <div className="w-px h-4 bg-cookie-900" />
      <div className="flex items-center gap-1.5 text-xs text-caramel/50">
        <Droplets className="w-3.5 h-3.5 text-cookie-800" />
        <span>65%</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-caramel/50">
        <Wind className="w-3.5 h-3.5 text-cookie-800" />
        <span>12 km/h</span>
      </div>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-1 h-7 rounded-full bg-gradient-to-b from-cookie-400 to-cookie-700" />
      <h2 className="text-lg font-black text-vanilla uppercase tracking-wider">
        {children}
      </h2>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DeliveryPage() {
  const [selectedLatLng, setSelectedLatLng] = useState<LatLng | null>(null);
  const [address, setAddress] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(3.99);
  const [estimatedTime, setEstimatedTime] = useState("30-40 min");
  const [isInCoverage, setIsInCoverage] = useState<boolean | null>(null);
  const [selectedZone, setSelectedZone] = useState<CoverageZone | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState("asap");
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [selectedSaved, setSelectedSaved] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapFlyTo, setMapFlyTo] = useState<LatLng | null>(null);
  const [showScheduleDropdown, setShowScheduleDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationError, setLocationError] = useState<string | null>(null);

  // ── Calculate delivery fee ──
  const calcFee = useCallback((loc: LatLng) => {
    const dist =
      Math.sqrt(
        Math.pow(loc.lat - MARACAIBO_CENTER.lat, 2) +
          Math.pow(loc.lng - MARACAIBO_CENTER.lng, 2),
      ) * 111;

    let fee = 2.99,
      time = "25-35 min",
      inCoverage = dist <= 15;

    if (dist > 10) {
      fee = 5.99;
      time = "45-60 min";
    } else if (dist > 5) {
      fee = 4.49;
      time = "35-45 min";
    } else if (dist > 2) {
      fee = 3.49;
      time = "30-40 min";
    }

    // Find matching zone
    const zone = COVERAGE_ZONES.find((z) => {
      const d =
        Math.sqrt(
          Math.pow(loc.lat - z.center.lat, 2) +
            Math.pow(loc.lng - z.center.lng, 2),
        ) *
        111 *
        1000;
      return d <= z.radius;
    });
    if (zone) {
      fee = zone.fee;
      time = zone.time;
    }

    setDeliveryFee(fee);
    setEstimatedTime(time);
    setIsInCoverage(inCoverage);
    if (zone) setSelectedZone(zone);
  }, []);

  // ── Handle map click ──
  const handleMapClick = useCallback(
    (latLng: LatLng, addr?: string) => {
      setSelectedLatLng(latLng);
      if (addr) setAddress(addr);
      calcFee(latLng);
      setSelectedSaved(null);
      setLocationError(null);
    },
    [calcFee],
  );

  // ── Geolocation ──
  const handleGeolocate = useCallback(() => {
    setIsLocating(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocalización no soportada en este navegador.");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setSelectedLatLng(loc);
        setMapFlyTo(loc);
        calcFee(loc);
        setAddress("📍 Ubicación actual detectada");
        setIsLocating(false);
      },
      (err) => {
        setLocationError(
          "No se pudo obtener la ubicación. Verifica los permisos.",
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, [calcFee]);

  // ── Saved address ──
  const handleSavedAddress = (saved: (typeof SAVED_ADDRESSES)[0]) => {
    setSelectedSaved(saved.id);
    setSelectedLatLng(saved.latLng);
    setAddress(saved.address);
    setMapFlyTo(saved.latLng);
    calcFee(saved.latLng);
    setLocationError(null);
  };

  // ── Totals ──
  const subtotal = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const paypalFee = selectedPayment === "paypal" ? 0.5 : 0;
  const total = subtotal + deliveryFee + paypalFee;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-dark overflow-x-hidden">
      <FloatingParticles />

      {/* ── Ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-cookie-500/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 22, repeat: Infinity, delay: 3 }}
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-chocolate-500/15 blur-3xl"
        />
      </div>

      {/* ════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 pt-10 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Top label */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cookie-900/60 border border-cookie-500/30 text-cookie-400 text-xs font-black uppercase tracking-[0.3em] backdrop-blur-sm">
              <Truck className="w-4 h-4 animate-pulse" />
              Delivery a domicilio · Maracaibo
            </span>
          </motion.div>

          {/* Two-column hero */}
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center">
            {/* Left – Copy */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75 }}
              className="text-center lg:text-left"
            >
              <h1 className="font-display text-5xl sm:text-6xl xl:text-7xl font-bold text-vanilla leading-[0.95] mb-5">
                Llevamos el{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-cookie-400 to-caramel bg-clip-text text-transparent">
                    sabor
                  </span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-gradient-to-r from-cookie-400 to-caramel rounded-full"
                  />
                </span>
                <span className="block mt-2">a tu puerta</span>
              </h1>

              <p className="text-caramel/70 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8">
                Selecciona tu ubicación en el mapa, elige tu horario y recibe
                tus galletas favoritas recién horneadas.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto lg:mx-0 mb-8">
                {[
                  {
                    value: "30-50",
                    unit: "min",
                    label: "Entrega",
                    icon: Clock,
                  },
                  { value: "5K+", unit: "", label: "Pedidos", icon: Package },
                  { value: "99%", unit: "", label: "Satisfacción", icon: Star },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-cookie-950/50 border border-cookie-900"
                  >
                    <s.icon className="w-4 h-4 text-cookie-400" />
                    <span className="font-display font-black text-xl text-cookie-400 leading-none">
                      {s.value}
                      <span className="text-sm">{s.unit}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-caramel/50 font-bold">
                      {s.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Weather */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex justify-center lg:justify-start"
              >
                <WeatherBar />
              </motion.div>
            </motion.div>

            {/* Right – Map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, type: "spring", bounce: 0.2 }}
              className="relative"
            >
              {/* Map container */}
              <div className="relative h-[380px] sm:h-[440px] lg:h-[500px] rounded-3xl overflow-hidden border border-cookie-800/60 shadow-[0_40px_100px_rgba(139,69,19,0.4)]">
                <DeliveryMap
                  center={MARACAIBO_CENTER}
                  selectedLatLng={selectedLatLng}
                  flyTo={mapFlyTo}
                  coverageZones={COVERAGE_ZONES}
                  onMapClick={handleMapClick}
                  onZoneClick={setSelectedZone}
                />

                {/* Locate button overlay */}
                <button
                  onClick={handleGeolocate}
                  disabled={isLocating}
                  className="absolute top-4 right-4 z-[500] w-10 h-10 rounded-full bg-cookie-950/90 border border-cookie-800 backdrop-blur-sm flex items-center justify-center hover:border-cookie-500 transition-all shadow-lg"
                >
                  {isLocating ? (
                    <Loader2 className="w-4 h-4 text-cookie-400 animate-spin" />
                  ) : (
                    <Locate className="w-4 h-4 text-cookie-400" />
                  )}
                </button>

                {/* Top left info */}
                <div className="absolute top-4 left-4 z-[500] flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-cookie-950/90 border border-cookie-900 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-caramel/70 uppercase tracking-widest">
                      {COVERAGE_ZONES.length} zonas activas
                    </span>
                  </div>
                </div>

                {/* Selected zone card */}
                <AnimatePresence>
                  {selectedZone && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 16 }}
                      className="absolute bottom-4 left-4 right-4 z-[500] bg-cookie-950/95 backdrop-blur-md rounded-2xl border border-cookie-800 p-4 shadow-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-3.5 h-3.5 text-cookie-400" />
                            <span className="text-sm font-black text-vanilla uppercase tracking-wide">
                              {selectedZone.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-caramel/60">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {selectedZone.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Truck className="w-3 h-3 text-cookie-400" />
                              <span className="text-cookie-400 font-bold">
                                ${selectedZone.fee.toFixed(2)}
                              </span>
                            </span>
                            <span>Mínimo {selectedZone.minOrder}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedZone(null)}
                          className="w-6 h-6 rounded-full bg-cookie-900 flex items-center justify-center hover:bg-cookie-800 transition-colors"
                        >
                          <X className="w-3 h-3 text-caramel/60" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Grain overlay on map card */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none opacity-[0.025] mix-blend-overlay"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                  backgroundSize: "140px 140px",
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MAIN FORM
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8">
            {/* ════ LEFT COLUMN ════════════════════════════════════════ */}
            <div className="space-y-6">
              {/* ── Address block ── */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-cookie-950 to-background rounded-2xl border border-cookie-900 p-6"
              >
                <SectionHeading>Dirección de entrega</SectionHeading>

                {/* Input row */}
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cookie-700" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Haz clic en el mapa o busca tu dirección…"
                      className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-background-dark border border-cookie-900 text-vanilla text-sm placeholder-caramel/30 focus:outline-none focus:border-cookie-600/60 focus:ring-2 focus:ring-cookie-500/15 transition-all"
                    />
                    {address && (
                      <button
                        onClick={() => {
                          setAddress("");
                          setSelectedLatLng(null);
                          setIsInCoverage(null);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-4 h-4 text-cookie-900 hover:text-cookie-500 transition-colors" />
                      </button>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGeolocate}
                    disabled={isLocating}
                    title="Usar mi ubicación"
                    className="w-12 h-12 rounded-xl bg-cookie-900/60 border border-cookie-800 flex items-center justify-center hover:border-cookie-600 hover:bg-cookie-900 transition-all text-cookie-400 disabled:opacity-50 shrink-0"
                  >
                    {isLocating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Target className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {locationError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-sm text-rose-400"
                    >
                      <WifiOff className="w-4 h-4 shrink-0" />
                      {locationError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Coverage indicator */}
                <AnimatePresence>
                  {isInCoverage !== null && selectedLatLng && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "mb-5 p-4 rounded-xl border flex items-center gap-3",
                        isInCoverage
                          ? "bg-emerald-950/30 border-emerald-800/40"
                          : "bg-rose-950/30 border-rose-800/40",
                      )}
                    >
                      {isInCoverage ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-emerald-400">
                              ¡Zona con cobertura!
                            </p>
                            <p className="text-xs text-caramel/55 mt-0.5">
                              Tiempo estimado:{" "}
                              <span className="text-cookie-400 font-bold">
                                {estimatedTime}
                              </span>
                              {" · "}Envío:{" "}
                              <span className="text-cookie-400 font-bold">
                                ${deliveryFee.toFixed(2)}
                              </span>
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-rose-400">
                              Fuera de zona de cobertura
                            </p>
                            <p className="text-xs text-caramel/55 mt-0.5">
                              Aún no llegamos a esta zona. Intenta otra
                              dirección.
                            </p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Saved addresses */}
                <p className="text-[10px] uppercase tracking-widest font-bold text-caramel/40 mb-3">
                  Direcciones guardadas
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {SAVED_ADDRESSES.map((s) => {
                    const Icon = s.icon;
                    const active = selectedSaved === s.id;
                    return (
                      <motion.button
                        key={s.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSavedAddress(s)}
                        className={cn(
                          "p-4 rounded-xl border-2 text-left transition-all duration-200",
                          active
                            ? `bg-gradient-to-br ${s.accent} border-cookie-500/50`
                            : "bg-cookie-950/50 border-cookie-900 hover:border-cookie-700",
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4 mb-2",
                            active ? "text-vanilla" : "text-cookie-400",
                          )}
                        />
                        <p
                          className={cn(
                            "text-xs font-bold mb-0.5",
                            active ? "text-vanilla" : "text-vanilla",
                          )}
                        >
                          {s.label}
                        </p>
                        <p className="text-[10px] text-caramel/50 leading-tight truncate">
                          {s.address}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* ── Schedule + Payment two-column ── */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Schedule */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-cookie-950 to-background rounded-2xl border border-cookie-900 p-6"
                >
                  <SectionHeading>Horario</SectionHeading>
                  <div className="space-y-2">
                    {SCHEDULES.map((sch) => {
                      const active = selectedSchedule === sch.id;
                      return (
                        <button
                          key={sch.id}
                          onClick={() => setSelectedSchedule(sch.id)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all",
                            active
                              ? "border-cookie-500/60 bg-cookie-900/40"
                              : "border-cookie-950 hover:border-cookie-800 bg-background-dark/40",
                          )}
                        >
                          <span
                            className={cn(
                              "text-xs font-bold",
                              active ? "text-vanilla" : "text-caramel/70",
                            )}
                          >
                            {sch.label}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-bold",
                              active ? "text-cookie-400" : "text-caramel/30",
                            )}
                          >
                            {sch.time}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Payment */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="bg-gradient-to-br from-cookie-950 to-background rounded-2xl border border-cookie-900 p-6"
                >
                  <SectionHeading>Pago</SectionHeading>
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map((m) => {
                      const Icon = m.icon;
                      const active = selectedPayment === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedPayment(m.id)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all",
                            active
                              ? "border-cookie-500/60 bg-cookie-900/40"
                              : "border-cookie-950 hover:border-cookie-800 bg-background-dark/40",
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={cn(
                                "w-4 h-4",
                                active ? "text-cookie-400" : "text-cookie-800",
                              )}
                            />
                            <span
                              className={cn(
                                "text-xs font-bold",
                                active ? "text-vanilla" : "text-caramel/70",
                              )}
                            >
                              {m.label}
                            </span>
                          </div>
                          {m.fee > 0 && (
                            <span className="text-[10px] text-caramel/40">
                              +${m.fee.toFixed(2)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* ── Notes ── */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-cookie-950 to-background rounded-2xl border border-cookie-900 p-6"
              >
                <SectionHeading>
                  Instrucciones para el repartidor
                </SectionHeading>
                <textarea
                  rows={3}
                  placeholder="Ej: Portón azul, timbre 2B, dejar en recepción…"
                  className="w-full px-4 py-3 rounded-xl bg-background-dark border border-cookie-900 text-vanilla text-sm placeholder-caramel/25 focus:outline-none focus:border-cookie-600/50 focus:ring-2 focus:ring-cookie-500/10 transition-all resize-none"
                />
              </motion.div>
            </div>

            {/* ════ RIGHT COLUMN – Order summary ════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="h-fit lg:sticky lg:top-24"
            >
              <div className="bg-gradient-to-br from-cookie-950 to-background rounded-2xl border border-cookie-900 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-cookie-950">
                  <h3 className="font-display font-bold text-lg text-vanilla uppercase tracking-wide">
                    Resumen del pedido
                  </h3>
                </div>

                {/* Items */}
                <div className="px-6 py-5 space-y-4">
                  {CART_ITEMS.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cookie-900/60 flex items-center justify-center shrink-0">
                        <Cookie className="w-5 h-5 text-cookie-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-vanilla leading-tight truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-caramel/45 mt-0.5">
                          x{item.qty} · ${item.price.toFixed(2)} c/u
                        </p>
                      </div>
                      <span className="text-sm font-black text-cookie-400 shrink-0">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="mx-6 h-px bg-cookie-950" />

                {/* Totals */}
                <div className="px-6 py-5 space-y-2.5">
                  <div className="flex justify-between text-xs text-caramel/55">
                    <span>Subtotal</span>
                    <span className="font-bold text-caramel/80">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-caramel/55">Envío</span>
                    <span
                      className={cn(
                        "font-bold",
                        selectedLatLng ? "text-cookie-400" : "text-caramel/30",
                      )}
                    >
                      {selectedLatLng ? `$${deliveryFee.toFixed(2)}` : "—"}
                    </span>
                  </div>
                  {paypalFee > 0 && (
                    <div className="flex justify-between text-xs text-caramel/55">
                      <span>Comisión PayPal</span>
                      <span className="font-bold text-caramel/70">$0.50</span>
                    </div>
                  )}
                  <div className="pt-3 mt-2 border-t border-cookie-950 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-vanilla">
                      Total
                    </span>
                    <span className="font-display text-2xl font-black text-cookie-400">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Delivery summary pill */}
                {selectedLatLng && isInCoverage && (
                  <div className="mx-6 mb-5 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-xs text-emerald-400 font-bold">
                      Llega en {estimatedTime}
                    </span>
                  </div>
                )}

                {/* CTA */}
                <div className="px-6 pb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={!selectedLatLng || !isInCoverage}
                    className={cn(
                      "relative w-full py-4 rounded-xl font-black text-sm uppercase tracking-wide overflow-hidden transition-all",
                      selectedLatLng && isInCoverage
                        ? "bg-gradient-to-r from-cookie-500 to-chocolate-600 text-vanilla shadow-[0_8px_30px_rgba(139,69,19,0.4)] hover:shadow-[0_12px_40px_rgba(139,69,19,0.55)]"
                        : "bg-cookie-950 text-cookie-900 border border-cookie-900 cursor-not-allowed",
                    )}
                  >
                    {selectedLatLng && isInCoverage && (
                      <motion.div
                        animate={{ x: ["-100%", "220%"] }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                      />
                    )}
                    <span className="relative flex items-center justify-center gap-2">
                      <Truck className="w-4 h-4" />
                      Confirmar pedido
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </motion.button>

                  {!selectedLatLng && (
                    <p className="text-center text-[10px] text-caramel/30 mt-3 uppercase tracking-widest font-bold">
                      Selecciona una dirección primero
                    </p>
                  )}
                </div>

                {/* Trust badges */}
                <div className="px-6 pb-6 grid grid-cols-3 gap-2 pt-2 border-t border-cookie-950">
                  {[
                    { icon: Shield, text: "Pago seguro" },
                    { icon: Clock, text: "Entrega puntual" },
                    { icon: Package, text: "Empaque especial" },
                  ].map((b) => (
                    <div
                      key={b.text}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <b.icon className="w-4 h-4 text-cookie-700" />
                      <span className="text-[9px] uppercase tracking-wider text-caramel/35 text-center font-bold leading-tight">
                        {b.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          COVERAGE ZONES
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cookie-900/60 border border-cookie-800/50 text-cookie-400 text-xs font-black uppercase tracking-[0.3em] mb-5"
            >
              <Map className="w-4 h-4" />
              Cobertura actual
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-display text-4xl sm:text-5xl font-bold text-vanilla"
            >
              Zonas de{" "}
              <span className="bg-gradient-to-r from-cookie-400 to-caramel bg-clip-text text-transparent">
                entrega
              </span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mx-auto mt-3 w-24 h-px bg-gradient-to-r from-transparent via-cookie-500 to-transparent"
            />
          </div>

          {/* Zones grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {COVERAGE_ZONES.map((zone, i) => (
              <motion.button
                key={zone.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedZone(zone);
                  setMapFlyTo(zone.center);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-cookie-950 to-background border border-cookie-900 hover:border-cookie-600/50 transition-all shadow-lg"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: `${zone.color}22`,
                    border: `1.5px solid ${zone.color}44`,
                  }}
                >
                  <MapPin className="w-5 h-5" style={{ color: zone.color }} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-vanilla uppercase tracking-tight mb-1">
                    {zone.name}
                  </p>
                  <p className="text-[10px] text-caramel/50 mb-0.5">
                    {zone.time}
                  </p>
                  <p
                    className="text-[10px] font-bold"
                    style={{ color: zone.color }}
                  >
                    Envío ${zone.fee.toFixed(2)}
                  </p>
                  <p className="text-[9px] text-caramel/30 mt-0.5">
                    Mín. {zone.minOrder}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cookie-950 via-background to-chocolate-950 border border-cookie-900"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cookie-500/30 to-transparent" />
            <motion.div
              animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
              transition={{ duration: 12, repeat: Infinity }}
              className="absolute right-0 top-0 w-72 h-72 bg-cookie-400/5 rounded-full blur-3xl pointer-events-none"
            />

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-10">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-cookie-400 animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-cookie-400">
                    Oferta de bienvenida
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-vanilla uppercase mb-2">
                  Primer pedido con{" "}
                  <span className="bg-gradient-to-r from-cookie-400 to-caramel bg-clip-text text-transparent">
                    20% OFF
                  </span>
                </h3>
                <p className="text-xs text-caramel/50 max-w-xs">
                  Regístrate, obtén tu descuento y recibe envío gratis en tu
                  primera compra.
                </p>
              </div>

              <Link href="/auth/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2.5 px-7 py-4 bg-gradient-to-r from-cookie-500 to-chocolate-600 text-vanilla font-black rounded-2xl shadow-lg shadow-chocolate-500/30 cursor-pointer uppercase tracking-wide text-xs whitespace-nowrap"
                >
                  <Gift className="w-4 h-4" />
                  Crear cuenta gratis
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
