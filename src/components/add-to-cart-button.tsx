"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import type { CartItem } from "@/lib/cart/types";

type Props = {
  item: CartItem;
};

export function AddToCartButton({ item }: Props) {
  const { addItem, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = isInCart(item.id);

  function onClick() {
    if (inCart) return;
    addItem(item);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  }

  const label = inCart || justAdded ? "Added to basket" : "Add to Cart";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={inCart}
      aria-live="polite"
      className="inline-flex items-center justify-center h-11 px-7 bg-navy text-cream text-xs uppercase tracking-[0.18em] hover:bg-navy-deep transition-colors disabled:opacity-90 disabled:cursor-default"
    >
      {label}
    </button>
  );
}
