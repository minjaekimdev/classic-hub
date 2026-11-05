/**
 * specs/home.md 구현 정책
 * - view-001: 데스크톱 전용 보기 모드 선택 ui(앨범형/리스트형), 기본값은 '리스트형'
 * - view-003: 모바일에서는 노출하지 않는다
 *   (디자인: prototype/홈페이지 수정안 toolbar — border 세그먼트, 활성 navy)
 */
import Icon from "@/components/Icon";
import type { ViewMode } from "@/types/concert";

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

const VIEW_OPTIONS: { value: ViewMode; label: string; icon: string }[] = [
  { value: "list", label: "리스트형", icon: "view_list" },
  { value: "album", label: "앨범형", icon: "grid_view" },
];

/** 보기 모드(앨범형/리스트형) 전환 세그먼트 버튼 — 데스크톱에서만 노출된다 (specs view-001/003) */
export default function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <div
      role="group"
      aria-label="보기 모드 선택"
      className="hidden items-center overflow-hidden rounded-md border border-outline-variant lg:flex"
    >
      {VIEW_OPTIONS.map((option, index) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`inline-flex items-center gap-1.5 px-[13px] py-[7px] text-[12px] font-semibold transition-colors ${
              isActive ? "bg-primary text-white" : "bg-white text-on-surface-variant hover:text-primary"
            } ${index > 0 ? "border-l border-outline-variant" : ""}`}
          >
            <Icon name={option.icon} size={13} />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
