import { useContext } from "react";
import { DetailContext } from "./DetailContext";

export const useDetail = () => {
  const context = useContext(DetailContext);

  if (!context) {
    throw new Error("useDetail must be used within a DetailContext.Provider");
  }

  return context;
};
