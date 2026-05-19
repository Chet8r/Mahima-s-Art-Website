"use client";

import Link from "next/link";
import { useState } from "react";
import { CartDrawer } from "./cart-drawer";
import { useCart } from "@/lib/cart/cart-context";

const navLinks = [
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [cartOpen, setCartOpen] = useState(false);
  const { count, ready } = useCart();
  // Only show the badge after hydration, so SSR (count=0) and client first
  // paint match — avoids the badge popping in.
  const itemCount = ready ? count : 0;

  return (
    <>
      <header className="border-b border-line bg-cream/90 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-2xl sm:text-3xl text-navy tracking-tight"
          >
            Mahi <span className="italic text-navy-soft">Art</span>
          </Link>
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-[0.18em] text-navy hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open basket${
                itemCount > 0 ? ` (${itemCount} items)` : ""
              }`}
              className="relative inline-flex items-center justify-center w-11 h-11 text-navy hover:text-gold transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
                <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none" />
                <path d="M3 4h2.4l2.2 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.55L20.8 8H6.2" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] px-1 inline-flex items-center justify-center rounded-full bg-gold text-navy text-[10px] font-medium">
                  {itemCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
