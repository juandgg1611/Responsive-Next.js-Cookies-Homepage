// components/providers/client-providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const isAuthRoute = pathname?.startsWith("/auth/");

  // Páginas que manejan su propio fondo y espaciado
  // (no necesitan pt-32 en main ni mt en footer)
  const isSelfContainedPage =
    pathname === "/products" ||
    pathname === "/delivery" ||
    pathname === "/about" ||
    pathname === "/contact";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {/* Header condicional */}
      {!isAuthRoute && <Header />}

      <main
        className={
          isAuthRoute
            ? "pt-0" // auth: sin padding
            : isSelfContainedPage
              ? "pt-0 bg-transparent" // productos: el header ya tiene su propio spacer
              : "pt-32" // resto: padding normal
        }
      >
        {children}
      </main>

      {/* Footer: sin margen extra en páginas autocontenidas */}
      {!isAuthRoute && (
        <div className={!isSelfContainedPage ? "mt-12 md:mt-16 lg:mt-20" : ""}>
          <Footer />
        </div>
      )}

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
      {!isAuthRoute && showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 left-8 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="Volver arriba"
        >
          ↑
        </button>
      )}
    </ThemeProvider>
  );
}
