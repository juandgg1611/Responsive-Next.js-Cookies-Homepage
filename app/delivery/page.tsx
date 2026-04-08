// app/delivery/page.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Navigation,
  Home,
  Briefcase,
  Building2,
  Star,
  Loader2,
  X,
  WifiOff,
  Map,
  Plus,
  Trash2,
  Edit2,
  Package,
  Sparkles,
  ArrowRight,
  Gift,
  Link2,
  AlertTriangle,
} from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  useAddresses,
  MAX_ADDRESSES,
} from "@/components/providers/address-provider";
import type { SavedAddress } from "@/components/providers/address-provider";
import { MARACAIBO_CENTER, COVERAGE_ZONES } from "@/app/delivery/data";
import type { LatLng, CoverageZone } from "@/app/delivery/data";

// ── Lazy-load mapa ─────────────────────────────────────────────
const DeliveryMap = dynamic(() => import("@/components/delivery/DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-cookie-50 dark:bg-background rounded-3xl border border-cookie-200 dark:border-cookie-500/30">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <Map className="w-10 h-10 text-cookie-500" />
      </motion.div>
      <p className="text-chocolate-500 text-sm mt-3 font-medium tracking-widest uppercase">
        Cargando mapa...
      </p>
    </div>
  ),
});

// ── Iconos de tipo de dirección ────────────────────────────────
const ADDR_ICONS = [
  { id: "home", label: "Casa", Icon: Home },
  { id: "briefcase", label: "Trabajo", Icon: Briefcase },
  { id: "building2", label: "Estudio", Icon: Building2 },
  { id: "star", label: "Otro", Icon: Star },
];

function getIcon(id: string) {
  return ADDR_ICONS.find((a) => a.id === id)?.Icon ?? MapPin;
}

// ── calcFee (sin estado — puro) ────────────────────────────────
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

