// components/providers/client-providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react"; // 1. Importamos hooks necesarios

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith("/auth/");

  // 2. Lógica de Scroll convertida a React (Más seguro y rápido)
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar botón si bajamos más de 300px
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system" // 3. Cambiado a 'system' para detectar preferencia del usuario
      enableSystem
      disableTransitionOnChange
    >
      {/* Header condicional */}
      {!isAuthRoute && <Header />}

      {/* Main con tu espaciado original */}
      <main 
        className={`min-h-screen bg-background text-foreground transition-colors duration-500 ${
          !isAuthRoute ? "pt-32" : "pt-0"
        }`}
      >
        {children}
      </main>

      {/* Footer condicional con espaciado superior */}
      {!isAuthRoute && (
        <div className="mt-12 md:mt-16 lg:mt-20">
          <Footer />
        </div>
      )}

      {/* Toaster: Limpio y moderno (se adapta solo al tema) */}
      <Toaster
        position="top-right"
        richColors // Usa colores semánticos (verde/rojo) automáticos
        closeButton
      />

      {/* Botón scroll to top - Estilo actualizado a la nueva marca */}
      {!isAuthRoute && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full 
            bg-gradient-to-r from-cookie-500 to-chocolate-500 text-white 
            flex items-center justify-center shadow-lg shadow-cookie/30
            hover:scale-110 hover:shadow-cookie/50 transition-all duration-300
            ${showScrollTop ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-10 pointer-events-none"}
          `}
          id="scroll-to-top"
          aria-label="Volver arriba"
        >
          {/* Icono SVG limpio en lugar de caracter de texto */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>
      )}
      
      {/* Ya no necesitas la etiqueta <script> aquí */}
    </ThemeProvider>
  );
}