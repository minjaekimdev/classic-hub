/**
 * specs/home.md 구현 정책
 * - search-003: 정렬 옵션 3가지('공연임박순', '낮은가격순', '높은가격순'),
 *   트리거 영역 클릭 시 옵션 ui가 하단에 표시되고 트리거와 우측 모서리 정렬(right-0)
 *   (디자인: prototype/홈페이지 수정안 toolbar)
 */
import { useRef, useState } from "react";
import Icon from "@/components/Icon";
import useDismiss from "@/lib/useDismiss";
import type { SortBy } from "@/types/concert";

interface SortSelectProps {
  value: SortBy;
  onChange: (value: SortBy) => void;
}

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "imminent", label: "공연임박순" },
  { value: "price_asc", label: "낮은가격순" },
  { value: "price_desc", label: "높은가격순" },
];

const labelFor = (value: SortBy): string =>
  SORT_OPTIONS.find((option) => option.value === value)?.label ?? SORT_OPTIONS[0].label;

export default function SortSelect({ value, onChange }: SortSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useDismiss(isOpen, containerRef, () => setIsOpen(false));

  const handleSelect = (option: SortBy) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div
      className="flex items-center gap-2 whitespace-nowrap text-body-sm text-on-surface-variant"
      ref={containerRef}
    >
      <span className="text-[11px] font-semibold tracking-[0.06em] text-on-surface-variant">
        정렬 기준:
      </span>
      <div className="relative inline-block">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label="정렬 기준 선택"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-[5px] border border-outline-variant bg-white px-[11px] py-[7px] text-[12.5px] font-semibold text-on-surface transition-colors hover:border-primary"
        >
          <span>{labelFor(value)}</span>
          <Icon
            name="expand_more"
            size={13}
            className={`text-on-surface-variant transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && (
          <div
            role="listbox"
            aria-label="정렬 옵션"
            className="absolute right-0 top-full z-40 mt-1.5 min-w-[150px] rounded-md border border-outline-variant bg-white p-1 shadow-[0_10px_30px_rgba(22,35,58,0.14)]"
          >
            {SORT_OPTIONS.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`flex w-full items-center justify-between gap-2 rounded-[4px] px-2.5 py-2 text-left text-body-sm transition-colors ${
                    isSelected
                      ? "bg-surface-container-low font-semibold text-primary"
                      : "text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && <Icon name="check" size={15} className="text-secondary" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
