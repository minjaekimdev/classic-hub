import type {  ResultPerformance } from "@classic-hub/shared/types/client";
import type { QueryObserverResult } from "@tanstack/react-query";
import { createContext, useContext } from "react";

interface ResultContextType {
  allPerformances: ResultPerformance[] | undefined;
  isLoading: boolean;
  isError: boolean;
  keyword: string | null;
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
