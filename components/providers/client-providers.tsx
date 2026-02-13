// components/providers/client-providers.tsx - VERSIÓN CON ESPACIADO CORRECTO
"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { usePathname } from "next/navigation";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith("/auth/");

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {/* Header condicional */}
      {!isAuthRoute && <Header />}

      {/*
       */}
      <main className={!isAuthRoute ? "pt-32" : "pt-0"}>{children}</main>

      {/* Footer condicional con espaciado superior */}
      {!isAuthRoute && (
        <div className="mt-12 md:mt-16 lg:mt-20">
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
      {!isAuthRoute && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 left-8 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform opacity-0"
          id="scroll-to-top"
          aria-label="Volver arriba"
        >
          ↑
        </button>
      )}

      {/* Script para scroll button */}
      {!isAuthRoute && (
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
      )}
    </ThemeProvider>
  );
}
