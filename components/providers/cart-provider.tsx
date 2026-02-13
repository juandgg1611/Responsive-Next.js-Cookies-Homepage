// components/providers/cart-provider.tsx - VERSIÓN CORREGIDA
"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  maxQuantity?: number;
  badge?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number; // ← AGREGADO
  totalPrice: number; // ← AGREGADO
  subtotal: number; // ← AGREGADO
  shipping: number; // ← AGREGADO
  discount: number; // ← AGREGADO
  isCartOpen: boolean;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discount] = useState(0);
  const shipping = 4.99;
  const freeShippingThreshold = 50;

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("vian-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem("vian-cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.id === item.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + (item.quantity || 1);

          toast.success("✓ Cantidad actualizada", {
            description: `${item.name} - Ahora tienes ${newQuantity} unidades`,
            icon: "🛒",
            duration: 2000,
          });

          return prevItems.map((i) =>
            i.id === item.id ? { ...i, quantity: newQuantity } : i,
          );
        } else {
          toast.success("🍪 ¡Añadido al carrito!", {
            description: `${item.name} se ha agregado a tu pedido`,
            icon: "🎁",
            duration: 2000,
          });

          return [
            ...prevItems,
            {
              ...item,
              quantity: item.quantity || 1,
            },
          ];
        }
      });
    },
    [],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prevItems) => {
      const item = prevItems.find((i) => i.id === id);
      if (item) {
        toast.info("🗑️ Producto eliminado", {
          description: `${item.name} se ha removido del carrito`,
          duration: 2000,
        });
      }
      return prevItems.filter((i) => i.id !== id);
    });
  }, []);

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(id);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(quantity, item.maxQuantity || 10) }
            : item,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    toast.info("🛒 Carrito vaciado", {
      description: "Todos los productos han sido removidos",
      duration: 2000,
    });
  }, []);

  // CALCULAR VALORES DERIVADOS
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalPrice =
    subtotal + (subtotal > freeShippingThreshold ? 0 : shipping) - discount;

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems, // ← AHORA ESTÁN DEFINIDOS
        totalPrice, // ← AHORA ESTÁN DEFINIDOS
        subtotal, // ← AHORA ESTÁN DEFINIDOS
        shipping, // ← AHORA ESTÁN DEFINIDOS
        discount, // ← AHORA ESTÁN DEFINIDOS
        isCartOpen,
        toggleCart,
        closeCart,
        openCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
