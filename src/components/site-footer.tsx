import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-navy text-cream">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <Link
            href="/admin"
            aria-label="Admin"
            className="font-display text-xl hover:text-gold transition-colors"
          >
            Mahi <span className="italic text-gold-soft">Art</span>
          </Link>
          <p className="text-xs text-cream/60 hidden sm:block">
            Original paintings, hand-painted in-house.
          </p>
        </div>
        <a
          href="https://www.tiktok.com/@patel_mahii"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow Mahi on TikTok"
          className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.18em] text-cream/80 hover:text-gold transition-colors group"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black border border-cream/20 group-hover:border-gold transition-colors">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4">
              <path
                d="M16.6 5.82c-1.04-.68-1.79-1.77-2.04-3.04A4.95 4.95 0 0 1 14.48 2H11.2v13.27a2.83 2.83 0 0 1-2.83 2.78 2.83 2.83 0 0 1-2.83-2.83 2.83 2.83 0 0 1 3.5-2.75v-3.33a6.16 6.16 0 0 0-.67-.04A6.16 6.16 0 0 0 2.2 15.25a6.16 6.16 0 0 0 6.17 6.17 6.16 6.16 0 0 0 6.17-6.17V9.05a8.21 8.21 0 0 0 4.83 1.55V7.27a4.92 4.92 0 0 1-2.77-1.45z"
                fill="#25F4EE"
                transform="translate(-1.2 0.6)"
              />
              <path
                d="M16.6 5.82c-1.04-.68-1.79-1.77-2.04-3.04A4.95 4.95 0 0 1 14.48 2H11.2v13.27a2.83 2.83 0 0 1-2.83 2.78 2.83 2.83 0 0 1-2.83-2.83 2.83 2.83 0 0 1 3.5-2.75v-3.33a6.16 6.16 0 0 0-.67-.04A6.16 6.16 0 0 0 2.2 15.25a6.16 6.16 0 0 0 6.17 6.17 6.16 6.16 0 0 0 6.17-6.17V9.05a8.21 8.21 0 0 0 4.83 1.55V7.27a4.92 4.92 0 0 1-2.77-1.45z"
                fill="#FE2C55"
                transform="translate(1.2 -0.6)"
              />
              <path
                d="M16.6 5.82c-1.04-.68-1.79-1.77-2.04-3.04A4.95 4.95 0 0 1 14.48 2H11.2v13.27a2.83 2.83 0 0 1-2.83 2.78 2.83 2.83 0 0 1-2.83-2.83 2.83 2.83 0 0 1 3.5-2.75v-3.33a6.16 6.16 0 0 0-.67-.04A6.16 6.16 0 0 0 2.2 15.25a6.16 6.16 0 0 0 6.17 6.17 6.16 6.16 0 0 0 6.17-6.17V9.05a8.21 8.21 0 0 0 4.83 1.55V7.27a4.92 4.92 0 0 1-2.77-1.45z"
                fill="#FFFFFF"
              />
            </svg>
          </span>
          <span>TikTok</span>
        </a>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-cream/60">
          <span>© {new Date().getFullYear()} Mahi Art. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="hover:text-gold transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-gold transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
