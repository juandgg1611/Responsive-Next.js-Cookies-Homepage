"use client";

import { createContext, useContext, ReactNode } from "react";

interface AnimationContextType {
  isAnimationsEnabled: boolean;
  toggleAnimations: () => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined,
);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const isAnimationsEnabled = true; // Podría ser controlado por user preference

  const toggleAnimations = () => {
    // Implementar lógica para toggle de animaciones
  };

  return (
    <AnimationContext.Provider
      value={{ isAnimationsEnabled, toggleAnimations }}
    >
      {children}
    </AnimationContext.Provider>
  );
}

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
};
