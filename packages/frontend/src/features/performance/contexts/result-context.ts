import type { DetailPerformance } from "@classic-hub/shared/types/client";
import { createContext, useContext } from "react";

export const ResultContext = createContext<DetailPerformance[] | null>(null);

export const useResult = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error("useResult should be used within a ModalProvider.");
  }
  return context;
};
