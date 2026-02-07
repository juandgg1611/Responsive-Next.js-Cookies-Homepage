// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/providers/client-providers";

// Configuración de fuentes
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
});

export const metadata: Metadata = {
  title: "Vian Cookies | Galletas Artesanales Premium",
  description:
    "Galletas artesanales premium horneadas con ingredientes naturales.",
  keywords: ["galletas artesanales", "galletas premium", "chocolate chip"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} ${dancingScript.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-gray-950 text-white min-h-screen">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
