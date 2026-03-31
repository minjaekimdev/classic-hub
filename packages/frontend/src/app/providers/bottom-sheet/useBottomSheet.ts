// src/shared/lib/modal/useModal.ts
import { createContext, useContext } from "react";
import type { BottomSheetPropsMap, BottomSheetType } from "./types";

interface BottomSheetContextType {
  // K extends ModalType을 통해 키에 맞는 props만 허용
  openBottomSheet: <K extends BottomSheetType>(
    type: K,
    props: BottomSheetPropsMap[K],
  ) => void;
  closeBottomSheet: () => void;
}

export const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) throw new Error("useBottomSheet must be used within ModalProvider");
  return context;
};
