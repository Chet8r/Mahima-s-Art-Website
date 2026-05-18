"use client";

import { useEffect } from "react";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping basket"
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-cream shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-6 sm:px-8 h-20 border-b border-line">
          <p className="font-display text-2xl text-navy">Your basket</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close basket"
            className="w-9 h-9 inline-flex items-center justify-center text-navy hover:text-gold transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-12">
          <div className="flex flex-col items-center text-center py-16">
            <div className="w-16 h-16 rounded-full bg-cream-soft inline-flex items-center justify-center mb-6">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-8 h-8 text-navy"
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
            </div>
            <p className="font-display text-xl text-navy">
              Your basket is empty
            </p>
            <p className="mt-2 text-sm text-muted max-w-xs">
              Browse the collection and add a piece you love.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 inline-flex items-center justify-center h-11 px-6 border border-navy text-navy text-xs uppercase tracking-[0.18em] hover:bg-navy hover:text-cream transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        </div>

        <footer className="border-t border-line bg-cream-soft px-6 sm:px-8 py-6">
          <div className="flex items-baseline justify-between mb-4 text-sm">
            <span className="uppercase tracking-[0.18em] text-muted">
              Subtotal
            </span>
            <span className="text-navy">£0</span>
          </div>
          <button
            type="button"
            disabled
            title="Checkout will be wired up in a later step"
            className="w-full h-12 bg-navy text-cream text-sm uppercase tracking-[0.18em] hover:bg-navy-deep transition-colors disabled:opacity-60 cursor-not-allowed"
          >
            Checkout
          </button>
          <p className="mt-3 text-[11px] text-muted text-center">
            Shipping calculated at checkout.
          </p>
        </footer>
      </aside>
    </>
  );
}
