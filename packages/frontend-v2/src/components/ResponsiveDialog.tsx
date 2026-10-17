"use client";

import { useEffect, type ReactNode } from "react";

interface ResponsiveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** 접근성 라벨 (dialog 설명) */
  ariaLabel: string;
  /** md+ 모달의 최대 폭 등 컨테이너 클래스 (예: "md:max-w-[700px]") */
  containerClassName?: string;
  children: ReactNode;
}

/**
 * 모바일: 하단 바텀시트 / 데스크톱(md+): 중앙 모달로 렌더링되는 공용 다이얼로그 셸.
 * Escape와 배경 클릭으로 닫히고, 열려 있는 동안 본문 스크롤을 잠근다.
 */
export default function ResponsiveDialog({
  isOpen,
  onClose,
  ariaLabel,
  containerClassName = "",
  children,
}: ResponsiveDialogProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-primary/45 backdrop-blur-[4px] md:items-center md:justify-center md:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(event) => event.stopPropagation()}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border-t border-outline-variant bg-surface-container-lowest shadow-[0_12px_40px_-8px_rgba(5,14,26,0.18)] md:max-h-[86vh] md:rounded md:border ${containerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
