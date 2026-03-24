"use client";
// components/providers/cart-provider.tsx
// Carrito con doble estrategia:
//   - Autenticado:  operaciones directas con Supabase client (respeta RLS)
//   - Anónimo:      operaciones via /api/cart (service role, cookie HttpOnly)
// Al hacer login: merge automático del carrito anónimo → autenticado

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { createClient } from "@/lib/supabase/client";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────
export interface CartItem {
  id: string; // product_id
  name: string;
  price: number;
  image: string;
  badge?: string;
  quantity: number;
  maxQuantity: number;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  shipping: number;
  totalPrice: number;
}

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5;

// ─────────────────────────────────────────────
// Helpers: mapear rows de Supabase → CartItem
// ─────────────────────────────────────────────
function rowToCartItem(row: Record<string, unknown>): CartItem {
  return {
    id: row.product_id as string,
    name: row.name as string,
    price: Number(row.price),
    image: (row.image as string) || "",
    badge: (row.badge as string) || undefined,
    quantity: row.quantity as number,
    maxQuantity: (row.max_quantity as number) || 10,
  };
}

// ─────────────────────────────────────────────
// Contexto
// ─────────────────────────────────────────────
const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authListenerReady = useRef(false);

  // ── Cargar carrito autenticado desde Supabase ──────────────
  const loadAuthCart = useCallback(
    async (userId: string) => {
      // Obtener o crear carrito del usuario
      let { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (!cart) {
        const { data: newCart } = await supabase
          .from("carts")
          .insert({ user_id: userId })
          .select("id")
          .single();
        cart = newCart;
      }

      if (!cart) return;

      setCartId(cart.id);

      const { data: rows } = await supabase
        .from("cart_items")
        .select("*")
        .eq("cart_id", cart.id)
        .order("created_at");

      setItems((rows ?? []).map(rowToCartItem));
    },
    [supabase],
  );

  // ── Cargar carrito anónimo desde /api/cart ─────────────────
  const loadAnonCart = useCallback(async () => {
    const res = await fetch("/api/cart");
    if (!res.ok) return;
    const data = await res.json();
    setCartId(data.cartId);
    setItems((data.items ?? []).map(rowToCartItem));
  }, []);

  // ── Inicialización ─────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setIsAuthenticated(true);
          await loadAuthCart(user.id);
        } else {
          setIsAuthenticated(false);
          await loadAnonCart();
        }
      } catch (err) {
        console.error("[Cart] init error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Listener de cambios de auth ────────────────────────────
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Ignorar el primer evento que dispara al montar (ya lo manejamos en init)
      if (!authListenerReady.current) {
        authListenerReady.current = true;
        return;
      }

      if (event === "SIGNED_IN" && session?.user) {
        setIsLoading(true);
        try {
          // Hacer merge del carrito anónimo (si existe) al autenticado
          await supabase.rpc("merge_anonymous_cart", {
            p_session_id:
              document.cookie
                .split("; ")
                .find((c) => c.startsWith("nyc_session_id="))
                ?.split("=")[1] ?? "",
            p_user_id: session.user.id,
          });

          setIsAuthenticated(true);
          await loadAuthCart(session.user.id);
        } finally {
          setIsLoading(false);
        }
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setCartId(null);
        setItems([]);
        // Cargar carrito anónimo (puede estar vacío o tener la cookie vieja)
        await loadAnonCart();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, loadAuthCart, loadAnonCart]);

  // ─────────────────────────────────────────────
  // Acciones — autenticado (Supabase directo)
  // ─────────────────────────────────────────────

  const addItemAuth = useCallback(
    async (item: Omit<CartItem, "quantity">) => {
      if (!cartId) return;

      const existing = items.find((i) => i.id === item.id);
      const newQty = existing
        ? Math.min(existing.quantity + 1, item.maxQuantity)
        : 1;

      // Optimistic
      setItems((prev) =>
        existing
          ? prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i))
          : [...prev, { ...item, quantity: 1 }],
      );

      if (existing) {
        await supabase
          .from("cart_items")
          .update({ quantity: newQty })
          .eq("cart_id", cartId)
          .eq("product_id", item.id);
      } else {
        await supabase.from("cart_items").insert({
          cart_id: cartId,
          product_id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          badge: item.badge ?? null,
          quantity: 1,
          max_quantity: item.maxQuantity,
        });
      }
    },
    [cartId, items, supabase],
  );

  const removeItemAuth = useCallback(
    async (productId: string) => {
      if (!cartId) return;
      setItems((prev) => prev.filter((i) => i.id !== productId));
      await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cartId)
        .eq("product_id", productId);
    },
    [cartId, supabase],
  );

  const updateQuantityAuth = useCallback(
    async (productId: string, qty: number) => {
      if (!cartId) return;
      if (qty <= 0) {
        await removeItemAuth(productId);
        return;
      }

      const maxQty = items.find((i) => i.id === productId)?.maxQuantity ?? 10;
      const clamped = Math.min(qty, maxQty);

      setItems((prev) =>
        prev.map((i) => (i.id === productId ? { ...i, quantity: clamped } : i)),
      );
      await supabase
        .from("cart_items")
        .update({ quantity: clamped })
        .eq("cart_id", cartId)
        .eq("product_id", productId);
    },
    [cartId, items, supabase, removeItemAuth],
  );

  const clearCartAuth = useCallback(async () => {
    if (!cartId) return;
    setItems([]);
    await supabase.from("cart_items").delete().eq("cart_id", cartId);
  }, [cartId, supabase]);

  // ─────────────────────────────────────────────
  // Acciones — anónimo (via /api/cart)
  // ─────────────────────────────────────────────

  const addItemAnon = useCallback(
    async (item: Omit<CartItem, "quantity">) => {
      const existing = items.find((i) => i.id === item.id);

      // Optimistic
      setItems((prev) =>
        existing
          ? prev.map((i) =>
              i.id === item.id
                ? { ...i, quantity: Math.min(i.quantity + 1, i.maxQuantity) }
                : i,
            )
          : [...prev, { ...item, quantity: 1 }],
      );

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          badge: item.badge,
          max_quantity: item.maxQuantity,
        }),
      });

      if (!res.ok) {
        // Revertir
        await loadAnonCart();
      } else {
        const data = await res.json();
        if (data.cartId && !cartId) setCartId(data.cartId);
      }
    },
    [items, cartId, loadAnonCart],
  );

  const removeItemAnon = useCallback(async (productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, quantity: 0 }),
    });
  }, []);

  const updateQuantityAnon = useCallback(
    async (productId: string, qty: number) => {
      if (qty <= 0) {
        await removeItemAnon(productId);
        return;
      }
      const maxQty = items.find((i) => i.id === productId)?.maxQuantity ?? 10;
      const clamped = Math.min(qty, maxQty);

      setItems((prev) =>
        prev.map((i) => (i.id === productId ? { ...i, quantity: clamped } : i)),
      );
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity: clamped }),
      });
    },
    [items, removeItemAnon],
  );

  const clearCartAnon = useCallback(async () => {
    setItems([]);
    await fetch("/api/cart", { method: "DELETE" });
  }, []);

  // ─────────────────────────────────────────────
  // Dispatch según estado de auth
  // ─────────────────────────────────────────────
  const addItem = isAuthenticated ? addItemAuth : addItemAnon;
  const removeItem = isAuthenticated ? removeItemAuth : removeItemAnon;
  const updateQuantity = isAuthenticated
    ? updateQuantityAuth
    : updateQuantityAnon;
  const clearCart = isAuthenticated ? clearCartAuth : clearCartAnon;

  // ─────────────────────────────────────────────
  // Cálculos
  // ─────────────────────────────────────────────
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const totalPrice = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        isLoading,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((p) => !p),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
