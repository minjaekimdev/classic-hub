/**
 * 모바일: 하단 바텀시트 / 데스크톱(md+): 중앙 모달로 렌더링되는 공용 다이얼로그 셸.
 * Escape와 배경 클릭으로 닫히고, 열려 있는 동안 본문 스크롤을 잠근다.
 *
 * ⚠️ createPortal(document.body)로 렌더링한다 — 카드(hover:translate-y 등 transform 조상)나
 *    헤더(backdrop-blur 조상)의 stacking context·containing block에 갇히면
 *    fixed overlay가 헤더/카드 영역에만 적용되거나 본문에 가려진다(실제 발생한 버그).
 *    portal로 분리하면 어떤 조상 아래에서 열려도 뷰포트 전체를 덮는다.
 *
 * z-index 규칙: overlay는 헤더(SiteHeader, z-100)보다 위에 있어야 하므로 z-[110]을 사용한다.
 *   (z-60이던 시절 헤더가 overlay를 뚫고 나오던 버그 — 실제 발생)
 *
 * mobileFullHeight: 모바일 바텀시트를 92vh로 고정한다(목록형 시트용 — 내용이 적어도 시트가
 *   낮아지지 않게 함). 시트 내용은 flex-col(flex-none 헤더 + flex-1 스크롤 영역) 구성을 전제로 한다.
 *
 * fixedChrome: 헤더/푸터를 고정하고 본문만 스크롤한다(높이는 내용을 따름). 모든 브레이크포인트에서
 *   flex-col을 유지하므로 데스크톱 모달도 동일하게 동작한다.
 *   자식에 flex-none(헤더/푸터)·min-h-0 grow overflow-y-auto(본문) 구성을 전제로 한다.
 */
"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ResponsiveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** 접근성 라벨 (dialog 설명) */
  ariaLabel: string;
  /** md+ 모달의 최대 폭 등 컨테이너 클래스 (예: "md:max-w-[700px]") */
  containerClassName?: string;
  /** 모바일 바텀시트 높이를 최대(92vh)로 고정 — 내용이 적어도 시트가 줄어들지 않는다 (md+ 모달은 무시) */
  mobileFullHeight?: boolean;
  /** 헤더/푸터(flex-none) 고정 + 본문(스크롤) 레이아웃 — 모든 브레이크포인트에서 flex-col을 유지한다 */
  fixedChrome?: boolean;
  children: ReactNode;
}

export default function ResponsiveDialog({
  isOpen,
  onClose,
  ariaLabel,
  containerClassName = "",
  mobileFullHeight = false,
  fixedChrome = false,
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

  // SSR/hydration 안전: 닫혀 있으면 아무것도 렌더링하지 않는다 (portal 생성 시점에 document 필요)
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex flex-col justify-end bg-[rgba(13,23,40,0.55)] backdrop-blur-[4px] md:items-center md:justify-center md:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(event) => event.stopPropagation()}
        className={[
          mobileFullHeight ? "flex h-[92vh] flex-col md:block md:h-auto" : "",
          fixedChrome ? "flex flex-col" : "",
          "max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border-t border-outline-variant bg-surface-container-lowest shadow-[0_18px_60px_rgba(13,23,40,0.35)] md:max-h-[86vh] md:rounded-lg md:border",
          containerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
