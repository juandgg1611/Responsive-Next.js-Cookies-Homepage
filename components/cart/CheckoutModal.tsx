"use client";
// components/cart/CheckoutModal.tsx

import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  X,
  MapPin,
  Truck,
  Package,
  CheckCircle2,
  XCircle,
  Loader2,
  Navigation,
  Clock,
  ChevronRight,
  ArrowLeft,
  MessageCircle,
  CreditCard,
  DollarSign,
  Zap,
  Smartphone,
  Home,
  Briefcase,
  Building2,
  Star,
  Plus,
  Trash2,
  WifiOff,
  ChevronDown,
  Link2,
  Cookie,
  AlertTriangle,
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { useBCV } from "@/hooks/useBCV";
import {
  useAddresses,
  MAX_ADDRESSES,
} from "@/components/providers/address-provider";
import type { SavedAddress } from "@/components/providers/address-provider";
import { MARACAIBO_CENTER, COVERAGE_ZONES } from "@/app/delivery/data";
import type { LatLng, CoverageZone } from "@/app/delivery/data";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const DeliveryMap = dynamic(() => import("@/components/delivery/DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-cookie-50 dark:bg-background rounded-2xl border border-cookie-200 dark:border-cookie-500/30">
      <Loader2 className="w-8 h-8 text-cookie-500 animate-spin mb-2" />
      <p className="text-chocolate-500 dark:text-caramel text-xs uppercase tracking-widest">
        Cargando mapa...
      </p>
    </div>
  ),
});

// ── Constantes ─────────────────────────────────────────────────
const WHATSAPP_NUMBER = "584246801808";

const PAYMENT_METHODS = [
  { id: "cash", label: "Efectivo", icon: DollarSign, fee: 0 },
  { id: "transfer", label: "Transferencia", icon: CreditCard, fee: 0 },
  { id: "zelle", label: "Zelle", icon: Zap, fee: 0 },
  { id: "pagoMovil", label: "Pago Movil", icon: Smartphone, fee: 0 },
  { id: "paypal", label: "PayPal", icon: CreditCard, fee: 0.5 },
];

const SCHEDULES = [
  { id: "asap", label: "Lo antes posible", time: "25-35 min" },
  { id: "morning", label: "Manana (9am-12pm)", time: "~2h" },
  { id: "afternoon", label: "Tarde (12pm-5pm)", time: "~3h" },
  { id: "evening", label: "Noche (5pm-9pm)", time: "~4h" },
];

const ADDR_ICONS = [
  { id: "home", Icon: Home },
  { id: "briefcase", Icon: Briefcase },
  { id: "building2", Icon: Building2 },
  { id: "star", Icon: Star },
];

function getIcon(id: string) {
  return ADDR_ICONS.find((a) => a.id === id)?.Icon ?? MapPin;
}

function calcFeeFromLoc(loc: LatLng) {
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
  return { fee, time, inCoverage, zone: zone ?? null };
}

// ── Helpers WhatsApp ───────────────────────────────────────────
function toBs(usd: number, rate: number) {
  return new Intl.NumberFormat("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usd * rate);
}

function buildMessage(
  items: ReturnType<typeof useCart>["items"],
  mode: "pickup" | "delivery",
  delivery: {
    address: string;
    maps_url?: string;
    zone_name?: string;
    estimated_time?: string;
  } | null,
  fee: number,
  schedule: string,
  payment: string,
  notes: string,
  bcvRate: number | null,
) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const freeShip = subtotal >= 50 && mode === "delivery";
  const finalFee = freeShip ? 0 : fee;
  const paypalExtra = payment === "paypal" ? 0.5 : 0;
  const total = subtotal + finalFee + paypalExtra;

  const lines: string[] = [];
  lines.push("*Pedido NewYork Cookies*");
  lines.push("-------------------------");
  for (const item of items) {
    const qty = String(item.quantity).padStart(2, "0");
    lines.push(
      `- *${item.name}* (${qty} unid.) - $${item.price.toFixed(2)} c/u = $${(item.price * item.quantity).toFixed(2)}`,
    );
    if (bcvRate)
      lines.push(
        `  Bs. ${toBs(item.price, bcvRate)} c/u = Bs. ${toBs(item.price * item.quantity, bcvRate)}`,
      );
  }
  lines.push("-------------------------");
  lines.push(`*Subtotal: $${subtotal.toFixed(2)}*`);
  if (bcvRate) lines.push(`*Subtotal Bs: ${toBs(subtotal, bcvRate)}*`);

  if (mode === "pickup") {
    lines.push("*Modalidad: PICK UP*");
  } else if (delivery) {
    lines.push("*Modalidad: DELIVERY*");
    lines.push(`*Direccion: ${delivery.address}*`);
    if (delivery.maps_url) lines.push(`*Maps: ${delivery.maps_url}*`);
    if (delivery.zone_name)
      lines.push(
        `*Zona: ${delivery.zone_name} - ${delivery.estimated_time ?? ""}*`,
      );
    lines.push(
      freeShip ? "*Envio: GRATIS*" : `*Envio: $${finalFee.toFixed(2)}*`,
    );
    if (bcvRate && !freeShip) lines.push(`  Bs. ${toBs(finalFee, bcvRate)}`);
  }

  lines.push(
    `*Horario: ${SCHEDULES.find((s) => s.id === schedule)?.label ?? schedule}*`,
  );
  lines.push(
    `*Pago: ${PAYMENT_METHODS.find((p) => p.id === payment)?.label ?? payment}*`,
  );
  if (paypalExtra > 0) lines.push("  (+$0.50 comision PayPal)");
  if (notes) lines.push(`*Notas: ${notes}*`);
  lines.push("-------------------------");
  lines.push(`*TOTAL: $${total.toFixed(2)}*`);
  if (bcvRate) {
    lines.push(`*TOTAL Bs: ${toBs(total, bcvRate)}*`);
    lines.push(`Tasa BCV: Bs. ${bcvRate.toFixed(2)} por USD`);
  }
  lines.push("");
  lines.push("Por favor confirmar disponibilidad.");
  return encodeURIComponent(lines.join("\n"));
}

