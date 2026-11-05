/**
 * specs/home.md 구현 정책
 * - common-001: 공연 상태를 '공연중', '공연예정' 2가지로만 표기
 * - search-004: '전체'/'공연중'/'공연예정' 버튼 문구 오른쪽 괄호에 상태별 공연 개수 표시
 *   (디자인: prototype/홈페이지 수정안 toolbar — border 박스형 탭, 활성 navy)
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
    <div className="flex items-center gap-[7px]">
      <span className="mr-2 whitespace-nowrap text-[11px] font-semibold tracking-[0.06em] text-on-surface-variant">
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
                ? "whitespace-nowrap rounded-[5px] border border-primary bg-primary px-3.5 py-[7px] text-[12.5px] font-semibold text-white"
                : "whitespace-nowrap rounded-[5px] border border-outline-variant bg-white px-3.5 py-[7px] text-[12.5px] font-semibold text-[#4a5060] transition-colors hover:border-[#c9cfdd] hover:text-primary"
            }
          >
            {tab.label} <span className="ml-[3px] font-normal opacity-75">({count})</span>
          </button>
        );
      })}
    </div>
  );
}
