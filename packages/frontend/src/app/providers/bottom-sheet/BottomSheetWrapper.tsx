import { useEffect } from "react";
import { useBottomSheet } from "./useBottomSheet";

export const BottomSheetWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { closeBottomSheet } = useBottomSheet();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  });

  return (
    <div
      className="fixed inset-0 z-(--z-modal-overlay) bg-black/50 transition-opacity"
      onClick={closeBottomSheet}
    >
      {/* 기본 레이아웃, 배경색, 스타일 등 담당(실제 콘텐츠 관련 스타일은 상세 바텀시트 컴포넌트에서 구현 */}
      <div className="fixed right-0 bottom-0 left-0 max-h-[90vh] z-(--z-modal) translate-y-0 transform rounded-t-2xl bg-white shadow-xl transition-transform duration-300">
        {children}
      </div>
    </div>
  );
};
