import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-navy text-cream">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 py-14 grid gap-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl">
            Mahi Patel <span className="italic text-gold-soft">Art</span>
          </p>
          <p className="mt-3 text-sm text-cream/70 max-w-xs">
            Original oil paintings, hand-painted in the studio. Each piece is
            one of a kind.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">
            Explore
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-gold transition-colors">
                Shop all works
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-gold transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">
            Studio
          </p>
          <p className="text-sm text-cream/70">
            For commissions, exhibitions and press enquiries, please get in
            touch.
          </p>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 py-5 flex items-center justify-between text-xs text-cream/60">
          <span>© {new Date().getFullYear()} Mahi Patel. All rights reserved.</span>
          <span>Made with care.</span>
        </div>
      </div>
    </footer>
  );
}
