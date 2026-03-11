// components/layout/client-layout.tsx
"use client";

import { Toaster } from "sonner";
import { ReactNode } from "react";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "!bg-background-surface !text-vanilla !border !border-border-light",
        }}
      />
      {children}
    </>
  );
}
