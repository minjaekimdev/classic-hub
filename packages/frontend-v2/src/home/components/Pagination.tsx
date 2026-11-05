/**
 * specs/home.md 구현 정책
 * - search-006: 검색 결과 페이지네이션 표시 (페이지당 개수는 api/concerts.ts PAGE_SIZE에서 결정)
 * - pagenation-001: 페이지 이동 시 스크롤 보정은 HomePage가 담당
 *   (디자인: prototype/홈페이지 수정안 — 번호형 중앙 정렬, 이전/다음은 아이콘 버튼)
 */
import Icon from "@/components/Icon";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const buildPageItems = (page: number, totalPages: number): (number | "ellipsis")[] => {
  const wanted = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (number) => number === 1 || number === totalPages || Math.abs(number - page) <= 1,
  );

  const items: (number | "ellipsis")[] = [];
  let previous = 0;
  for (const number of wanted) {
    if (number - previous > 1) items.push("ellipsis");
    items.push(number);
    previous = number;
  }
  return items;
};

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const handlePrevious = () => onPageChange(page - 1);
  const handleNext = () => onPageChange(page + 1);

  return (
    <nav aria-label="페이지 이동" className="flex items-center justify-center gap-2 pt-8">
      <button
        type="button"
        onClick={handlePrevious}
        disabled={page <= 1}
        aria-label="이전 페이지"
        className="flex h-[38px] w-[38px] items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
      >
        <Icon name="chevron_left" size={18} />
      </button>
      {buildPageItems(page, totalPages).map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="select-none px-1 text-body-sm text-outline-variant"
          >
            …
          </span>
        ) : item === page ? (
          <span
            key={item}
            aria-current="page"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-primary text-body-md font-bold text-on-primary"
          >
            {item}
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-md border border-outline-variant text-body-md font-semibold text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={handleNext}
        disabled={page >= totalPages}
        aria-label="다음 페이지"
        className="flex h-[38px] w-[38px] items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
      >
        <Icon name="chevron_right" size={18} />
      </button>
    </nav>
  );
}
