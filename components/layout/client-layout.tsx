// components/layout/client-layout.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ReactNode } from "react";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid #333",
          },
        }}
      />

      {/* Navigation placeholder */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold text-amber-400">Vian Cookies</div>
          <div className="flex gap-6">
            <a href="#home" className="hover:text-amber-400">
              Inicio
            </a>
            <a href="#products" className="hover:text-amber-400">
              Productos
            </a>
            <a href="#about" className="hover:text-amber-400">
              Nosotros
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-20">{children}</main>

      {/* Footer placeholder */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Vian Cookies. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </ThemeProvider>
  );
}
