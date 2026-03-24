"use client";
// components/providers/address-provider.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { createClient } from "@/lib/supabase/client";

// ── Tipos ──────────────────────────────────────────────────────
export interface SavedAddress {
  id?: string;
  label: string;
  icon: string;
  address: string;
  maps_url?: string;
  lat: number;
  lng: number;
  delivery_fee?: number;
  estimated_time?: string;
  zone_name?: string;
  is_default?: boolean;
}

export type AddressError = "MAX_REACHED" | "LABEL_EXISTS" | "DB_ERROR" | null;

interface AddressContextType {
  addresses: SavedAddress[];
  isLoading: boolean;
  userId: string | null;
  addAddress: (
    addr: Omit<SavedAddress, "id">,
  ) => Promise<{ ok: boolean; error: AddressError; data: SavedAddress | null }>;
  updateAddress: (id: string, patch: Partial<SavedAddress>) => Promise<void>;
  deleteAddress: (id: string | undefined, label: string) => Promise<void>;
  setDefault: (id: string | undefined, label: string) => Promise<void>;
}

export const MAX_ADDRESSES = 3;
const ANON_KEY = "nyc_delivery_config";

const AddressContext = createContext<AddressContextType | null>(null);

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Refs síncronos — evitan stale closures en callbacks
  const addressesRef = useRef<SavedAddress[]>([]);
  const userIdRef = useRef<string | null>(null);
  const loadedRef = useRef(false);

  // Wrapper que mantiene ref y estado sincronizados
  const setAddressesSync = useCallback(
    (updater: SavedAddress[] | ((prev: SavedAddress[]) => SavedAddress[])) => {
      setAddresses((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        addressesRef.current = next;
        return next;
      });
    },
    [],
  );

  const persistAnon = useCallback((list: SavedAddress[]) => {
    if (!userIdRef.current) {
      try {
        localStorage.setItem(ANON_KEY, JSON.stringify(list));
      } catch {}
    }
  }, []);

  // ── Cargar desde Supabase ──────────────────────────────────
  const loadFromSupabase = useCallback(
    async (uid: string) => {
      const { data, error } = await supabase
        .from("saved_addresses")
        .select(
          "id, label, icon, address, maps_url, lat, lng, delivery_fee, estimated_time, zone_name, is_default",
        )
        .eq("user_id", uid)
        .order("created_at", { ascending: true })
        .limit(10);

      if (!error && data) {
        setAddressesSync(data as SavedAddress[]);
      }
    },
    [supabase, setAddressesSync],
  );

  // ── Inicialización ─────────────────────────────────────────
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const init = async () => {
      setIsLoading(true);

      // Mostrar localStorage inmediatamente (para usuarios anónimos o mientras carga)
      try {
        const raw = localStorage.getItem(ANON_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const local: SavedAddress[] = Array.isArray(parsed)
            ? parsed
            : [parsed];
          setAddressesSync(local);
        }
      } catch {}

      // Verificar sesión sin network call (desde cookie)
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.warn("[AddressProvider] getSession error:", error.message);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          userIdRef.current = session.user.id;
          setUserId(session.user.id);
          await loadFromSupabase(session.user.id);
        }
      } catch (e) {
        console.warn("[AddressProvider] init error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cambios de auth ────────────────────────────────────────
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        userIdRef.current = session.user.id;
        setUserId(session.user.id);
        await loadFromSupabase(session.user.id);
      } else if (event === "SIGNED_OUT") {
        userIdRef.current = null;
        setUserId(null);
        try {
          const raw = localStorage.getItem(ANON_KEY);
          setAddressesSync(raw ? JSON.parse(raw) : []);
        } catch {
          setAddressesSync([]);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase, loadFromSupabase, setAddressesSync]);

  // ── AGREGAR ────────────────────────────────────────────────
  const addAddress = useCallback(
    async (addr: Omit<SavedAddress, "id">) => {
      const current = addressesRef.current;
      const uid = userIdRef.current;

      // Validar límite
      if (current.length >= MAX_ADDRESSES) {
        return { ok: false, error: "MAX_REACHED" as AddressError, data: null };
      }

      // Validar label duplicado localmente (sin hacer query)
      const labelExists = current.some(
        (a) => a.label.trim().toLowerCase() === addr.label.trim().toLowerCase(),
      );
      if (labelExists) {
        return { ok: false, error: "LABEL_EXISTS" as AddressError, data: null };
      }

      const isFirst = current.length === 0;
      const payload: Omit<SavedAddress, "id"> = {
        ...addr,
        label: addr.label.trim(),
        is_default: isFirst,
      };

      if (uid) {
        // 1. Optimistic update inmediato
        const tempId = `temp-${Date.now()}`;
        const optimistic: SavedAddress = { ...payload, id: tempId };
        setAddressesSync((prev) => [...prev, optimistic]);

        // 2. Insert en Supabase
        const { data, error } = await supabase
          .from("saved_addresses")
          .insert({ ...payload, user_id: uid })
          .select(
            "id, label, icon, address, maps_url, lat, lng, delivery_fee, estimated_time, zone_name, is_default",
          )
          .single();

        if (error || !data) {
          // Revertir optimistic
          setAddressesSync((prev) => prev.filter((a) => a.id !== tempId));
          console.error(
            "[Addresses] insert error:",
            error?.message,
            error?.code,
            error?.details,
          );
          return { ok: false, error: "DB_ERROR" as AddressError, data: null };
        }

        // 3. Reemplazar temp con el real
        setAddressesSync((prev) =>
          prev.map((a) => (a.id === tempId ? (data as SavedAddress) : a)),
        );
        return { ok: true, error: null, data: data as SavedAddress };
      } else {
        // Anónimo: solo localStorage
        const newAddr: SavedAddress = { ...payload, id: `local-${Date.now()}` };
        setAddressesSync((prev) => {
          const updated = [...prev, newAddr];
          persistAnon(updated);
          return updated;
        });
        return { ok: true, error: null, data: newAddr };
      }
    },
    [supabase, setAddressesSync, persistAnon],
  );

  // ── ACTUALIZAR ─────────────────────────────────────────────
  const updateAddress = useCallback(
    async (id: string, patch: Partial<SavedAddress>) => {
      setAddressesSync((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      );
      const uid = userIdRef.current;
      if (uid && !id.startsWith("local-")) {
        const { error } = await supabase
          .from("saved_addresses")
          .update(patch)
          .eq("id", id);
        if (error) {
          console.error("[Addresses] update error:", error.message);
        }
      } else {
        persistAnon(addressesRef.current);
      }
    },
    [supabase, setAddressesSync, persistAnon],
  );

  // ── ELIMINAR ───────────────────────────────────────────────
  const deleteAddress = useCallback(
    async (id: string | undefined, label: string) => {
      const key = id ?? label;
      setAddressesSync((prev) => {
        const updated = prev.filter((a) => (a.id ?? a.label) !== key);
        persistAnon(updated);
        return updated;
      });
      const uid = userIdRef.current;
      if (uid && id && !id.startsWith("local-")) {
        await supabase.from("saved_addresses").delete().eq("id", id);
      }
    },
    [supabase, setAddressesSync, persistAnon],
  );

  // ── DEFAULT ────────────────────────────────────────────────
  const setDefault = useCallback(
    async (id: string | undefined, label: string) => {
      const key = id ?? label;
      setAddressesSync((prev) => {
        const updated = prev.map((a) => ({
          ...a,
          is_default: (a.id ?? a.label) === key,
        }));
        persistAnon(updated);
        return updated;
      });
      const uid = userIdRef.current;
      if (uid) {
        await supabase
          .from("saved_addresses")
          .update({ is_default: false })
          .eq("user_id", uid);
        if (id && !id.startsWith("local-")) {
          await supabase
            .from("saved_addresses")
            .update({ is_default: true })
            .eq("id", id);
        }
      }
    },
    [supabase, setAddressesSync, persistAnon],
  );

  return (
    <AddressContext.Provider
      value={{
        addresses,
        isLoading,
        userId,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefault,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  const ctx = useContext(AddressContext);
  if (!ctx)
    throw new Error("useAddresses debe usarse dentro de <AddressProvider>");
  return ctx;
}
