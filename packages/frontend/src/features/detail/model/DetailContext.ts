import { createContext } from "react";
import type { DetailPerformance } from "@classic-hub/shared/types/performance";

export const DetailContext = createContext<DetailPerformance | null>(null);
