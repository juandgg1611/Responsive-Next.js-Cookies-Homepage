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

const DeliveryMap = dynamic(() => import("@/components/delivery/DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a0f0a] rounded-2xl border border-[#3A2318]">
      <Loader2 className="w-8 h-8 text-cookie-400 animate-spin mb-2" />
      <p className="text-caramel/50 text-xs uppercase tracking-widest">
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
                      ? "bg-transparent border-cookie-400 text-cookie-400"
                      : "bg-transparent border-[#3A2318] text-[#5D3A2B]",
                )}
              >
                {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[9px] font-bold uppercase tracking-wider whitespace-nowrap",
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
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1 mx-1 mb-4 transition-all",
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
        className="absolute inset-0 bg-black/70"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        className="relative z-10 w-full max-w-xs bg-gradient-to-br from-[#3A2318] to-[#2C1810] rounded-3xl border border-[#4A2F20] shadow-2xl p-6"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-950/40 border border-red-800/30 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-base font-display font-bold text-vanilla text-center mb-1">
          Eliminar direccion
        </h3>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#2C1810]/60 border border-[#4A2F20] my-4">
          <div className="w-8 h-8 rounded-lg bg-[#3A2318] border border-[#4A2F20] flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-caramel/50" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-vanilla">{addr.label}</p>
            <p className="text-xs text-caramel/40 truncate">{addr.address}</p>
          </div>
        </div>
        <p className="text-xs text-caramel/40 text-center mb-5">
          Esta accion no se puede deshacer.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-[#4A2F20] text-caramel/60 hover:text-cookie-400 text-sm font-bold transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" /> Eliminar
          </button>
        </div>
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
  // Usar el provider compartido — misma fuente que delivery page
  const { addresses, addAddress, deleteAddress } = useAddresses();

  type Screen =
    | "method"
    | "delivery-step-0"
    | "delivery-step-1"
    | "delivery-step-2";
  const [screen, setScreen] = useState<Screen>("method");

  // Seleccion de direccion guardada
  const [selectedSaved, setSelectedSaved] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SavedAddress | null>(null);

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

  // Guardar nueva desde el modal
  const [saveNew, setSaveNew] = useState(false);
  const [newLabel, setNewLabel] = useState("Casa");
  const [newIcon, setNewIcon] = useState("home");
  const [isSavingNew, setIsSavingNew] = useState(false);
  const [saveNewError, setSaveNewError] = useState<string | null>(null);

  // Paso 1
  const [schedule, setSchedule] = useState("asap");
  const [payment, setPayment] = useState("cash");
  const [notes, setNotes] = useState("");

  // Cerrar dropdown al hacer clic fuera
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

  // Reset al abrir
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

  // Preseleccionar default al abrir delivery
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
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative z-10 w-full sm:max-w-2xl lg:max-w-3xl bg-gradient-to-br from-[#3A2318] to-[#2C1810] rounded-t-3xl sm:rounded-3xl border border-[#4A2F20] shadow-2xl flex flex-col"
            style={{ maxHeight: "92vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#4A2F20]/50 flex-shrink-0">
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
                    className="w-8 h-8 rounded-full bg-[#4A2F20]/50 flex items-center justify-center hover:bg-[#4A2F20] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-caramel" />
                  </button>
                )}
                <div>
                  <h2 className="text-xl font-display font-bold text-vanilla">
                    {screen === "method" && "Finalizar pedido"}
                    {screen === "delivery-step-0" && "Direccion de entrega"}
                    {screen === "delivery-step-1" && "Horario y pago"}
                    {screen === "delivery-step-2" && "Confirmar pedido"}
                  </h2>
                  {screen.startsWith("delivery") && (
                    <p className="text-xs text-caramel/40 mt-0.5">
                      Delivery · Maracaibo
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#4A2F20]/50 flex items-center justify-center hover:bg-[#4A2F20] transition-colors"
              >
                <X className="w-4 h-4 text-caramel" />
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
                    <div className="sm:col-span-2 rounded-xl bg-[#2C1810]/60 border border-[#4A2F20]/50 p-4">
                      <p className="text-[10px] font-bold text-caramel/40 uppercase tracking-widest mb-3">
                        Tu pedido
                      </p>
                      <div className="space-y-1.5">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-caramel/70 truncate mr-2">
                              {item.name}{" "}
                              <span className="text-caramel/40">
                                x{item.quantity}
                              </span>
                            </span>
                            <span className="text-vanilla font-semibold flex-shrink-0">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#4A2F20]/40">
                          <span className="text-vanilla">Subtotal</span>
                          <span className="text-cookie-400">
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
                      className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-[#2C1810] border-2 border-[#4A2F20] hover:border-cookie-500/60 transition-all group text-center"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-cookie-500/15 border border-cookie-500/20 flex items-center justify-center group-hover:bg-cookie-500/25 transition-colors">
                        <Package className="w-7 h-7 text-cookie-400" />
                      </div>
                      <div>
                        <p className="font-bold text-vanilla text-base mb-1">
                          Pick Up
                        </p>
                        <p className="text-xs text-caramel/50">
                          Retiras en nuestra cocina
                        </p>
                        <p className="text-xs text-emerald-400 font-semibold mt-2">
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
                      onClick={() => setScreen("delivery-step-0")}
                      className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-[#2C1810] border-2 border-[#4A2F20] hover:border-cookie-500/60 transition-all group text-center"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-cookie-500/15 border border-cookie-500/20 flex items-center justify-center group-hover:bg-cookie-500/25 transition-colors">
                        <Truck className="w-7 h-7 text-cookie-400" />
                      </div>
                      <div>
                        <p className="font-bold text-vanilla text-base mb-1">
                          Delivery
                        </p>
                        {addresses.length > 0 ? (
                          <>
                            <p className="text-xs text-caramel/50 truncate max-w-[180px] mx-auto">
                              {addresses.find((a) => a.is_default)?.address ??
                                addresses[0]?.address}
                            </p>
                            <p className="text-xs text-cookie-400 font-semibold mt-1">
                              {addresses.length} direccion
                              {addresses.length > 1 ? "es" : ""} guardada
                              {addresses.length > 1 ? "s" : ""}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-caramel/50">
                            Configura tu direccion
                          </p>
                        )}
                      </div>
                      <div className="w-full py-2.5 rounded-xl border-2 border-cookie-500/40 text-cookie-400 font-bold text-sm flex items-center justify-center gap-2">
                        Configurar entrega <ChevronRight className="w-4 h-4" />
                      </div>
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
                        <p className="text-[10px] uppercase tracking-widest font-bold text-caramel/30 mb-2">
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
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#2C1810] border border-[#4A2F20] hover:border-cookie-500/50 transition-all text-left"
                          >
                            {selAddr ? (
                              (() => {
                                const Icon = getIcon(selAddr.icon);
                                return (
                                  <>
                                    <Icon className="w-4 h-4 text-cookie-400 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-vanilla">
                                        {selAddr.label}
                                      </p>
                                      <p className="text-xs text-caramel/50 truncate">
                                        {selAddr.address}
                                      </p>
                                    </div>
                                  </>
                                );
                              })()
                            ) : (
                              <>
                                <MapPin className="w-4 h-4 text-caramel/40 shrink-0" />
                                <span className="text-sm text-caramel/50 flex-1">
                                  Selecciona una direccion guardada
                                </span>
                              </>
                            )}
                            <ChevronDown
                              className={cn(
                                "w-4 h-4 text-caramel/40 flex-shrink-0 transition-transform",
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
                                className="bg-[#2C1810] border border-[#4A2F20] rounded-xl overflow-hidden shadow-2xl"
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
                                            ? "bg-cookie-500/10"
                                            : "hover:bg-[#3A2318]",
                                        )}
                                      >
                                        <Icon
                                          className={cn(
                                            "w-4 h-4 shrink-0",
                                            isActive
                                              ? "text-cookie-400"
                                              : "text-caramel/40",
                                          )}
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p
                                            className={cn(
                                              "text-sm font-bold",
                                              isActive
                                                ? "text-vanilla"
                                                : "text-caramel/70",
                                            )}
                                          >
                                            {addr.label}
                                          </p>
                                          <p className="text-xs text-caramel/40 truncate">
                                            {addr.address}
                                          </p>
                                          {addr.estimated_time && (
                                            <p className="text-[10px] text-cookie-400/60 mt-0.5">
                                              {addr.estimated_time} · $
                                              {addr.delivery_fee?.toFixed(2)}
                                            </p>
                                          )}
                                        </div>
                                        {isActive && (
                                          <CheckCircle2 className="w-4 h-4 text-cookie-400 shrink-0" />
                                        )}
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDeleteTarget(addr);
                                          setShowDropdown(false);
                                        }}
                                        className="px-3 py-3 text-caramel/20 hover:text-red-400 transition-colors opacity-0 group-hover/item:opacity-100"
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
                      <div className="flex-1 h-px bg-[#3A2318]" />
                      <span className="text-[10px] text-caramel/30 uppercase tracking-widest font-bold">
                        {addresses.length > 0
                          ? "O usa el mapa"
                          : "Selecciona en el mapa"}
                      </span>
                      <div className="flex-1 h-px bg-[#3A2318]" />
                    </div>

                    {/* Mapa */}
                    <div className="relative h-72 rounded-2xl overflow-hidden border border-[#4A2F20]">
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
                        className="absolute top-3 right-3 z-[500] w-10 h-10 rounded-xl bg-[#2C1810]/90 border border-[#4A2F20] backdrop-blur-sm flex items-center justify-center hover:border-cookie-500 transition-all shadow-lg"
                      >
                        {isLocating ? (
                          <Loader2 className="w-4 h-4 text-cookie-400 animate-spin" />
                        ) : (
                          <Navigation className="w-4 h-4 text-cookie-400" />
                        )}
                      </button>
                      <div className="absolute top-3 left-3 z-[500]">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#2C1810]/90 border border-[#3A2318] backdrop-blur-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-bold text-caramel/60 uppercase tracking-widest">
                            {COVERAGE_ZONES.length} zonas
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cookie-700" />
                      <input
                        type="text"
                        value={addrText}
                        onChange={(e) => setAddrText(e.target.value)}
                        placeholder="Direccion (se llena al tocar el mapa)"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#2C1810] border border-[#4A2F20] text-vanilla text-sm placeholder-caramel/30 focus:outline-none focus:border-cookie-500/60 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cookie-700" />
                      <input
                        type="text"
                        value={mapsUrl}
                        onChange={(e) => setMapsUrl(e.target.value)}
                        placeholder="Pega tu link de Google Maps (opcional)"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#2C1810] border border-[#4A2F20] text-vanilla text-sm placeholder-caramel/30 focus:outline-none focus:border-cookie-500/60 transition-all"
                      />
                    </div>
                    {mapsUrl && (
                      <p className="text-[11px] text-cookie-400/70 -mt-3 pl-1">
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
                          className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-800/30 text-xs text-red-400"
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
                              ? "bg-emerald-950/30 border-emerald-800/30"
                              : "bg-red-950/30 border-red-800/30",
                          )}
                        >
                          {feeState.inCoverage ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                              <div>
                                <p className="text-sm font-bold text-emerald-400">
                                  Zona con cobertura
                                </p>
                                <p className="text-xs text-caramel/50 mt-0.5">
                                  {feeState.time} · Envio{" "}
                                  <span className="text-cookie-400 font-bold">
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
                              <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                              <div>
                                <p className="text-sm font-bold text-red-400">
                                  Fuera de cobertura
                                </p>
                                <p className="text-xs text-caramel/50 mt-0.5">
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
                      <div className="rounded-xl border border-[#4A2F20] overflow-hidden">
                        <button
                          onClick={() => setSaveNew(!saveNew)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#3A2318]/50 transition-colors text-left"
                        >
                          <Plus
                            className={cn(
                              "w-4 h-4",
                              saveNew ? "text-cookie-400" : "text-caramel/40",
                            )}
                          />
                          <span className="text-sm text-caramel/70 flex-1">
                            Guardar como favorita
                          </span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 text-caramel/30 transition-transform",
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
                              className="px-4 pb-4 space-y-3 border-t border-[#4A2F20]/50"
                            >
                              <div className="pt-3">
                                <p className="text-[10px] uppercase tracking-widest text-caramel/30 font-bold mb-2">
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
                                    className="flex-1 px-3 py-2 rounded-xl bg-[#2C1810] border border-[#4A2F20] text-vanilla text-sm placeholder-caramel/30 focus:outline-none focus:border-cookie-500/60 transition-all"
                                  />
                                  <div className="flex gap-1">
                                    {ADDR_ICONS.map(({ id, Icon }) => (
                                      <button
                                        key={id}
                                        onClick={() => setNewIcon(id)}
                                        className={cn(
                                          "w-9 h-9 rounded-lg flex items-center justify-center border transition-all",
                                          newIcon === id
                                            ? "bg-cookie-500/20 border-cookie-500/50"
                                            : "bg-[#2C1810] border-[#4A2F20] hover:border-[#5D3A2B]",
                                        )}
                                      >
                                        <Icon
                                          className={cn(
                                            "w-4 h-4",
                                            newIcon === id
                                              ? "text-cookie-400"
                                              : "text-caramel/40",
                                          )}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {saveNewError && (
                                <p className="text-xs text-red-400 bg-red-950/30 border border-red-800/30 rounded-lg px-3 py-2">
                                  {saveNewError}
                                </p>
                              )}
                              <button
                                onClick={handleSaveNewAddress}
                                disabled={isSavingNew || !newLabel.trim()}
                                className="w-full py-2.5 rounded-xl bg-cookie-500/20 border border-cookie-500/30 text-cookie-400 font-bold text-sm hover:bg-cookie-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
                          ? "bg-gradient-to-r from-cookie-500 to-chocolate-600 text-white shadow-[0_8px_30px_rgba(139,69,19,0.3)]"
                          : "bg-[#3A2318]/50 text-[#5D3A2B] border border-[#3A2318] cursor-not-allowed",
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
                      <p className="text-[10px] uppercase tracking-widest font-bold text-caramel/30 mb-3 flex items-center gap-2">
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
                                  ? "border-cookie-500/50 bg-cookie-500/10"
                                  : "border-[#3A2318] hover:border-[#4A2F20] bg-[#2C1810]/40",
                              )}
                            >
                              <span
                                className={cn(
                                  "text-xs font-bold",
                                  active ? "text-vanilla" : "text-caramel/60",
                                )}
                              >
                                {sch.label}
                              </span>
                              <span
                                className={cn(
                                  "text-[10px] font-bold",
                                  active ? "text-cookie-400" : "text-[#5D3A2B]",
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
                                  active ? "text-vanilla" : "text-caramel/50",
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
                        Instrucciones adicionales (opcional)
                      </p>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej: Porton azul, timbre 2B, sin llamar..."
                        className="w-full px-4 py-3 rounded-xl bg-[#2C1810] border border-[#3A2318] text-vanilla text-sm placeholder-caramel/25 focus:outline-none focus:border-cookie-500/50 transition-all resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setScreen("delivery-step-0")}
                        className="flex-1 py-3 rounded-xl border border-[#4A2F20] text-caramel/60 hover:text-cookie-400 hover:border-cookie-500/40 transition-all text-sm font-bold"
                      >
                        Atras
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setScreen("delivery-step-2")}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cookie-500 to-chocolate-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(139,69,19,0.3)]"
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
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#2C1810]/60 border border-[#3A2318]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-cookie-500/15 flex items-center justify-center shrink-0">
                          <row.icon className="w-4 h-4 text-cookie-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-caramel/30 font-bold">
                            {row.label}
                          </p>
                          <p className="text-sm text-vanilla font-medium truncate">
                            {row.value}
                          </p>
                          {row.extra && (
                            <p className="text-[10px] text-cookie-400/60 mt-0.5">
                              {row.extra}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Productos + totales */}
                    <div className="p-4 rounded-xl bg-[#2C1810]/60 border border-[#3A2318] space-y-3">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-caramel/30 mb-1">
                        Productos
                      </p>
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Cookie className="w-3.5 h-3.5 text-cookie-700 shrink-0" />
                            <span className="text-xs text-vanilla/80 truncate max-w-[180px]">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-caramel/40">
                              x{item.quantity}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-cookie-400">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-[#3A2318] space-y-1">
                        <div className="flex justify-between text-xs text-caramel/50">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-caramel/50">
                          <span>Envio</span>
                          {freeShip ? (
                            <span className="text-emerald-400 font-bold">
                              GRATIS
                            </span>
                          ) : (
                            <span className="text-cookie-400">
                              ${feeState.fee.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {paypalFee > 0 && (
                          <div className="flex justify-between text-xs text-caramel/50">
                            <span>Comision PayPal</span>
                            <span>$0.50</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-1 border-t border-[#3A2318]">
                          <span className="text-sm font-bold text-vanilla">
                            Total
                          </span>
                          <div className="text-right">
                            <span className="font-display text-lg font-black text-cookie-400">
                              ${total.toFixed(2)}
                            </span>
                            {bcv && (
                              <p className="text-xs text-cookie-400/60">
                                Bs. {toBs(total, bcv.usd)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ETA */}
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-800/30">
                      <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-sm text-emerald-400 font-bold">
                        Llega en aprox. {feeState.time}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setScreen("delivery-step-1")}
                        className="flex-1 py-3 rounded-xl border border-[#4A2F20] text-caramel/60 hover:text-cookie-400 hover:border-cookie-500/40 transition-all text-sm font-bold"
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
    </>
  );
}
