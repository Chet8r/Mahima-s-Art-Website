import Link from "next/link";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-cream/90 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl sm:text-3xl text-navy tracking-tight"
        >
          Mahi Patel <span className="italic text-navy-soft">Art</span>
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
        </nav>
      </div>
    </header>
  );
}
