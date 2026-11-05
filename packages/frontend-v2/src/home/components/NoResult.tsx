/**
 * specs/home.md 구현 정책
 * - search-007: '검색 필터 초기화' 버튼으로 검색어/공연상태/공연기간/정렬기준 전체 초기화 요청
 * - exception-03: 조건에 맞는 공연이 없을 때 표시되는 no-result ui
 *   (디자인: prototype/검색 결과 0건 및 not-found(데스크톱))
 */
import Icon from "@/components/Icon";

interface NoResultProps {
  onResetFilters: () => void;
}

export default function NoResult({ onResetFilters }: NoResultProps) {
  return (
    <div className="py-14 text-center" data-testid="no-result">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-outline-variant bg-surface-container-low text-secondary">
        <Icon name="search" size={26} />
      </span>
      <h2 className="mt-4 text-body-lg font-bold text-primary">조건에 맞는 공연이 없습니다</h2>
      <p className="mt-2 text-body-md text-on-surface-variant">
        검색어나 관람 기간을 조정해 다시 검색해 보세요.
      </p>
      <button
        type="button"
        onClick={onResetFilters}
        className="mt-6 inline-flex items-center gap-2 rounded-full border-[1.5px] border-primary px-5 py-2.5 text-body-md font-bold text-primary transition-colors hover:bg-primary hover:text-on-primary"
      >
        <Icon name="restart_alt" size={16} />
        <span>검색 필터 초기화</span>
      </button>
    </div>
  );
}