// ════════════════════════════════════════════════════════════════
// MODAL: Confirmar eliminación
// ════════════════════════════════════════════════════════════════
function DeleteConfirmModal({
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 8 }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        className="relative z-10 w-full max-w-sm bg-gradient-to-br from-cookie-50 to-cookie-100 dark:from-background dark:to-background-dark rounded-3xl border border-cookie-200 dark:border-cookie-500/30 shadow-2xl p-6"
      >
        {/* Icono de alerta */}
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>

        <h3 className="text-lg font-display font-bold text-chocolate-900 dark:text-vanilla text-center mb-2">
          Eliminar direccion
        </h3>
        <p className="text-sm text-chocolate-500 dark:text-caramel text-center mb-1">
          Estas por eliminar:
        </p>

        {/* Tarjeta de la dirección */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-200 dark:border-cookie-500/30 mb-6">
          <div className="w-9 h-9 rounded-lg bg-cookie-200 border border-cookie-300 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-chocolate-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-chocolate-900 dark:text-vanilla">{addr.label}</p>
            <p className="text-xs text-chocolate-500 dark:text-caramel truncate">{addr.address}</p>
          </div>
        </div>

        <p className="text-xs text-chocolate-500 dark:text-caramel text-center mb-5">
          Esta accion no se puede deshacer.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-cookie-200 dark:border-cookie-500/30 text-chocolate-600 dark:text-caramel hover:text-cookie-600 dark:text-cookie-400 hover:border-cookie-400 transition-all text-sm font-bold"
          >
            Cancelar
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MODAL: Éxito al guardar
// ════════════════════════════════════════════════════════════════
function SuccessModal({
  label,
  isEdit,
  onClose,
}: {
  label: string;
  isEdit: boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 24, stiffness: 340 }}
        className="relative z-10 w-full max-w-sm bg-gradient-to-br from-cookie-50 to-cookie-100 dark:from-background dark:to-background-dark rounded-3xl border border-cookie-200 dark:border-cookie-500/30 shadow-2xl p-8 text-center"
      >
        {/* Check animado */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            damping: 16,
            stiffness: 300,
          }}
          className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5"
        >
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </motion.div>

        <h3 className="text-xl font-display font-bold text-chocolate-900 dark:text-vanilla mb-2">
          {isEdit ? "Cambios guardados" : "Direccion guardada"}
        </h3>
        <p className="text-sm text-chocolate-600 dark:text-caramel mb-1">
          <span className="text-cookie-600 dark:text-cookie-400 font-semibold">"{label}"</span>
          {isEdit
            ? " ha sido actualizada."
            : " ha sido agregada a tus favoritos."}
        </p>
        <p className="text-xs text-chocolate-400 dark:text-caramel mb-7">
          Ya estara disponible al finalizar tu proximo pedido.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cookie-500 to-chocolate-600 text-white font-bold shadow-lg"
        >
          Listo
        </motion.button>
      </motion.div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TARJETA DE DIRECCIÓN
// ════════════════════════════════════════════════════════════════
function AddressCard({
  addr,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  addr: SavedAddress;
  onEdit: (a: SavedAddress) => void;
  onDelete: (a: SavedAddress) => void;
  onSetDefault: (a: SavedAddress) => void;
}) {
  const Icon = getIcon(addr.icon);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ type: "spring", damping: 24, stiffness: 300 }}
      className={cn(
        "relative rounded-2xl border p-5 transition-all duration-300 bg-white dark:bg-background-surface shadow-sm",
        addr.is_default
          ? "border-cookie-400"
          : "border-cookie-200 dark:border-cookie-500/30 hover:border-cookie-400",
      )}
    >
      {addr.is_default && (
        <div className="absolute top-4 right-4">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-300 text-[10px] font-black text-cookie-600 dark:text-cookie-400 uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" /> Predeterminada
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
            addr.is_default
              ? "bg-cookie-200 border border-cookie-300"
              : "bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-200 dark:border-cookie-500/30",
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5",
              addr.is_default ? "text-cookie-600 dark:text-cookie-400" : "text-chocolate-500",
            )}
          />
        </div>

        <div className="flex-1 min-w-0 pr-28">
          <p className="font-bold text-chocolate-900 dark:text-vanilla text-base mb-1">{addr.label}</p>
          <p className="text-sm text-chocolate-600 dark:text-caramel leading-snug mb-2">
            {addr.address}
          </p>
          {addr.maps_url && (
            <a
              href={addr.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-cookie-500 hover:text-cookie-700 transition-colors"
            >
              <Link2 className="w-3 h-3" /> Ver en Maps
            </a>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-chocolate-500 dark:text-caramel">
            {addr.zone_name && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {addr.zone_name}
              </span>
            )}
            {addr.estimated_time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {addr.estimated_time}
              </span>
            )}
            {addr.delivery_fee !== undefined && (
              <span className="text-cookie-400 font-semibold">
                Envio ${addr.delivery_fee.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-cookie-200 dark:border-cookie-500/30">
        {!addr.is_default && (
          <button
            onClick={() => onSetDefault(addr)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-200 dark:border-cookie-500/30 text-xs text-chocolate-600 dark:text-caramel hover:text-cookie-600 dark:text-cookie-400 hover:border-cookie-400 transition-all"
          >
            <CheckCircle2 className="w-3 h-3" />
            Predeterminar
          </button>
        )}
        <button
          onClick={() => onEdit(addr)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-200 dark:border-cookie-500/30 text-xs text-chocolate-600 dark:text-caramel hover:text-cookie-600 dark:text-cookie-400 hover:border-cookie-400 transition-all"
        >
          <Edit2 className="w-3 h-3" />
          Editar
        </button>
        <button
          onClick={() => onDelete(addr)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-500 hover:text-red-600 hover:border-red-300 transition-all ml-auto"
        >
          <Trash2 className="w-3 h-3" />
          Eliminar
        </button>
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ════════════════════════════════════════════════════════════════
export default function DeliveryPage() {
  const {
    addresses,
    isLoading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefault,
  } = useAddresses();

  // Modo de vista
  type Mode = "list" | "add" | "edit";
  const [mode, setMode] = useState<Mode>("list");
  const [editingAddr, setEditingAddr] = useState<SavedAddress | null>(null);

  // Modales
  const [deleteTarget, setDeleteTarget] = useState<SavedAddress | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    label: string;
    isEdit: boolean;
  } | null>(null);

  // Estado del formulario de nueva dirección
  const [selectedLatLng, setSelectedLatLng] = useState<LatLng | null>(null);
  const [addrText, setAddrText] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [addrLabel, setAddrLabel] = useState("Casa");
  const [addrIcon, setAddrIcon] = useState("home");
  const [feeState, setFeeState] = useState({
    fee: 3.99,
    time: "30-40 min",
    inCoverage: null as boolean | null,
    zone: null as CoverageZone | null,
  });
  const [mapFlyTo, setMapFlyTo] = useState<LatLng | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Mapa ──────────────────────────────────────────────────
  const handleMapClick = useCallback((latLng: LatLng, addr?: string) => {
    setSelectedLatLng(latLng);
    if (addr) setAddrText(addr);
    setFeeState(calcFeeFromLoc(latLng));
    setLocationError(null);
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
      },
      () => {
        setLocationError(
          "No se pudo obtener la ubicacion. Verifica los permisos.",
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, []);

  // ── Abrir formulario ──────────────────────────────────────
  const openAdd = () => {
    setEditingAddr(null);
    setSelectedLatLng(null);
    setAddrText("");
    setMapsUrl("");
    setAddrLabel("Casa");
    setAddrIcon("home");
    setFeeState({ fee: 3.99, time: "30-40 min", inCoverage: null, zone: null });
    setLocationError(null);
    setMapFlyTo(null);
    setMode("add");
  };

  const openEdit = (addr: SavedAddress) => {
    setEditingAddr(addr);
    const loc = { lat: addr.lat, lng: addr.lng };
    setSelectedLatLng(loc);
    setMapFlyTo(loc);
    setAddrText(addr.address);
    setMapsUrl(addr.maps_url ?? "");
    setAddrLabel(addr.label);
    setAddrIcon(addr.icon);
    setFeeState(calcFeeFromLoc(loc));
    setLocationError(null);
    setMode("edit");
  };

  // ── Guardar ───────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!selectedLatLng || !feeState.inCoverage) return;
    setIsSaving(true);
    setSaveError(null);

    const payload: Omit<SavedAddress, "id"> = {
      label: addrLabel,
      icon: addrIcon,
      address: addrText,
      maps_url: mapsUrl || undefined,
      lat: selectedLatLng.lat,
      lng: selectedLatLng.lng,
      delivery_fee: feeState.fee,
      estimated_time: feeState.time,
      zone_name: feeState.zone?.name,
      is_default: editingAddr?.is_default ?? false,
    };

    if (mode === "edit" && editingAddr?.id) {
      await updateAddress(editingAddr.id, payload);
      setIsSaving(false);
      setMode("list");
      setSuccessInfo({ label: addrLabel, isEdit: true });
    } else {
      const result = await addAddress(payload);
      setIsSaving(false);
      if (!result.ok) {
        if (result.error === "LABEL_EXISTS") {
          setSaveError(
            "Ya tienes una direccion con ese nombre. Usa un nombre diferente.",
          );
        } else if (result.error === "MAX_REACHED") {
          setSaveError("Ya tienes el maximo de 3 direcciones guardadas.");
        } else {
          setSaveError("Error al guardar. Intenta de nuevo.");
        }
        return;
      }
      setMode("list");
      setSuccessInfo({ label: addrLabel, isEdit: false });
    }
  }, [
    selectedLatLng,
    feeState,
    addrLabel,
    addrIcon,
    addrText,
    mapsUrl,
    editingAddr,
    mode,
    addAddress,
    updateAddress,
  ]);

  // ── Eliminar (confirmar) ──────────────────────────────────
  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteAddress(deleteTarget.id, deleteTarget.label);
    setDeleteTarget(null);
  }, [deleteTarget, deleteAddress]);

  const canSave =
    selectedLatLng !== null &&
    feeState.inCoverage === true &&
    addrLabel.trim() !== "";

  return (
    <div className="min-h-screen bg-cookie-50 dark:bg-background overflow-x-hidden">
      {/* Fondo */}
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
            backgroundImage:
              "radial-gradient(circle at 20px 20px, #D4A574 2px, transparent 2px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* HERO */}
      <section className="relative z-10 pt-10 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-300 text-cookie-600 dark:text-cookie-400 text-xs font-black uppercase tracking-[0.3em] mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Mis direcciones · Maracaibo
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-chocolate-900 dark:text-vanilla leading-tight mb-4"
          >
            Guarda tus{" "}
            <span className="bg-gradient-to-r from-cookie-400 to-caramel bg-clip-text text-transparent">
              lugares favoritos
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-chocolate-600 dark:text-caramel text-base max-w-lg mx-auto"
          >
            Registra hasta {MAX_ADDRESSES} direcciones. Al pedir, seleccionas la
            que necesites directamente desde el carrito.
          </motion.p>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {/* ══ LISTA ══ */}
            {mode === "list" && (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-display font-bold text-chocolate-900 dark:text-vanilla">
                      Mis direcciones
                      <span className="ml-3 text-sm font-normal text-chocolate-400">
                        {addresses.length}/{MAX_ADDRESSES}
                      </span>
                    </h2>
                    <p className="text-xs text-chocolate-500 dark:text-caramel mt-0.5">
                      {addresses.length === 0
                        ? "Aun no tienes direcciones guardadas"
                        : "Se usan al finalizar tu pedido desde el carrito"}
                    </p>
                  </div>
                  {addresses.length < MAX_ADDRESSES && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={openAdd}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cookie-500 to-chocolate-600 text-white font-bold text-sm shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      Nueva
                    </motion.button>
                  )}
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-cookie-500 animate-spin" />
                  </div>
                ) : addresses.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-20 text-center"
                  >
                    <div className="w-24 h-24 rounded-3xl bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-200 dark:border-cookie-500/30 flex items-center justify-center mb-6">
                      <MapPin className="w-10 h-10 text-cookie-300" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-chocolate-900 dark:text-vanilla mb-2">
                      Sin direcciones guardadas
                    </h3>
                    <p className="text-sm text-chocolate-500 dark:text-caramel max-w-xs mb-8">
                      Agrega tu casa, trabajo o cualquier lugar al que enviemos
                      tus galletas.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={openAdd}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cookie-500 to-chocolate-600 text-white font-bold shadow-lg"
                    >
                      <Plus className="w-4 h-4" /> Agregar primera direccion
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {addresses.map((addr) => (
                        <AddressCard
                          key={addr.id ?? addr.label}
                          addr={addr}
                          onEdit={openEdit}
                          onDelete={(a) => setDeleteTarget(a)}
                          onSetDefault={(a) => setDefault(a.id, a.label)}
                        />
                      ))}
                    </AnimatePresence>

                    {addresses.length < MAX_ADDRESSES && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={openAdd}
                        className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-cookie-300 hover:border-cookie-400 text-chocolate-400 hover:text-cookie-600 dark:text-cookie-400 transition-all min-h-[180px]"
                      >
                        <Plus className="w-8 h-8" />
                        <span className="text-sm font-bold uppercase tracking-wider">
                          Agregar
                        </span>
                      </motion.button>
                    )}
                  </div>
                )}

                {/* Tip */}
                {addresses.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 p-5 rounded-2xl bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-200 dark:border-cookie-500/30 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cookie-500/15 border border-cookie-500/20 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-cookie-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-chocolate-900 dark:text-vanilla mb-1">
                        Como usar tus direcciones
                      </p>
                      <p className="text-xs text-chocolate-600 dark:text-caramel leading-relaxed">
                        Al presionar{" "}
                        <strong className="text-chocolate-800 dark:text-white">
                          Finalizar pedido
                        </strong>{" "}
                        en el carrito, podras elegir Delivery y seleccionar
                        cualquiera de tus direcciones guardadas.
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ══ FORMULARIO (ADD / EDIT) ══ */}
            {(mode === "add" || mode === "edit") && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setMode("list")}
                    className="w-9 h-9 rounded-xl bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-200 dark:border-cookie-500/30 flex items-center justify-center hover:border-cookie-400 transition-all"
                  >
                    <X className="w-4 h-4 text-chocolate-600 dark:text-caramel" />
                  </button>
                  <div>
                    <h2 className="text-xl font-display font-bold text-chocolate-900 dark:text-vanilla">
                      {mode === "edit"
                        ? `Editar: ${editingAddr?.label}`
                        : "Nueva direccion"}
                    </h2>
                    <p className="text-xs text-chocolate-500 dark:text-caramel mt-0.5">
                      Haz clic en el mapa o usa tu GPS
                    </p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_400px] gap-6">
                  {/* Mapa */}
                  <div className="relative h-[440px] sm:h-[520px] rounded-3xl overflow-hidden border border-cookie-200 dark:border-cookie-500/30 shadow-lg">
                    <DeliveryMap
                      center={MARACAIBO_CENTER}
                      selectedLatLng={selectedLatLng}
                      flyTo={mapFlyTo}
                      coverageZones={COVERAGE_ZONES}
                      onMapClick={handleMapClick}
                      onZoneClick={(z) =>
                        setFeeState((prev) => ({ ...prev, zone: z }))
                      }
                    />
                    <button
                      onClick={handleGeolocate}
                      disabled={isLocating}
                      title="Usar mi ubicacion"
                      className="absolute top-4 right-4 z-[500] w-10 h-10 rounded-xl bg-cookie-50 dark:bg-background/95 border border-cookie-200 dark:border-cookie-500/30 backdrop-blur-sm flex items-center justify-center hover:border-cookie-400 transition-all shadow-md"
                    >
                      {isLocating ? (
                        <Loader2 className="w-4 h-4 text-cookie-500 animate-spin" />
                      ) : (
                        <Navigation className="w-4 h-4 text-cookie-500" />
                      )}
                    </button>
                    <div className="absolute top-4 left-4 z-[500]">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cookie-50 dark:bg-background/95 border border-cookie-200 dark:border-cookie-500/30 backdrop-blur-sm shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-chocolate-600 dark:text-caramel uppercase tracking-widest">
                          {COVERAGE_ZONES.length} zonas activas
                        </span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {feeState.zone && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 12 }}
                          className="absolute bottom-4 left-4 right-4 z-[500] bg-cookie-50 dark:bg-background/98 backdrop-blur-md rounded-2xl border border-cookie-200 dark:border-cookie-500/30 p-4 shadow-xl"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{
                                  background: `${feeState.zone.color}22`,
                                  border: `1.5px solid ${feeState.zone.color}44`,
                                }}
                              >
                                <MapPin
                                  className="w-4 h-4"
                                  style={{ color: feeState.zone.color }}
                                />
                              </div>
                              <div>
                                <p className="text-sm font-black text-chocolate-900 dark:text-vanilla uppercase">
                                  {feeState.zone.name}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-chocolate-500 mt-0.5">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {feeState.zone.time}
                                  </span>
                                  <span className="text-cookie-400 font-bold">
                                    Envio ${feeState.zone.fee.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                setFeeState((p) => ({ ...p, zone: null }))
                              }
                              className="w-6 h-6 rounded-full bg-cookie-100 dark:bg-cookie-900/30 flex items-center justify-center hover:bg-cookie-200"
                            >
                              <X className="w-3 h-3 text-chocolate-500" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Panel de datos */}
                  <div className="flex flex-col gap-5">
                    {/* Nombre y tipo */}
                    <div className="bg-white dark:bg-background-surface border border-cookie-200 dark:border-cookie-500/30 rounded-2xl p-5 space-y-4 shadow-sm">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-chocolate-500 dark:text-caramel">
                        Nombre y tipo
                      </p>
                      <input
                        type="text"
                        value={addrLabel}
                        onChange={(e) => setAddrLabel(e.target.value)}
                        placeholder="Ej: Casa, Trabajo, Universidad..."
                        className="w-full px-4 py-3 rounded-xl bg-cookie-50 dark:bg-background border border-cookie-200 dark:border-cookie-500/30 text-chocolate-900 dark:text-vanilla text-sm placeholder-chocolate-400 focus:outline-none focus:border-cookie-400 transition-all"
                      />
                      <div className="flex gap-2">
                        {ADDR_ICONS.map(({ id, label, Icon }) => (
                          <button
                            key={id}
                            onClick={() => setAddrIcon(id)}
                            title={label}
                            className={cn(
                              "flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all",
                              addrIcon === id
                                ? "bg-cookie-200 border-cookie-400"
                                : "bg-cookie-50 dark:bg-background border-cookie-200 dark:border-cookie-500/30 hover:border-cookie-300",
                            )}
                          >
                            <Icon
                              className={cn(
                                "w-4 h-4",
                                addrIcon === id
                                  ? "text-cookie-600 dark:text-cookie-400"
                                  : "text-chocolate-400",
                              )}
                            />
                            <span
                              className={cn(
                                "text-[9px] font-bold",
                                addrIcon === id
                                  ? "text-cookie-600 dark:text-cookie-400"
                                  : "text-chocolate-400",
                              )}
                            >
                              {label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ubicación */}
                    <div className="bg-white dark:bg-background-surface border border-cookie-200 dark:border-cookie-500/30 rounded-2xl p-5 space-y-3 shadow-sm">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-chocolate-500 dark:text-caramel">
                        Ubicacion
                      </p>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cookie-500" />
                        <input
                          type="text"
                          value={addrText}
                          onChange={(e) => setAddrText(e.target.value)}
                          placeholder="Se llena al hacer clic en el mapa"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-cookie-50 dark:bg-background border border-cookie-200 dark:border-cookie-500/30 text-chocolate-900 dark:text-vanilla text-sm placeholder-chocolate-400 focus:outline-none focus:border-cookie-400 transition-all"
                        />
                      </div>
                      <div className="relative">
                        <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cookie-500" />
                        <input
                          type="text"
                          value={mapsUrl}
                          onChange={(e) => setMapsUrl(e.target.value)}
                          placeholder="Pega tu link de Google Maps (opcional)"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-cookie-50 dark:bg-background border border-cookie-200 dark:border-cookie-500/30 text-chocolate-900 dark:text-vanilla text-sm placeholder-chocolate-400 focus:outline-none focus:border-cookie-400 transition-all"
                        />
                      </div>
                      {mapsUrl && (
                        <p className="text-[11px] text-cookie-500 pl-1">
                          El link se incluira en el WhatsApp para el repartidor.
                        </p>
                      )}
                    </div>

                    {/* GPS error */}
                    <AnimatePresence>
                      {locationError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600"
                        >
                          <WifiOff className="w-3.5 h-3.5 shrink-0" />
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
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                              <div>
                                <p className="text-sm font-bold text-emerald-700">
                                  Zona con cobertura
                                </p>
                                <p className="text-xs text-chocolate-600 dark:text-caramel mt-0.5">
                                  {feeState.time} · Envio{" "}
                                  <span className="text-cookie-600 dark:text-cookie-400 font-bold">
                                    ${feeState.fee.toFixed(2)}
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

                    {/* Botones */}
                    {saveError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                        {saveError}
                      </div>
                    )}

                    <div className="flex gap-3 mt-auto">
                      <button
                        onClick={() => {
                          setMode("list");
                          setSaveError(null);
                        }}
                        className="flex-1 py-3 rounded-xl border border-cookie-200 dark:border-cookie-500/30 text-chocolate-600 dark:text-caramel hover:text-cookie-600 dark:text-cookie-400 hover:border-cookie-400 transition-all text-sm font-bold bg-white dark:bg-background-surface"
                      >
                        Cancelar
                      </button>
                      <motion.button
                        whileHover={{ scale: canSave ? 1.02 : 1 }}
                        whileTap={{ scale: canSave ? 0.97 : 1 }}
                        onClick={handleSave}
                        disabled={!canSave || isSaving}
                        className={cn(
                          "flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                          canSave
                            ? "bg-gradient-to-r from-cookie-500 to-chocolate-600 text-white shadow-cookie"
                            : "bg-cookie-100 dark:bg-cookie-900/30 text-chocolate-400 border border-cookie-200 dark:border-cookie-500/30 cursor-not-allowed",
                        )}
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : mode === "edit" ? (
                          "Guardar cambios"
                        ) : (
                          "Guardar direccion"
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ZONAS */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cookie-100 dark:bg-cookie-900/30 border border-cookie-300 text-cookie-600 dark:text-cookie-400 text-xs font-black uppercase tracking-[0.25em] mb-4"
            >
              <Map className="w-4 h-4" /> Cobertura actual
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl font-bold text-chocolate-900 dark:text-vanilla"
            >
              Zonas de{" "}
              <span className="bg-gradient-to-r from-cookie-400 to-caramel bg-clip-text text-transparent">
                entrega
              </span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {COVERAGE_ZONES.map((zone, i) => (
              <motion.div
                key={zone.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white dark:bg-background-surface border border-cookie-200 dark:border-cookie-500/30 shadow-sm"
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
                  <p className="text-xs font-black text-chocolate-900 dark:text-vanilla uppercase tracking-tight mb-1">
                    {zone.name}
                  </p>
                  <p className="text-[10px] text-chocolate-500 dark:text-caramel mb-1">
                    {zone.time}
                  </p>
                  <p
                    className="text-[10px] font-bold"
                    style={{ color: zone.color }}
                  >
                    Envio ${zone.fee.toFixed(2)}
                  </p>
                  <p className="text-[9px] text-chocolate-400 dark:text-caramel/70 mt-0.5">
                    Min. {zone.minOrder}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cookie-100 to-cookie-200 dark:from-background-surface dark:to-background border border-cookie-300 dark:border-cookie-700"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cookie-400/30 to-transparent" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-10">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-cookie-600 dark:text-cookie-400 animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-cookie-600 dark:text-cookie-400">
                    Oferta de bienvenida
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-chocolate-900 dark:text-vanilla mb-2">
                  Primer pedido con{" "}
                  <span className="bg-gradient-to-r from-chocolate-600 to-chocolate-400 bg-clip-text text-transparent">
                    20% OFF
                  </span>
                </h3>
                <p className="text-xs text-chocolate-600 dark:text-caramel max-w-xs">
                  Registrate y recibe envio gratis en tu primera compra.
                </p>
              </div>
              <Link href="/auth/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2.5 px-7 py-4 bg-gradient-to-r from-cookie-500 to-chocolate-600 text-white font-black rounded-2xl shadow-lg cursor-pointer uppercase tracking-wide text-xs whitespace-nowrap"
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

      {/* ══ MODALES ══ */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            addr={deleteTarget}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successInfo && (
          <SuccessModal
            label={successInfo.label}
            isEdit={successInfo.isEdit}
            onClose={() => setSuccessInfo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
