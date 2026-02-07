// components/providers/client-providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CartProvider } from "./cart-provider";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <CartProvider>
        {/* Header */}
        <Header />

        {/* Contenido principal */}
        <main className="pt-24">
          {" "}
          {/* Ajusta según la altura de tu header */}
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Toaster */}
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid #333",
              borderRadius: "8px",
            },
          }}
        />

        {/* Botón scroll to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform opacity-0"
          id="scroll-to-top"
          aria-label="Volver arriba"
        >
          ↑
        </button>

        {/* Script para scroll button */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const scrollButton = document.getElementById('scroll-to-top');
              const updateButton = () => {
                if (window.scrollY > 300) {
                  scrollButton.style.opacity = '1';
                  scrollButton.style.pointerEvents = 'auto';
                } else {
                  scrollButton.style.opacity = '0';
                  scrollButton.style.pointerEvents = 'none';
                }
              };
              window.addEventListener('scroll', updateButton);
              updateButton();
            });
          `,
          }}
        />
      </CartProvider>
    </ThemeProvider>
  );
}
