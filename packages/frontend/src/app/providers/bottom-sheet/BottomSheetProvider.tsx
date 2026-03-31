import { useState, type ReactNode, Suspense } from "react";
import { BottomSheetContext } from "./useBottomSheet";
import type { BottomSheetType, BottomSheetPropsMap } from "./types";
import { BOTTOM_SHEET_COMPONENTS } from "./bottomSheetRegistry";

export const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const [bottomSheetState, setBottomSheetState] = useState<{
    type: BottomSheetType;
    props: any;
  } | null>(null);

  const openBottomSheet = <K extends BottomSheetType>(
    type: K,
    props: BottomSheetPropsMap[K],
  ) => {
    setBottomSheetState({ type, props });
  };

  const closeBottomSheet = () => setBottomSheetState(null);

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
      {children}
      {bottomSheetState && (
        <Suspense fallback={null}>
          {/* 현재 활성화된 모달 렌더링 */}
          {(() => {
            const SelectedBottomSheet =
              BOTTOM_SHEET_COMPONENTS[bottomSheetState.type];
            return (
              <SelectedBottomSheet
                {...bottomSheetState.props}
                onClose={closeBottomSheet}
              />
            );
          })()}
        </Suspense>
      )}
    </BottomSheetContext.Provider>
  );
};
