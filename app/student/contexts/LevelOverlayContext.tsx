"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type LevelOverlayContextType = {
  isOverlayOpen: boolean;
  setOverlayOpen: (open: boolean) => void;
};

const LevelOverlayContext = createContext<LevelOverlayContextType | undefined>(
  undefined
);

export function LevelOverlayProvider({ children }: { children: ReactNode }) {
  const [isOverlayOpen, setOverlayOpen] = useState(false);

  return (
    <LevelOverlayContext.Provider value={{ isOverlayOpen, setOverlayOpen }}>
      {children}
    </LevelOverlayContext.Provider>
  );
}

export function useLevelOverlay() {
  const context = useContext(LevelOverlayContext);
  if (context === undefined) {
    throw new Error("useLevelOverlay must be used within a LevelOverlayProvider");
  }
  return context;
}





