// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/providers/client-providers";
import { ChatbotProvider } from "@/components/providers/chatbot-provider";
import ChatButton from "@/components/chatbot/ChatButton";
import ChatWindow from "@/components/chatbot/ChatWindow";
import CartSidebar from "@/components/cart/CartSidebar";
import { CartProvider } from "@/components/providers/cart-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

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
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${dancingScript.variable}`}
    >
      <body>
        <ThemeProvider>
          <CartProvider>
            <ClientProviders>{children}</ClientProviders>
            <CartSidebar />
            <ChatbotProvider>
              <ChatWindow />
              <ChatButton />
            </ChatbotProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
