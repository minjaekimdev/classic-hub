/**
 * specs/home.md 구현 정책
 * - common-001: 공연 상태를 '공연중', '공연예정' 2가지로만 표기
 * - search-004: '전체'/'공연중'/'공연예정' 버튼 문구 오른쪽 괄호에 상태별 공연 개수 표시
 */
import type { ConcertStatusCounts, StatusFilter } from "@/types/concert";

interface StatusTabsProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
  counts: ConcertStatusCounts | undefined;
}

const TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "ongoing", label: "공연중" },
  { value: "upcoming", label: "공연예정" },
];

export default function StatusTabs({ value, onChange, counts }: StatusTabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      <span className="mr-3 hidden whitespace-nowrap font-label-caps text-on-surface-variant md:inline">
        공연 상태:
      </span>
      {TABS.map((tab) => {
        const isActive = tab.value === value;
        const count = counts ? counts[tab.value] : "-";
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            aria-pressed={isActive}
            className={
              isActive
                ? "whitespace-nowrap rounded-xs bg-primary-container px-3 py-1.5 font-label-md text-on-primary md:rounded-none md:font-label-caps"
                : "whitespace-nowrap rounded-xs border border-outline-variant bg-surface-bright px-3 py-1.5 font-label-md text-on-surface transition-colors hover:bg-surface-container md:rounded-none md:border md:font-label-caps"
            }
          >
            {tab.label} ({count})
          </button>
        );
      })}
    </div>
  );
}
