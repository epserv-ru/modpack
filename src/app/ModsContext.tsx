'use client';
import React, { createContext, useContext } from "react";
import { useMods, UseModsReturn } from "@/app/hooks/useMods.ts";

const ModsContext = createContext<UseModsReturn | undefined>(undefined);

export function ModsProvider({ children } : { children: React.ReactNode }) {
  const modsData = useMods()

  return (
    <ModsContext.Provider value={modsData}>
      {children}
    </ModsContext.Provider>
  );
}

export function useModsContext() {
  const context = useContext(ModsContext);
  if (context === undefined) {
    throw new Error('useModsContext must be used within a ModsProvider');
  }
  return context;
}