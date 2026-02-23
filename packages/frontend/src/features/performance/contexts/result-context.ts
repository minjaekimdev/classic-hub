import type { DetailPerformance } from "@classic-hub/shared/types/client";
import type { QueryObserverResult } from "@tanstack/react-query";
import { createContext, useContext } from "react";

interface ResultContextType {
  allPerformances: DetailPerformance[] | undefined;
  filteredPerformances: DetailPerformance[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<QueryObserverResult>;
}

export const ResultContext = createContext<ResultContextType | null>(null);

export const useResult = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error("useResult should be used within a ModalProvider.");
  }
  return context;
};
