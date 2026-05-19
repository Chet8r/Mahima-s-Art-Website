"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "./types";

const STORAGE_KEY = "mahi-cart-v1";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalPence: number;
  isInCart: (id: string) => boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  // True after we've read localStorage — used to avoid hydration flicker
  // on the cart badge (which would otherwise jump from 0 → N on mount).
  ready: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStored(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i) =>
        i &&
        typeof i.id === "string" &&
        typeof i.slug === "string" &&
        typeof i.title === "string" &&
        typeof i.imageUrl === "string" &&
        typeof i.pricePence === "number"
    );
  } catch {
    return [];
  }
}

function writeStored(items: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota / private browsing — non-fatal.
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    setItems(readStored());
    setReady(true);
  }, []);

  // Persist on change (after initial hydrate).
  useEffect(() => {
    if (!ready) return;
    writeStored(items);
  }, [items, ready]);

  // Sync across tabs.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      setItems(readStored());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback((item: CartItem) => {
    setItems((current) => {
      if (current.some((i) => i.id === item.id)) return current;
      return [...current, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      subtotalPence: items.reduce((sum, i) => sum + i.pricePence, 0),
      isInCart: (id) => items.some((i) => i.id === id),
      addItem,
      removeItem,
      clear,
      ready,
    }),
    [items, addItem, removeItem, clear, ready]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>.");
  }
  return ctx;
}
