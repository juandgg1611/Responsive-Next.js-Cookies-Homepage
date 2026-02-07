"use client";

import React from "react";
import { ThemeProvider } from "./theme-provider";
import { CartProvider } from "./cart-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  );
}
