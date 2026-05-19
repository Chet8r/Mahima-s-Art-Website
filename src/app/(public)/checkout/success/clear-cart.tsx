"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart/cart-context";

/**
 * Clears the local cart on successful checkout. We wait until the cart
 * provider has hydrated from localStorage before clearing — otherwise
 * the clear() call can race with hydration and the stored items get
 * written straight back on the next render.
 */
export function ClearCartOnMount() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (!ready) return;
    clear();
  }, [clear, ready]);
  return null;
}
