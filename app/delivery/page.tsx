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
  ArrowRight,
  Loader2,
  Zap,
  Gift,
  Cookie,
  Sun,
  Moon,
  Wind,
  Droplets,
  Locate,
  X,
  Target,
  WifiOff,
  Map,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { MARACAIBO_CENTER, COVERAGE_ZONES } from "@/app/delivery/data";
import type { LatLng, CoverageZone } from "@/app/delivery/data";

// ─── Lazy-load Leaflet map ────────────────────────────────────────────────────
const DeliveryMap = dynamic(() => import("@/components/delivery/DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a0f0a] rounded-3xl border border-[#3A2318]">
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

const SAVED_ADDRESSES = [
  {
    id: "home",
    label: "Casa",
    address: "Av. 5 de Julio, Maracaibo 4001",
    icon: Home,
    latLng: { lat: 10.6427, lng: -71.6125 },
  },
  {
    id: "work",
    label: "Trabajo",
    address: "Lago Mall, Maracaibo",
    icon: Briefcase,
    latLng: { lat: 10.6189, lng: -71.6517 },
  },
  {
    id: "gym",
    label: "Gimnasio",
    address: "CC Sabaneta, Av. 15, Maracaibo",
    icon: Building2,
    latLng: { lat: 10.6606, lng: -71.6256 },
  },
];

const PAYMENT_METHODS = [
  { id: "cash", label: "Efectivo", icon: DollarSign, fee: 0 },
  { id: "card", label: "Tarjeta", icon: CreditCard, fee: 0 },
  { id: "transfer", label: "Transferencia", icon: CreditCard, fee: 0 },
  { id: "zelle", label: "Zelle", icon: Zap, fee: 0 },
  { id: "paypal", label: "PayPal", icon: CreditCard, fee: 0.5 },
];

const SCHEDULES = [
  { id: "asap", label: "Lo antes posible", time: "25-35 min" },
  { id: "morning", label: "Mañana (9am – 12pm)", time: "~2h" },
  { id: "afternoon", label: "Tarde (12pm – 5pm)", time: "~3h" },
  { id: "evening", label: "Noche (5pm – 9pm)", time: "~4h" },
];

const CART_ITEMS = [
  { name: "Triple Chocolate Overdose", qty: 2, price: 9.49 },
  { name: "Caramel Sea Salt Bliss", qty: 1, price: 8.49 },
  { name: "Brown Butter Pecan", qty: 1, price: 8.99 },
];

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = ["Dirección", "Horario & Pago", "Confirmar"];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 w-full mb-8">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                  done
                    ? "bg-cookie-500 border-cookie-500 text-white"
                    : active
                      ? "bg-transparent border-cookie-400 text-cookie-400"
                      : "bg-transparent border-[#3A2318] text-[#5D3A2B]",
                )}
              >
                {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider whitespace-nowrap",
                  active
                    ? "text-cookie-400"
                    : done
                      ? "text-cookie-600"
                      : "text-[#5D3A2B]",
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1 mx-1 mb-5 transition-all duration-500",
                  done ? "bg-cookie-500" : "bg-[#3A2318]",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Weather pill ─────────────────────────────────────────────────────────────
function WeatherPill() {
  const h = new Date().getHours();
  const isNight = h >= 19 || h <= 6;
  const temp = isNight ? 26 : h >= 12 && h <= 15 ? 35 : 32;
  const Icon = isNight ? Moon : Sun;
  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#2C1810]/60 border border-[#3A2318] backdrop-blur-sm text-xs">
      <Icon className="w-3.5 h-3.5 text-cookie-400" />
      <span className="font-bold text-vanilla">{temp}°C</span>
      <span className="text-[#5D3A2B]">·</span>
      <Droplets className="w-3.5 h-3.5 text-cookie-700" />
      <span className="text-caramel/50">65%</span>
      <span className="text-[#5D3A2B]">·</span>
      <Wind className="w-3.5 h-3.5 text-cookie-700" />
      <span className="text-caramel/50">12 km/h</span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DeliveryPage() {
  const [step, setStep] = useState(0);
  const [selectedLatLng, setLatLng] = useState<LatLng | null>(null);
  const [address, setAddress] = useState("");
  const [deliveryFee, setFee] = useState(3.99);
  const [estimatedTime, setTime] = useState("30-40 min");
  const [isInCoverage, setCoverage] = useState<boolean | null>(null);
  const [selectedZone, setZone] = useState<CoverageZone | null>(null);
  const [selectedSchedule, setSchedule] = useState("asap");
  const [selectedPayment, setPayment] = useState("cash");
  const [selectedSaved, setSaved] = useState<string | null>(null);
  const [isLocating, setLocating] = useState(false);
  const [mapFlyTo, setFlyTo] = useState<LatLng | null>(null);
  const [locationError, setLocError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  // ── Fee calc ──
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
    setFee(fee);
    setTime(time);
    setCoverage(inCoverage);
    if (zone) setZone(zone);
  }, []);

  const handleMapClick = useCallback(
    (latLng: LatLng, addr?: string) => {
      setLatLng(latLng);
      if (addr) setAddress(addr);
      calcFee(latLng);
      setSaved(null);
      setLocError(null);
    },
    [calcFee],
  );

  const handleGeolocate = useCallback(() => {
    setLocating(true);
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError("Geolocalización no disponible en este navegador.");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLatLng(loc);
        setFlyTo(loc);
        calcFee(loc);
        setAddress("📍 Ubicación actual");
        setLocating(false);
      },
      () => {
        setLocError("No se pudo obtener la ubicación. Verifica los permisos.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, [calcFee]);

  const handleSavedAddress = (s: (typeof SAVED_ADDRESSES)[0]) => {
    setSaved(s.id);
    setLatLng(s.latLng);
    setAddress(s.address);
    setFlyTo(s.latLng);
    calcFee(s.latLng);
    setLocError(null);
  };

  const subtotal = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const paypalFee = selectedPayment === "paypal" ? 0.5 : 0;
  const total = subtotal + deliveryFee + paypalFee;
  const canProceed = selectedLatLng && isInCoverage;

  return (
    <div className="min-h-screen bg-[#2C1810] overflow-x-hidden">
      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-60 -right-60 w-[800px] h-[800px] rounded-full bg-cookie-500/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 25, repeat: Infinity, delay: 4 }}
          className="absolute -bottom-60 -left-60 w-[700px] h-[700px] rounded-full bg-chocolate-500/15 blur-3xl"
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, #D4A574 2px, transparent 2px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 pt-10 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#3A2318]/80 border border-cookie-500/30 text-cookie-400 text-xs font-black uppercase tracking-[0.3em] mb-6 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Delivery a domicilio · Maracaibo
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl font-bold text-vanilla leading-tight mb-4"
          >
            Llevamos el{" "}
            <span className="bg-gradient-to-r from-cookie-400 to-caramel bg-clip-text text-transparent">
              sabor
            </span>{" "}
            a tu puerta
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-caramel/60 text-lg max-w-xl mx-auto mb-8"
          >
            Selecciona tu dirección, elige cómo y cuándo, y recibe tus galletas
            recién horneadas.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 sm:gap-8 mb-8 flex-wrap"
          >
            {[
              { icon: Clock, value: "30-50 min", label: "Tiempo de entrega" },
              { icon: Package, value: "5,000+", label: "Pedidos entregados" },
              { icon: Star, value: "99%", label: "Satisfacción" },
              { icon: Truck, value: "6 zonas", label: "Cobertura activa" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#3A2318]/50 border border-[#4A2F20] backdrop-blur-sm"
              >
                <s.icon className="w-4 h-4 text-cookie-400 shrink-0" />
                <div className="text-left">
                  <div className="font-display font-black text-cookie-400 text-sm leading-none">
                    {s.value}
                  </div>
                  <div className="text-[10px] text-caramel/40 uppercase tracking-wider mt-0.5">
                    {s.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Weather */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <WeatherPill />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MAIN LAYOUT: MAP + FORM PANEL
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_420px] gap-6">
            {/* ── MAP ── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative h-[420px] sm:h-[520px] lg:h-[640px] rounded-3xl overflow-hidden border border-[#4A2F20] shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
            >
              <DeliveryMap
                center={MARACAIBO_CENTER}
                selectedLatLng={selectedLatLng}
                flyTo={mapFlyTo}
                coverageZones={COVERAGE_ZONES}
                onMapClick={handleMapClick}
                onZoneClick={setZone}
              />

              {/* Locate button */}
              <button
                onClick={handleGeolocate}
                disabled={isLocating}
                className="absolute top-4 right-4 z-[500] w-10 h-10 rounded-full bg-[#2C1810]/90 border border-[#4A2F20] backdrop-blur-sm flex items-center justify-center hover:border-cookie-500 transition-all shadow-lg"
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 text-cookie-400 animate-spin" />
                ) : (
                  <Locate className="w-4 h-4 text-cookie-400" />
                )}
              </button>

              {/* Top left badge */}
              <div className="absolute top-4 left-4 z-[500]">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2C1810]/90 border border-[#3A2318] backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-caramel/60 uppercase tracking-widest">
                    {COVERAGE_ZONES.length} zonas activas
                  </span>
                </div>
              </div>

              {/* Selected zone popup */}
              <AnimatePresence>
                {selectedZone && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    className="absolute bottom-4 left-4 right-4 z-[500] bg-[#2C1810]/95 backdrop-blur-md rounded-2xl border border-[#4A2F20] p-4 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{
                            background: `${selectedZone.color}22`,
                            border: `1.5px solid ${selectedZone.color}44`,
                          }}
                        >
                          <MapPin
                            className="w-4 h-4"
                            style={{ color: selectedZone.color }}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-black text-vanilla uppercase tracking-wide">
                            {selectedZone.name}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-caramel/50 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {selectedZone.time}
                            </span>
                            <span className="text-cookie-400 font-bold">
                              Envío ${selectedZone.fee.toFixed(2)}
                            </span>
                            <span>Mín. {selectedZone.minOrder}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setZone(null)}
                        className="w-6 h-6 rounded-full bg-[#3A2318] flex items-center justify-center hover:bg-[#4A2F20] transition-colors"
                      >
                        <X className="w-3 h-3 text-caramel/60" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── FORM PANEL ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col gap-0"
            >
              <div className="bg-gradient-to-br from-[#3A2318]/90 to-[#2C1810]/80 backdrop-blur-xl rounded-3xl border border-[#4A2F20]/60 shadow-2xl overflow-hidden">
                {/* Panel header */}
                <div className="px-6 pt-6 pb-4 border-b border-[#4A2F20]/50">
                  <StepBar current={step} />
                </div>

                <div
                  className="px-6 py-5 overflow-y-auto max-h-[520px]"
                  style={{ scrollbarWidth: "none" }}
                >
                  {/* ══ STEP 0: Dirección ══ */}
                  <AnimatePresence mode="wait">
                    {step === 0 && (
                      <motion.div
                        key="step0"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                      >
                        {/* Search input */}
                        <div className="relative mb-4">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cookie-700" />
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Haz clic en el mapa o usa tu ubicación…"
                            className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#2C1810] border border-[#4A2F20] text-vanilla text-sm placeholder-caramel/30 focus:outline-none focus:border-cookie-500/60 focus:ring-2 focus:ring-cookie-500/15 transition-all"
                          />
                          {address ? (
                            <button
                              onClick={() => {
                                setAddress("");
                                setLatLng(null);
                                setCoverage(null);
                              }}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              <X className="w-4 h-4 text-[#4A2F20] hover:text-cookie-500 transition-colors" />
                            </button>
                          ) : (
                            <button
                              onClick={handleGeolocate}
                              disabled={isLocating}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-cookie-700 hover:text-cookie-400 transition-colors"
                            >
                              {isLocating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Target className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Location error */}
                        <AnimatePresence>
                          {locationError && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-800/30 text-sm text-red-400"
                            >
                              <WifiOff className="w-4 h-4 shrink-0" />
                              {locationError}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Coverage status */}
                        <AnimatePresence>
                          {isInCoverage !== null && selectedLatLng && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className={cn(
                                "mb-4 p-4 rounded-xl border flex items-center gap-3",
                                isInCoverage
                                  ? "bg-emerald-950/30 border-emerald-800/30"
                                  : "bg-red-950/30 border-red-800/30",
                              )}
                            >
                              {isInCoverage ? (
                                <>
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                  <div>
                                    <p className="text-sm font-bold text-emerald-400">
                                      ¡Zona con cobertura!
                                    </p>
                                    <p className="text-xs text-caramel/50 mt-0.5">
                                      {estimatedTime} · Envío{" "}
                                      <span className="text-cookie-400 font-bold">
                                        ${deliveryFee.toFixed(2)}
                                      </span>
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                                  <div>
                                    <p className="text-sm font-bold text-red-400">
                                      Fuera de cobertura
                                    </p>
                                    <p className="text-xs text-caramel/50 mt-0.5">
                                      Intenta otra dirección.
                                    </p>
                                  </div>
                                </>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Saved addresses */}
                        <p className="text-[10px] uppercase tracking-widest font-bold text-caramel/30 mb-3">
                          Direcciones guardadas
                        </p>
                        <div className="space-y-2 mb-6">
                          {SAVED_ADDRESSES.map((s) => {
                            const Icon = s.icon;
                            const active = selectedSaved === s.id;
                            return (
                              <motion.button
                                key={s.id}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSavedAddress(s)}
                                className={cn(
                                  "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                                  active
                                    ? "bg-cookie-500/15 border-cookie-500/40"
                                    : "bg-[#2C1810]/60 border-[#3A2318] hover:border-[#4A2F20]",
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                    active
                                      ? "bg-cookie-500/20"
                                      : "bg-[#3A2318]",
                                  )}
                                >
                                  <Icon
                                    className={cn(
                                      "w-4 h-4",
                                      active
                                        ? "text-cookie-400"
                                        : "text-caramel/40",
                                    )}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-vanilla">
                                    {s.label}
                                  </p>
                                  <p className="text-[10px] text-caramel/40 truncate">
                                    {s.address}
                                  </p>
                                </div>
                                {active && (
                                  <CheckCircle2 className="w-4 h-4 text-cookie-400 shrink-0" />
                                )}
                              </motion.button>
                            );
                          })}
                        </div>

                        {/* Next button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => canProceed && setStep(1)}
                          disabled={!canProceed}
                          className={cn(
                            "w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                            canProceed
                              ? "bg-gradient-to-r from-cookie-500 to-chocolate-600 text-white shadow-[0_8px_30px_rgba(139,69,19,0.3)] hover:shadow-[0_12px_40px_rgba(139,69,19,0.45)]"
                              : "bg-[#3A2318]/50 text-[#5D3A2B] border border-[#3A2318] cursor-not-allowed",
                          )}
                        >
                          {canProceed ? (
                            <>
                              <span>Continuar</span>
                              <ChevronRight className="w-4 h-4" />
                            </>
                          ) : (
                            <span>Selecciona una dirección en el mapa</span>
                          )}
                        </motion.button>
                      </motion.div>
                    )}

                    {/* ══ STEP 1: Horario & Pago ══ */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        className="space-y-6"
                      >
                        {/* Horario */}
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-caramel/30 mb-3 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> Horario de entrega
                          </p>
                          <div className="space-y-2">
                            {SCHEDULES.map((sch) => {
                              const active = selectedSchedule === sch.id;
                              return (
                                <button
                                  key={sch.id}
                                  onClick={() => setSchedule(sch.id)}
                                  className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all",
                                    active
                                      ? "border-cookie-500/50 bg-cookie-500/10"
                                      : "border-[#3A2318] hover:border-[#4A2F20] bg-[#2C1810]/40",
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "text-xs font-bold",
                                      active
                                        ? "text-vanilla"
                                        : "text-caramel/60",
                                    )}
                                  >
                                    {sch.label}
                                  </span>
                                  <span
                                    className={cn(
                                      "text-[10px] font-bold",
                                      active
                                        ? "text-cookie-400"
                                        : "text-[#5D3A2B]",
                                    )}
                                  >
                                    {sch.time}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Pago */}
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-caramel/30 mb-3 flex items-center gap-2">
                            <CreditCard className="w-3 h-3" /> Método de pago
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {PAYMENT_METHODS.map((m) => {
                              const Icon = m.icon;
                              const active = selectedPayment === m.id;
                              return (
                                <button
                                  key={m.id}
                                  onClick={() => setPayment(m.id)}
                                  className={cn(
                                    "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                                    active
                                      ? "border-cookie-500/50 bg-cookie-500/10"
                                      : "border-[#3A2318] hover:border-[#4A2F20] bg-[#2C1810]/40",
                                  )}
                                >
                                  <Icon
                                    className={cn(
                                      "w-4 h-4",
                                      active
                                        ? "text-cookie-400"
                                        : "text-caramel/40",
                                    )}
                                  />
                                  <span
                                    className={cn(
                                      "text-[10px] font-bold text-center leading-tight",
                                      active
                                        ? "text-vanilla"
                                        : "text-caramel/50",
                                    )}
                                  >
                                    {m.label}
                                  </span>
                                  {m.fee > 0 && (
                                    <span className="text-[9px] text-caramel/30">
                                      +${m.fee.toFixed(2)}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Notas */}
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-caramel/30 mb-3">
                            Instrucciones (opcional)
                          </p>
                          <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ej: Portón azul, timbre 2B…"
                            className="w-full px-4 py-3 rounded-xl bg-[#2C1810] border border-[#3A2318] text-vanilla text-sm placeholder-caramel/25 focus:outline-none focus:border-cookie-500/50 focus:ring-2 focus:ring-cookie-500/10 transition-all resize-none"
                          />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => setStep(0)}
                            className="flex-1 py-3 rounded-xl border border-[#4A2F20] text-caramel/60 hover:text-cookie-400 hover:border-cookie-500/40 transition-all text-sm font-bold"
                          >
                            Atrás
                          </button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStep(2)}
                            className="flex-2 flex-1 py-3 rounded-xl bg-gradient-to-r from-cookie-500 to-chocolate-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(139,69,19,0.3)]"
                          >
                            Continuar <ChevronRight className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {/* ══ STEP 2: Confirmar ══ */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        className="space-y-4"
                      >
                        {/* Summary cards */}
                        {[
                          {
                            label: "Dirección",
                            value: address || "—",
                            icon: MapPin,
                          },
                          {
                            label: "Horario",
                            value:
                              SCHEDULES.find((s) => s.id === selectedSchedule)
                                ?.label || "—",
                            icon: Clock,
                          },
                          {
                            label: "Pago",
                            value:
                              PAYMENT_METHODS.find(
                                (p) => p.id === selectedPayment,
                              )?.label || "—",
                            icon: CreditCard,
                          },
                        ].map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center gap-3 p-3 rounded-xl bg-[#2C1810]/60 border border-[#3A2318]"
                          >
                            <div className="w-8 h-8 rounded-lg bg-cookie-500/15 flex items-center justify-center shrink-0">
                              <row.icon className="w-4 h-4 text-cookie-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] uppercase tracking-wider text-caramel/30 font-bold">
                                {row.label}
                              </p>
                              <p className="text-xs text-vanilla font-medium truncate">
                                {row.value}
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* Items */}
                        <div className="p-4 rounded-xl bg-[#2C1810]/60 border border-[#3A2318] space-y-3">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-caramel/30 mb-1">
                            Productos
                          </p>
                          {CART_ITEMS.map((item) => (
                            <div
                              key={item.name}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <Cookie className="w-3.5 h-3.5 text-cookie-700 shrink-0" />
                                <span className="text-xs text-vanilla/80 truncate max-w-[140px]">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-caramel/40">
                                  x{item.qty}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-cookie-400">
                                ${(item.price * item.qty).toFixed(2)}
                              </span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-[#3A2318] space-y-1">
                            <div className="flex justify-between text-xs text-caramel/50">
                              <span>Subtotal</span>
                              <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-caramel/50">
                              <span>Envío</span>
                              <span className="text-cookie-400">
                                ${deliveryFee.toFixed(2)}
                              </span>
                            </div>
                            {paypalFee > 0 && (
                              <div className="flex justify-between text-xs text-caramel/50">
                                <span>Comisión PayPal</span>
                                <span>$0.50</span>
                              </div>
                            )}
                            <div className="flex justify-between pt-1 border-t border-[#3A2318]">
                              <span className="text-sm font-bold text-vanilla">
                                Total
                              </span>
                              <span className="font-display text-lg font-black text-cookie-400">
                                ${total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* ETA pill */}
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-800/30">
                          <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-sm text-emerald-400 font-bold">
                            Llega en aprox. {estimatedTime}
                          </span>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => setStep(1)}
                            className="flex-1 py-3 rounded-xl border border-[#4A2F20] text-caramel/60 hover:text-cookie-400 hover:border-cookie-500/40 transition-all text-sm font-bold"
                          >
                            Atrás
                          </button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="relative flex-1 py-4 rounded-xl bg-gradient-to-r from-cookie-500 to-chocolate-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(139,69,19,0.4)] overflow-hidden"
                          >
                            <motion.div
                              animate={{ x: ["-100%", "220%"] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3,
                              }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            />
                            <Truck className="w-4 h-4 relative" />
                            <span className="relative">Confirmar pedido</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          COVERAGE ZONES
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#3A2318]/60 border border-[#4A2F20] text-cookie-400 text-xs font-black uppercase tracking-[0.25em] mb-4"
            >
              <Map className="w-4 h-4" /> Cobertura actual
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl font-bold text-vanilla"
            >
              Zonas de{" "}
              <span className="bg-gradient-to-r from-cookie-400 to-caramel bg-clip-text text-transparent">
                entrega
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {COVERAGE_ZONES.map((zone, i) => (
              <motion.button
                key={zone.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setZone(zone);
                  setFlyTo(zone.center);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-[#3A2318]/80 to-[#2C1810]/60 border border-[#4A2F20] hover:border-cookie-600/50 transition-all shadow-lg"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: `${zone.color}18`,
                    border: `1.5px solid ${zone.color}40`,
                  }}
                >
                  <MapPin className="w-5 h-5" style={{ color: zone.color }} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-vanilla uppercase tracking-tight mb-1">
                    {zone.name}
                  </p>
                  <p className="text-[10px] text-caramel/40 mb-1">
                    {zone.time}
                  </p>
                  <p
                    className="text-[10px] font-bold"
                    style={{ color: zone.color }}
                  >
                    Envío ${zone.fee.toFixed(2)}
                  </p>
                  <p className="text-[9px] text-caramel/25 mt-0.5">
                    Mín. {zone.minOrder}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3A2318] via-[#2C1810] to-[#1a0f0a] border border-[#4A2F20]"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cookie-500/40 to-transparent" />

            {/* Glow */}
            <motion.div
              animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
              transition={{ duration: 14, repeat: Infinity }}
              className="absolute right-0 top-0 w-80 h-80 bg-cookie-400/6 rounded-full blur-3xl pointer-events-none"
            />

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-10">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-cookie-400 animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-cookie-400">
                    Oferta de bienvenida
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-vanilla mb-2">
                  Primer pedido con{" "}
                  <span className="bg-gradient-to-r from-cookie-400 to-caramel bg-clip-text text-transparent">
                    20% OFF
                  </span>
                </h3>
                <p className="text-xs text-caramel/40 max-w-xs">
                  Regístrate, obtén tu descuento y recibe envío gratis en tu
                  primera compra.
                </p>
              </div>
              <Link href="/auth/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2.5 px-7 py-4 bg-gradient-to-r from-cookie-500 to-chocolate-600 text-white font-black rounded-2xl shadow-lg shadow-chocolate-500/25 cursor-pointer uppercase tracking-wide text-xs whitespace-nowrap"
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
