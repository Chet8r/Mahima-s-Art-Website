import Link from "next/link";
import Script from "next/script";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { isSessionTokenValid, SESSION_COOKIE_NAME } from "@/lib/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Runs synchronously before React paints so the saved theme is applied
// immediately on reload — no flash of light mode for dark-mode users.
const themeBootScript = `
(function(){try{
  var t = localStorage.getItem('mahi-admin-theme');
  if (t === 'dark') document.documentElement.classList.add('admin-dark');
}catch(e){}})();`;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const signedIn = isSessionTokenValid(token);

  return (
    <>
      <Script id="admin-theme-boot" strategy="beforeInteractive">
        {themeBootScript}
      </Script>
      <div
        className={`admin-scope ${inter.variable} min-h-screen flex flex-col bg-cream-soft`}
      >
        <header className="border-b border-line bg-cream">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 h-16 flex items-center justify-between">
            <Link
              href="/admin"
              className="font-display text-xl text-navy tracking-tight"
            >
              Mahi<span className="italic text-navy-soft">Art</span>
              <span className="ml-3 text-xs uppercase tracking-[0.22em] text-gold">
                Admin
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/"
                target="_blank"
                className="text-xs uppercase tracking-[0.18em] text-navy hover:text-gold transition-colors"
              >
                View site
              </Link>
              {signedIn && <SignOutButton />}
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
