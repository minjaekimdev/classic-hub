/**
 * specs/home.md 구현 정책
 * - search-003: 정렬 옵션 3가지('공연임박순', '낮은가격순', '높은가격순'),
 *   트리거 영역 클릭 시 옵션 ui가 하단에 표시되고 트리거와 우측 모서리 정렬(right-0)
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
    <div className="relative flex items-center gap-2 whitespace-nowrap text-body-sm text-on-surface-variant" ref={containerRef}>
      <div className="hidden items-center gap-1 font-label-caps md:flex">
        <Icon name="sort" size={16} className="text-secondary" />
        <span>정렬 기준:</span>
      </div>
      <div className="relative inline-block">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label="정렬 기준 선택"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex cursor-pointer items-center justify-between gap-1.5 rounded-xs border border-outline-variant bg-surface-bright py-1 pl-2.5 pr-1.5 font-medium text-primary shadow-sm transition-colors hover:border-secondary md:gap-3 md:pr-2.5"
        >
          <span className="text-[12px] tracking-tight md:text-body-sm">
            <span className="md:hidden">정렬: </span>
            {labelFor(value)}
          </span>
          <Icon
            name="expand_less"
            size={18}
            className={`text-outline transition-transform duration-200 ${isOpen ? "" : "rotate-180"}`}
          />
        </button>
        {isOpen && (
          <div
            role="listbox"
            aria-label="정렬 옵션"
            className="absolute right-0 top-full z-40 mt-1.5 w-44 border border-outline-variant bg-surface-container-lowest py-1 shadow-sm"
          >
            <div className="mb-1 border-b border-outline-variant/40 px-3 py-1.5 font-label-caps uppercase tracking-wider text-outline">
              옵션 선택
            </div>
            {SORT_OPTIONS.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-body-sm transition-colors ${
                    isSelected
                      ? "bg-surface-container-low font-medium text-primary"
                      : "text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && <Icon name="check" size={16} className="text-secondary" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
