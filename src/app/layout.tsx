import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Mahi Art — Original Oil Paintings",
    template: "%s — Mahi Art",
  },
  description:
    "Original oil paintings by Mahi. Hand-painted, one-of-a-kind artworks available for purchase.",
};

// Runs synchronously before paint so the saved admin theme is applied on
// reload — no flash. Inert on public pages (no .admin-dark styles read).
// Lives in <head> here (rather than inside the admin layout) because
// rendering a <script> inside a layout body triggers React 19 warnings
// on client-side navigation.
const themeBootScript = `(function(){try{var t=localStorage.getItem('mahi-admin-theme');if(t==='dark')document.documentElement.classList.add('admin-dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