// ── StepBar ────────────────────────────────────────────────────
function StepBar({ current }: { current: number }) {
  const steps = ["Direccion", "Horario y Pago", "Confirmar"];
  return (
    <div className="flex items-center w-full">
      {steps.map((label, i) => {
        const done = i < current,
          active = i === current;
        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                  done
                    ? "bg-cookie-500 border-cookie-500 text-white"
                    : active
                      ? "bg-transparent border-cookie-500 text-cookie-600 dark:text-cookie-400"
                      : "bg-transparent border-cookie-300 dark:border-cookie-700 text-chocolate-400 dark:text-caramel",
                )}
              >
                {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[9px] font-bold uppercase tracking-wider whitespace-nowrap",
                  active
                    ? "text-cookie-600 dark:text-cookie-400"
                    : done
                      ? "text-cookie-500"
                      : "text-chocolate-400 dark:text-caramel",
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1 mx-1 mb-4 transition-all",
                  done ? "bg-cookie-500" : "bg-cookie-200 dark:bg-cookie-900/30",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Mini modal de eliminar (dentro del checkout) ───────────────
function DeleteInModal({
  addr,
  onConfirm,
  onCancel,
}: {
  addr: SavedAddress;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const Icon = getIcon(addr.icon);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        className="relative z-10 w-full max-w-xs bg-gradient-to-br from-cookie-50 to-cookie-100 dark:from-background dark:to-background-dark rounded-3xl border border-cookie-200 dark:border-cookie-700 shadow-2xl p-6"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-base font-display font-bold text-chocolate-900 dark:text-vanilla text-center mb-1">
          Eliminar direccion
        </h3>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-200 dark:border-cookie-500/30 my-4">
          <div className="w-8 h-8 rounded-lg bg-cookie-200 border border-cookie-300 dark:border-cookie-500/30 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-chocolate-500 dark:text-caramel" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-chocolate-900 dark:text-vanilla">{addr.label}</p>
            <p className="text-xs text-chocolate-500 dark:text-caramel truncate">{addr.address}</p>
          </div>
        </div>
        <p className="text-xs text-chocolate-500 dark:text-caramel text-center mb-5">
          Esta accion no se puede deshacer.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-cookie-200 dark:border-cookie-500/30 text-chocolate-600 dark:text-caramel hover:text-cookie-600 dark:text-cookie-400 text-sm font-bold transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" /> Eliminar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Login Modal (inline, sin salir del checkout) ───────────────
function LoginModal({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    if (authError) {
      setError("Credenciales incorrectas. Verifica tu email y contraseña.");
    } else {
      onSuccess();
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="relative z-10 w-full max-w-sm bg-gradient-to-br from-cookie-50 to-cookie-100 dark:from-background dark:to-background-dark rounded-3xl border border-cookie-200 dark:border-cookie-700 shadow-2xl p-6"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cookie-200/60 flex items-center justify-center hover:bg-cookie-200 transition-colors"
        >
          <X className="w-4 h-4 text-chocolate-600 dark:text-caramel" />
        </button>

        {/* Icon + title */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-cookie flex items-center justify-center shadow-cookie mb-3">
            <Cookie className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-display font-bold text-chocolate-900 dark:text-vanilla">
            Iniciar sesion
          </h3>
          <p className="text-sm text-chocolate-600 dark:text-caramel text-center mt-1">
            Inicia sesion para configurar tu delivery
          </p>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-cookie-200 dark:border-cookie-500/30 bg-white dark:bg-background-surface hover:bg-cookie-50 dark:hover:bg-background hover:border-cookie-300 dark:hover:border-cookie-500/30 transition-all font-semibold text-chocolate-800 dark:text-vanilla text-sm mb-4 disabled:opacity-60"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-cookie-500" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          Continuar con Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-cookie-200" />
          <span className="text-xs text-chocolate-500 dark:text-caramel font-medium">o con email</span>
          <div className="flex-1 h-px bg-cookie-200" />
        </div>

        {/* Email/password form */}
        <form onSubmit={handleEmailLogin} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cookie-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-background-surface border border-cookie-200 dark:border-cookie-500/30 text-chocolate-900 dark:text-vanilla text-sm placeholder-chocolate-400 dark:placeholder-caramel focus:outline-none focus:border-cookie-400 transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cookie-500" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-background-surface border border-cookie-200 dark:border-cookie-500/30 text-chocolate-900 dark:text-vanilla text-sm placeholder-chocolate-400 dark:placeholder-caramel focus:outline-none focus:border-cookie-400 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-chocolate-400 dark:text-caramel hover:text-chocolate-700 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full py-3 rounded-xl bg-gradient-cookie text-white font-bold text-sm flex items-center justify-center gap-2 shadow-cookie disabled:opacity-60 transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Iniciar sesion
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center text-xs text-chocolate-500 dark:text-caramel mt-4">
          ¿No tienes cuenta?{" "}
          <a href="/auth/register" className="text-cookie-600 dark:text-cookie-400 font-semibold hover:underline">
            Registrate
          </a>
        </p>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODAL PRINCIPAL
// ═══════════════════════════════════════════════════════════════
interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, subtotal } = useCart();
  const { data: bcv } = useBCV();
  const { addresses, addAddress, deleteAddress } = useAddresses();

  type Screen =
    | "method"
    | "delivery-step-0"
    | "delivery-step-1"
    | "delivery-step-2";
  const [screen, setScreen] = useState<Screen>("method");

  const [selectedSaved, setSelectedSaved] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SavedAddress | null>(null);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Mapa / nueva dirección
  const [selectedLatLng, setSelectedLatLng] = useState<LatLng | null>(null);
  const [addrText, setAddrText] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [feeState, setFeeState] = useState({
    fee: 3.99,
    time: "30-40 min",
    inCoverage: null as boolean | null,
    zone: null as CoverageZone | null,
  });
  const [mapFlyTo, setMapFlyTo] = useState<LatLng | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [saveNew, setSaveNew] = useState(false);
  const [newLabel, setNewLabel] = useState("Casa");
  const [newIcon, setNewIcon] = useState("home");
  const [isSavingNew, setIsSavingNew] = useState(false);
  const [saveNewError, setSaveNewError] = useState<string | null>(null);

  const [schedule, setSchedule] = useState("asap");
  const [payment, setPayment] = useState("cash");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!showDropdown) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownTriggerRef.current &&
        !dropdownTriggerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDropdown]);

  useEffect(() => {
    if (!isOpen) return;
    setScreen("method");
    setSelectedSaved(null);
    setShowDropdown(false);
    setSelectedLatLng(null);
    setAddrText("");
    setMapsUrl("");
    setFeeState({ fee: 3.99, time: "30-40 min", inCoverage: null, zone: null });
    setSaveNew(false);
  }, [isOpen]);

  useEffect(() => {
    if (screen === "delivery-step-0" && !selectedSaved) {
      const def = addresses.find((a) => a.is_default) ?? addresses[0];
      if (def) {
        setSelectedSaved(def.id ?? def.label);
        setSelectedLatLng({ lat: def.lat, lng: def.lng });
        setMapFlyTo({ lat: def.lat, lng: def.lng });
        setAddrText(def.address);
        setMapsUrl(def.maps_url ?? "");
        setFeeState(calcFeeFromLoc({ lat: def.lat, lng: def.lng }));
      }
    }
  }, [screen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMapClick = useCallback((latLng: LatLng, addr?: string) => {
    setSelectedLatLng(latLng);
    if (addr) setAddrText(addr);
    setFeeState(calcFeeFromLoc(latLng));
    setLocationError(null);
    setSelectedSaved(null);
  }, []);

  const handleGeolocate = useCallback(() => {
    setIsLocating(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocalizacion no disponible.");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setSelectedLatLng(loc);
        setMapFlyTo(loc);
        setFeeState(calcFeeFromLoc(loc));
        setAddrText("Ubicacion actual (GPS)");
        setIsLocating(false);
        setSelectedSaved(null);
      },
      () => {
        setLocationError("No se pudo obtener la ubicacion.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, []);

  const handleSelectSaved = useCallback((addr: SavedAddress) => {
    setSelectedSaved(addr.id ?? addr.label);
    setSelectedLatLng({ lat: addr.lat, lng: addr.lng });
    setMapFlyTo({ lat: addr.lat, lng: addr.lng });
    setAddrText(addr.address);
    setMapsUrl(addr.maps_url ?? "");
    setFeeState(calcFeeFromLoc({ lat: addr.lat, lng: addr.lng }));
    setShowDropdown(false);
    setLocationError(null);
  }, []);

  const handleSaveNewAddress = useCallback(async () => {
    if (
      !selectedLatLng ||
      !feeState.inCoverage ||
      addresses.length >= MAX_ADDRESSES
    )
      return;
    setIsSavingNew(true);
    setSaveNewError(null);
    const result = await addAddress({
      label: newLabel,
      icon: newIcon,
      address: addrText,
      maps_url: mapsUrl || undefined,
      lat: selectedLatLng.lat,
      lng: selectedLatLng.lng,
      delivery_fee: feeState.fee,
      estimated_time: feeState.time,
      zone_name: feeState.zone?.name,
    });
    setIsSavingNew(false);
    if (!result.ok) {
      if (result.error === "LABEL_EXISTS")
        setSaveNewError("Ya tienes una direccion con ese nombre.");
      else if (result.error === "MAX_REACHED")
        setSaveNewError("Limite de 3 direcciones alcanzado.");
      else setSaveNewError("Error al guardar. Intenta de nuevo.");
      return;
    }
    setSaveNew(false);
    setSaveNewError(null);
  }, [
    selectedLatLng,
    feeState,
    addrText,
    mapsUrl,
    newLabel,
    newIcon,
    addresses.length,
    addAddress,
  ]);

  const sendToWhatsApp = useCallback(
    (mode: "pickup" | "delivery") => {
      const delivData =
        mode === "delivery" && selectedLatLng
          ? {
              address: addrText,
              maps_url: mapsUrl || undefined,
              zone_name: feeState.zone?.name,
              estimated_time: feeState.time,
            }
          : null;
      const msg = buildMessage(
        items,
        mode,
        delivData,
        feeState.fee,
        schedule,
        payment,
        notes,
        bcv?.usd ?? null,
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
      onClose();
    },
    [
      items,
      selectedLatLng,
      addrText,
      mapsUrl,
      feeState,
      schedule,
      payment,
      notes,
      bcv,
      onClose,
    ],
  );

  const freeShip = subtotal >= 50;
  const paypalFee = payment === "paypal" ? 0.5 : 0;
  const finalFee = freeShip ? 0 : feeState.fee;
  const total = subtotal + finalFee + paypalFee;
  const canProceed = selectedLatLng !== null && feeState.inCoverage === true;

  const selAddr = selectedSaved
    ? addresses.find((a) => (a.id ?? a.label) === selectedSaved)
    : null;

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative z-10 w-full sm:max-w-2xl lg:max-w-3xl bg-gradient-to-br from-cookie-50 to-cookie-100 dark:from-background dark:to-background-dark rounded-t-3xl sm:rounded-3xl border border-cookie-200 dark:border-cookie-700 shadow-2xl flex flex-col"
            style={{ maxHeight: "92vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-cookie-200 dark:border-cookie-500/30 flex-shrink-0">
              <div className="flex items-center gap-3">
                {screen !== "method" && (
                  <button
                    onClick={() => {
                      if (screen === "delivery-step-1")
                        setScreen("delivery-step-0");
                      else if (screen === "delivery-step-2")
                        setScreen("delivery-step-1");
                      else setScreen("method");
                    }}
                    className="w-8 h-8 rounded-full bg-cookie-200/60 flex items-center justify-center hover:bg-cookie-200 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-chocolate-700 dark:text-caramel" />
                  </button>
                )}
                <div>
                  <h2 className="text-xl font-display font-bold text-chocolate-900 dark:text-vanilla">
                    {screen === "method" && "Finalizar pedido"}
                    {screen === "delivery-step-0" && "Direccion de entrega"}
                    {screen === "delivery-step-1" && "Horario y pago"}
                    {screen === "delivery-step-2" && "Confirmar pedido"}
                  </h2>
                  {screen.startsWith("delivery") && (
                    <p className="text-xs text-chocolate-500 dark:text-caramel mt-0.5">
                      Delivery · Maracaibo
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-cookie-200/60 flex items-center justify-center hover:bg-cookie-200 transition-colors"
              >
                <X className="w-4 h-4 text-chocolate-600 dark:text-caramel" />
              </button>
            </div>

            {/* StepBar */}
            {screen.startsWith("delivery") && (
              <div className="px-6 pt-4 pb-2 flex-shrink-0">
                <StepBar
                  current={
                    screen === "delivery-step-0"
                      ? 0
                      : screen === "delivery-step-1"
                        ? 1
                        : 2
                  }
                />
              </div>
            )}

            {/* Contenido scrollable */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ scrollbarWidth: "none" }}
            >
              <AnimatePresence mode="wait">
                {/* ══ METODO ══ */}
                {screen === "method" && (
                  <motion.div
                    key="method"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 grid sm:grid-cols-2 gap-6"
                  >
                    {/* Resumen */}
                    <div className="sm:col-span-2 rounded-xl bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-200 dark:border-cookie-500/30 p-4">
                      <p className="text-[10px] font-bold text-chocolate-500 dark:text-caramel uppercase tracking-widest mb-3">
                        Tu pedido
                      </p>
                      <div className="space-y-1.5">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-chocolate-700 dark:text-vanilla truncate mr-2">
                              {item.name}{" "}
                              <span className="text-chocolate-400 dark:text-caramel">
                                x{item.quantity}
                              </span>
                            </span>
                            <span className="text-chocolate-900 dark:text-vanilla font-semibold flex-shrink-0">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm font-bold pt-2 border-t border-cookie-200 dark:border-cookie-500/30">
                          <span className="text-chocolate-900 dark:text-vanilla">Subtotal</span>
                          <span className="text-cookie-600 dark:text-cookie-400">
                            ${subtotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pick Up */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => sendToWhatsApp("pickup")}
                      className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white dark:bg-background-surface border-2 border-cookie-200 dark:border-cookie-500/30 hover:border-cookie-400 transition-all group text-center shadow-sm"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-200 dark:border-cookie-500/30 flex items-center justify-center group-hover:bg-cookie-200 transition-colors">
                        <Package className="w-7 h-7 text-cookie-500" />
                      </div>
                      <div>
                        <p className="font-bold text-chocolate-900 dark:text-vanilla text-base mb-1">
                          Pick Up
                        </p>
                        <p className="text-xs text-chocolate-500 dark:text-caramel">
                          Retiras en nuestra cocina
                        </p>
                        <p className="text-xs text-green-600 font-semibold mt-2">
                          Sin costo de envio
                        </p>
                      </div>
                      <div className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cookie-500 to-chocolate-600 text-white font-bold text-sm flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" /> Pedir por WhatsApp
                      </div>
                    </motion.button>

                    {/* Delivery */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (isAuthenticated === false) {
                          setShowLoginModal(true);
                        } else {
                          setScreen("delivery-step-0");
                        }
                      }}
                      className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white dark:bg-background-surface border-2 border-cookie-200 dark:border-cookie-500/30 hover:border-cookie-400 transition-all group text-center shadow-sm"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-200 dark:border-cookie-500/30 flex items-center justify-center group-hover:bg-cookie-200 transition-colors">
                        <Truck className="w-7 h-7 text-cookie-500" />
                      </div>
                      <div>
                        <p className="font-bold text-chocolate-900 dark:text-vanilla text-base mb-1">
                          Delivery
                        </p>
                        {addresses.length > 0 ? (
                          <>
                            <p className="text-xs text-chocolate-500 dark:text-caramel truncate max-w-[180px] mx-auto">
                              {addresses.find((a) => a.is_default)?.address ??
                                addresses[0]?.address}
                            </p>
                            <p className="text-xs text-cookie-600 dark:text-cookie-400 font-semibold mt-1">
                              {addresses.length} direccion
                              {addresses.length > 1 ? "es" : ""} guardada
                              {addresses.length > 1 ? "s" : ""}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-chocolate-500 dark:text-caramel">
                            Configura tu direccion
                          </p>
                        )}
                      </div>

                      {/* Botón inferior: cambia según autenticación */}
                      {isAuthenticated === false ? (
                        <div className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cookie-500 to-chocolate-600 text-white font-bold text-sm flex items-center justify-center gap-2">
                          <LogIn className="w-4 h-4" /> Iniciar sesion
                        </div>
                      ) : (
                        <div className="w-full py-2.5 rounded-xl border-2 border-cookie-400 text-cookie-600 dark:text-cookie-400 font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-cookie-100 dark:bg-cookie-900/30 transition-colors">
                          Configurar entrega <ChevronRight className="w-4 h-4" />
                        </div>
                      )}
                    </motion.button>
                  </motion.div>
                )}

                {/* ══ DELIVERY PASO 0: Direccion ══ */}
                {screen === "delivery-step-0" && (
                  <motion.div
                    key="del-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 space-y-5"
                  >
                    {/* Dropdown direcciones guardadas */}
                    {addresses.length > 0 && (
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-chocolate-500 dark:text-caramel mb-2">
                          Mis direcciones ({addresses.length}/{MAX_ADDRESSES})
                        </p>
                        <div className="relative">
                          <button
                            ref={dropdownTriggerRef}
                            onClick={() => {
                              const rect =
                                dropdownTriggerRef.current?.getBoundingClientRect();
                              if (rect) setDropdownRect(rect);
                              setShowDropdown(!showDropdown);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-background-surface border border-cookie-200 dark:border-cookie-500/30 hover:border-cookie-400 transition-all text-left"
                          >
                            {selAddr ? (
                              (() => {
                                const Icon = getIcon(selAddr.icon);
                                return (
                                  <>
                                    <Icon className="w-4 h-4 text-cookie-500 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-chocolate-900 dark:text-vanilla">
                                        {selAddr.label}
                                      </p>
                                      <p className="text-xs text-chocolate-500 dark:text-caramel truncate">
                                        {selAddr.address}
                                      </p>
                                    </div>
                                  </>
                                );
                              })()
                            ) : (
                              <>
                                <MapPin className="w-4 h-4 text-chocolate-400 dark:text-caramel shrink-0" />
                                <span className="text-sm text-chocolate-500 dark:text-caramel flex-1">
                                  Selecciona una direccion guardada
                                </span>
                              </>
                            )}
                            <ChevronDown
                              className={cn(
                                "w-4 h-4 text-chocolate-400 dark:text-caramel flex-shrink-0 transition-transform",
                                showDropdown && "rotate-180",
                              )}
                            />
                          </button>

                          <AnimatePresence>
                            {showDropdown && dropdownRect && (
                              <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                style={{
                                  position: "fixed",
                                  top: dropdownRect.bottom + 4,
                                  left: dropdownRect.left,
                                  width: dropdownRect.width,
                                  zIndex: 9999,
                                }}
                                className="bg-cookie-50 dark:bg-background border border-cookie-200 dark:border-cookie-500/30 rounded-xl overflow-hidden shadow-xl"
                              >
                                {addresses.map((addr) => {
                                  const Icon = getIcon(addr.icon);
                                  const isActive =
                                    selectedSaved === (addr.id ?? addr.label);
                                  return (
                                    <div
                                      key={addr.id ?? addr.label}
                                      className="flex items-center group/item"
                                    >
                                      <button
                                        onClick={() => handleSelectSaved(addr)}
                                        className={cn(
                                          "flex-1 flex items-center gap-3 px-4 py-3 text-left transition-all",
                                          isActive
                                            ? "bg-cookie-100 dark:bg-cookie-900/30"
                                            : "hover:bg-cookie-50 dark:bg-background",
                                        )}
                                      >
                                        <Icon
                                          className={cn(
                                            "w-4 h-4 shrink-0",
                                            isActive
                                              ? "text-cookie-500"
                                              : "text-chocolate-400 dark:text-caramel",
                                          )}
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p
                                            className={cn(
                                              "text-sm font-bold",
                                              isActive
                                                ? "text-chocolate-900 dark:text-vanilla"
                                                : "text-chocolate-700 dark:text-caramel",
                                            )}
                                          >
                                            {addr.label}
                                          </p>
                                          <p className="text-xs text-chocolate-500 dark:text-caramel truncate">
                                            {addr.address}
                                          </p>
                                          {addr.estimated_time && (
                                            <p className="text-[10px] text-cookie-500 mt-0.5">
                                              {addr.estimated_time} · $
                                              {addr.delivery_fee?.toFixed(2)}
                                            </p>
                                          )}
                                        </div>
                                        {isActive && (
                                          <CheckCircle2 className="w-4 h-4 text-cookie-500 shrink-0" />
                                        )}
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDeleteTarget(addr);
                                          setShowDropdown(false);
                                        }}
                                        className="px-3 py-3 text-chocolate-300 hover:text-red-500 transition-colors opacity-0 group-hover/item:opacity-100"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {/* Separador */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-cookie-200" />
                      <span className="text-[10px] text-chocolate-500 dark:text-caramel uppercase tracking-widest font-bold">
                        {addresses.length > 0
                          ? "O usa el mapa"
                          : "Selecciona en el mapa"}
                      </span>
                      <div className="flex-1 h-px bg-cookie-200" />
                    </div>

                    {/* Mapa */}
                    <div className="relative h-72 rounded-2xl overflow-hidden border border-cookie-200 dark:border-cookie-500/30">
                      <DeliveryMap
                        center={MARACAIBO_CENTER}
                        selectedLatLng={selectedLatLng}
                        flyTo={mapFlyTo}
                        coverageZones={COVERAGE_ZONES}
                        onMapClick={handleMapClick}
                        onZoneClick={(z) =>
                          setFeeState((p) => ({ ...p, zone: z }))
                        }
                      />
                      <button
                        onClick={handleGeolocate}
                        disabled={isLocating}
                        title="GPS"
                        className="absolute top-3 right-3 z-[500] w-10 h-10 rounded-xl bg-cookie-50 dark:bg-background/95 border border-cookie-200 dark:border-cookie-500/30 backdrop-blur-sm flex items-center justify-center hover:border-cookie-400 transition-all shadow-md"
                      >
                        {isLocating ? (
                          <Loader2 className="w-4 h-4 text-cookie-500 animate-spin" />
                        ) : (
                          <Navigation className="w-4 h-4 text-cookie-500" />
                        )}
                      </button>
                      <div className="absolute top-3 left-3 z-[500]">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-cookie-50 dark:bg-background/95 border border-cookie-200 dark:border-cookie-500/30 backdrop-blur-sm shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-chocolate-600 dark:text-caramel uppercase tracking-widest">
                            {COVERAGE_ZONES.length} zonas
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cookie-500" />
                      <input
                        type="text"
                        value={addrText}
                        onChange={(e) => setAddrText(e.target.value)}
                        placeholder="Direccion (se llena al tocar el mapa)"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-background-surface border border-cookie-200 dark:border-cookie-500/30 text-chocolate-900 dark:text-vanilla text-sm placeholder-chocolate-400 dark:placeholder-caramel focus:outline-none focus:border-cookie-400 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cookie-500" />
                      <input
                        type="text"
                        value={mapsUrl}
                        onChange={(e) => setMapsUrl(e.target.value)}
                        placeholder="Pega tu link de Google Maps (opcional)"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-background-surface border border-cookie-200 dark:border-cookie-500/30 text-chocolate-900 dark:text-vanilla text-sm placeholder-chocolate-400 dark:placeholder-caramel focus:outline-none focus:border-cookie-400 transition-all"
                      />
                    </div>
                    {mapsUrl && (
                      <p className="text-[11px] text-cookie-500 -mt-3 pl-1">
                        El link se enviara en el WhatsApp.
                      </p>
                    )}

                    {/* Error GPS */}
                    <AnimatePresence>
                      {locationError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600"
                        >
                          <WifiOff className="w-3.5 h-3.5 shrink-0" />{" "}
                          {locationError}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Cobertura */}
                    <AnimatePresence>
                      {feeState.inCoverage !== null && selectedLatLng && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={cn(
                            "p-4 rounded-xl border flex items-center gap-3",
                            feeState.inCoverage
                              ? "bg-emerald-50 border-emerald-200"
                              : "bg-red-50 border-red-200",
                          )}
                        >
                          {feeState.inCoverage ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                              <div>
                                <p className="text-sm font-bold text-emerald-700">
                                  Zona con cobertura
                                </p>
                                <p className="text-xs text-chocolate-600 dark:text-caramel mt-0.5">
                                  {feeState.time} · Envio{" "}
                                  <span className="text-cookie-600 dark:text-cookie-400 font-bold">
                                    {freeShip
                                      ? "GRATIS"
                                      : `$${feeState.fee.toFixed(2)}`}
                                  </span>
                                  {feeState.zone && ` · ${feeState.zone.name}`}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                              <div>
                                <p className="text-sm font-bold text-red-600">
                                  Fuera de cobertura
                                </p>
                                <p className="text-xs text-chocolate-600 dark:text-caramel mt-0.5">
                                  Intenta otra ubicacion.
                                </p>
                              </div>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Guardar como favorita */}
                    {canProceed && addresses.length < MAX_ADDRESSES && (
                      <div className="rounded-xl border border-cookie-200 dark:border-cookie-500/30 overflow-hidden bg-white dark:bg-background-surface">
                        <button
                          onClick={() => setSaveNew(!saveNew)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cookie-50 dark:bg-background transition-colors text-left"
                        >
                          <Plus
                            className={cn(
                              "w-4 h-4",
                              saveNew ? "text-cookie-500" : "text-chocolate-400 dark:text-caramel",
                            )}
                          />
                          <span className="text-sm text-chocolate-700 dark:text-vanilla flex-1">
                            Guardar como favorita
                          </span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 text-chocolate-400 dark:text-caramel transition-transform",
                              saveNew && "rotate-180",
                            )}
                          />
                        </button>
                        <AnimatePresence>
                          {saveNew && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="px-4 pb-4 space-y-3 border-t border-cookie-200 dark:border-cookie-500/30"
                            >
                              <div className="pt-3">
                                <p className="text-[10px] uppercase tracking-widest text-chocolate-500 dark:text-caramel font-bold mb-2">
                                  Nombre y tipo
                                </p>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newLabel}
                                    onChange={(e) =>
                                      setNewLabel(e.target.value)
                                    }
                                    placeholder="Ej: Casa, Trabajo..."
                                    className="flex-1 px-3 py-2 rounded-xl bg-cookie-50 dark:bg-background border border-cookie-200 dark:border-cookie-500/30 text-chocolate-900 dark:text-vanilla text-sm placeholder-chocolate-400 dark:placeholder-caramel focus:outline-none focus:border-cookie-400 transition-all"
                                  />
                                  <div className="flex gap-1">
                                    {ADDR_ICONS.map(({ id, Icon }) => (
                                      <button
                                        key={id}
                                        onClick={() => setNewIcon(id)}
                                        className={cn(
                                          "w-9 h-9 rounded-lg flex items-center justify-center border transition-all",
                                          newIcon === id
                                            ? "bg-cookie-200 border-cookie-400"
                                            : "bg-cookie-50 dark:bg-background border-cookie-200 dark:border-cookie-500/30 hover:border-cookie-300 dark:hover:border-cookie-500/30",
                                        )}
                                      >
                                        <Icon
                                          className={cn(
                                            "w-4 h-4",
                                            newIcon === id
                                              ? "text-cookie-600 dark:text-cookie-400"
                                              : "text-chocolate-400 dark:text-caramel",
                                          )}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {saveNewError && (
                                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                  {saveNewError}
                                </p>
                              )}
                              <button
                                onClick={handleSaveNewAddress}
                                disabled={isSavingNew || !newLabel.trim()}
                                className="w-full py-2.5 rounded-xl bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-300 dark:border-cookie-500/30 text-cookie-600 dark:text-cookie-400 font-bold text-sm hover:bg-cookie-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                {isSavingNew ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                                Guardar direccion
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Continuar */}
                    <motion.button
                      whileHover={{ scale: canProceed ? 1.02 : 1 }}
                      whileTap={{ scale: canProceed ? 0.98 : 1 }}
                      onClick={() => canProceed && setScreen("delivery-step-1")}
                      disabled={!canProceed}
                      className={cn(
                        "w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                        canProceed
                          ? "bg-gradient-to-r from-cookie-500 to-chocolate-600 text-white shadow-cookie"
                          : "bg-cookie-100 dark:bg-cookie-900/30 text-chocolate-400 dark:text-caramel border border-cookie-200 dark:border-cookie-500/30 cursor-not-allowed",
                      )}
                    >
                      {canProceed ? (
                        <>
                          <span>Continuar</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      ) : (
                        "Selecciona una ubicacion valida"
                      )}
                    </motion.button>
                  </motion.div>
                )}

                {/* ══ DELIVERY PASO 1: Horario & Pago ══ */}
                {screen === "delivery-step-1" && (
                  <motion.div
                    key="del-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 space-y-6"
                  >
                    {/* Horario */}
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-chocolate-500 dark:text-caramel mb-3 flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Horario de entrega
                      </p>
                      <div className="space-y-2">
                        {SCHEDULES.map((sch) => {
                          const active = schedule === sch.id;
                          return (
                            <button
                              key={sch.id}
                              onClick={() => setSchedule(sch.id)}
                              className={cn(
                                "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all",
                                active
                                  ? "border-cookie-400 bg-cookie-100 dark:bg-cookie-900/30"
                                  : "border-cookie-200 dark:border-cookie-500/30 hover:border-cookie-300 dark:hover:border-cookie-500/30 bg-white dark:bg-background-surface",
                              )}
                            >
                              <span
                                className={cn(
                                  "text-xs font-bold",
                                  active ? "text-chocolate-900 dark:text-vanilla" : "text-chocolate-600 dark:text-caramel",
                                )}
                              >
                                {sch.label}
                              </span>
                              <span
                                className={cn(
                                  "text-[10px] font-bold",
                                  active ? "text-cookie-600 dark:text-cookie-400" : "text-chocolate-400 dark:text-caramel",
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
                      <p className="text-[10px] uppercase tracking-widest font-bold text-chocolate-500 dark:text-caramel mb-3 flex items-center gap-2">
                        <CreditCard className="w-3 h-3" /> Metodo de pago
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {PAYMENT_METHODS.map((m) => {
                          const Icon = m.icon;
                          const active = payment === m.id;
                          return (
                            <button
                              key={m.id}
                              onClick={() => setPayment(m.id)}
                              className={cn(
                                "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                                active
                                  ? "border-cookie-400 bg-cookie-100 dark:bg-cookie-900/30"
                                  : "border-cookie-200 dark:border-cookie-500/30 hover:border-cookie-300 dark:hover:border-cookie-500/30 bg-white dark:bg-background-surface",
                              )}
                            >
                              <Icon
                                className={cn(
                                  "w-4 h-4",
                                  active
                                    ? "text-cookie-500"
                                    : "text-chocolate-400 dark:text-caramel",
                                )}
                              />
                              <span
                                className={cn(
                                  "text-[10px] font-bold text-center leading-tight",
                                  active ? "text-chocolate-900 dark:text-vanilla" : "text-chocolate-600 dark:text-caramel",
                                )}
                              >
                                {m.label}
                              </span>
                              {m.fee > 0 && (
                                <span className="text-[9px] text-chocolate-400 dark:text-caramel">
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
                      <p className="text-[10px] uppercase tracking-widest font-bold text-chocolate-500 dark:text-caramel mb-3">
                        Instrucciones adicionales (opcional)
                      </p>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej: Porton azul, timbre 2B, sin llamar..."
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-background-surface border border-cookie-200 dark:border-cookie-500/30 text-chocolate-900 dark:text-vanilla text-sm placeholder-chocolate-400 dark:placeholder-caramel focus:outline-none focus:border-cookie-400 transition-all resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setScreen("delivery-step-0")}
                        className="flex-1 py-3 rounded-xl border border-cookie-200 dark:border-cookie-500/30 text-chocolate-600 dark:text-caramel hover:text-cookie-600 dark:text-cookie-400 hover:border-cookie-400 transition-all text-sm font-bold bg-white dark:bg-background-surface"
                      >
                        Atras
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setScreen("delivery-step-2")}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cookie-500 to-chocolate-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-cookie"
                      >
                        Continuar <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ══ DELIVERY PASO 2: Confirmar ══ */}
                {screen === "delivery-step-2" && (
                  <motion.div
                    key="del-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 space-y-4"
                  >
                    {/* Resumen cards */}
                    {[
                      {
                        label: "Direccion",
                        value: addrText || "—",
                        icon: MapPin,
                        extra: mapsUrl ? "Link de Maps incluido" : undefined,
                      },
                      {
                        label: "Horario",
                        value:
                          SCHEDULES.find((s) => s.id === schedule)?.label ??
                          "—",
                        icon: Clock,
                      },
                      {
                        label: "Pago",
                        value:
                          PAYMENT_METHODS.find((p) => p.id === payment)
                            ?.label ?? "—",
                        icon: CreditCard,
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center gap-3 p-3 rounded-xl bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-200 dark:border-cookie-500/30"
                      >
                        <div className="w-8 h-8 rounded-lg bg-cookie-200 flex items-center justify-center shrink-0">
                          <row.icon className="w-4 h-4 text-cookie-600 dark:text-cookie-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-chocolate-500 dark:text-caramel font-bold">
                            {row.label}
                          </p>
                          <p className="text-sm text-chocolate-900 dark:text-vanilla font-medium truncate">
                            {row.value}
                          </p>
                          {row.extra && (
                            <p className="text-[10px] text-cookie-500 mt-0.5">
                              {row.extra}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Productos + totales */}
                    <div className="p-4 rounded-xl bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-200 dark:border-cookie-500/30 space-y-3">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-chocolate-500 dark:text-caramel mb-1">
                        Productos
                      </p>
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Cookie className="w-3.5 h-3.5 text-cookie-500 shrink-0" />
                            <span className="text-xs text-chocolate-800 dark:text-vanilla truncate max-w-[180px]">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-chocolate-400 dark:text-caramel">
                              x{item.quantity}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-cookie-600 dark:text-cookie-400">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-cookie-200 dark:border-cookie-500/30 space-y-1">
                        <div className="flex justify-between text-xs text-chocolate-500 dark:text-caramel">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-chocolate-500 dark:text-caramel">
                          <span>Envio</span>
                          {freeShip ? (
                            <span className="text-emerald-600 font-bold">
                              GRATIS
                            </span>
                          ) : (
                            <span className="text-cookie-600 dark:text-cookie-400">
                              ${feeState.fee.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {paypalFee > 0 && (
                          <div className="flex justify-between text-xs text-chocolate-500 dark:text-caramel">
                            <span>Comision PayPal</span>
                            <span>$0.50</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-1 border-t border-cookie-200 dark:border-cookie-500/30">
                          <span className="text-sm font-bold text-chocolate-900 dark:text-vanilla">
                            Total
                          </span>
                          <div className="text-right">
                            <span className="font-display text-lg font-black text-cookie-600 dark:text-cookie-400">
                              ${total.toFixed(2)}
                            </span>
                            {bcv && (
                              <p className="text-xs text-cookie-500">
                                Bs. {toBs(total, bcv.usd)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ETA */}
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-sm text-emerald-700 font-bold">
                        Llega en aprox. {feeState.time}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setScreen("delivery-step-1")}
                        className="flex-1 py-3 rounded-xl border border-cookie-200 dark:border-cookie-500/30 text-chocolate-600 dark:text-caramel hover:text-cookie-600 dark:text-cookie-400 hover:border-cookie-400 transition-all text-sm font-bold bg-white dark:bg-background-surface"
                      >
                        Atras
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => sendToWhatsApp("delivery")}
                        className="relative flex-1 py-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-sm flex items-center justify-center gap-2 overflow-hidden shadow-lg"
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
                        <MessageCircle className="w-4 h-4 relative" />
                        <span className="relative">Confirmar pedido</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Modal de eliminar (dentro del checkout) */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteInModal
            addr={deleteTarget}
            onConfirm={async () => {
              await deleteAddress(deleteTarget.id, deleteTarget.label);
              if (selectedSaved === (deleteTarget.id ?? deleteTarget.label)) {
                setSelectedSaved(null);
                setSelectedLatLng(null);
                setAddrText("");
                setFeeState({
                  fee: 3.99,
                  time: "30-40 min",
                  inCoverage: null,
                  zone: null,
                });
              }
              setDeleteTarget(null);
            }}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* Modal de login */}
      <AnimatePresence>
        {showLoginModal && (
          <LoginModal
            onSuccess={() => {
              setShowLoginModal(false);
              setIsAuthenticated(true);
              setScreen("delivery-step-0");
            }}
            onClose={() => setShowLoginModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
