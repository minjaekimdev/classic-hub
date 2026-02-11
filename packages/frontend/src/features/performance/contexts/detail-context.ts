import type { DetailPerformance } from "@classic-hub/shared/types/client";
import { createContext, useContext } from "react";

export const DetailContext = createContext<DetailPerformance | null>(null);

export const useDetail = () => {
  const context = useContext(DetailContext);

  if (!context) {
    throw new Error("useDetail must be used within a DetailContext.Provider");
  }

  return context;
};
