"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2 rounded-full transition-all duration-300 ease-in-out
                 hover:scale-110 active:scale-95 focus:outline-none
                 /* MODO DÍA: Fondo transparente, Icono Chocolate */
                 text-chocolate-900 hover:bg-chocolate-100
                 /* MODO NOCHE: Fondo transparente, Icono Amarillo */
                 dark:text-cookie-400 dark:hover:text-cookie-300 dark:hover:bg-white/10"
      aria-label="Cambiar tema"
    >
      {/* Sol (Visible en oscuro) */}
      <Sun 
        className={`w-6 h-6 transition-all duration-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          ${theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}
        `} 
      />
      
      {/* Luna (Visible en claro) */}
      <Moon 
        className={`w-6 h-6 transition-all duration-500 
          ${theme === "dark" ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}
        `} 
      />
    </button>
  );
}