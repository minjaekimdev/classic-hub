/**
 * specs/home.md 구현 정책
 * - search-006: 검색 결과 페이지네이션 표시 (페이지당 개수는 api/concerts.ts PAGE_SIZE에서 결정)
 */
interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
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

export default function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  const handlePrevious = () => onPageChange(page - 1);
  const handleNext = () => onPageChange(page + 1);

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant pt-8 sm:flex-row">
      <span className="text-body-sm text-on-surface-variant">
        총 {total.toLocaleString()}개의 프로그램 검색 결과 표시 중 ({page}페이지 중 {totalPages})
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={page <= 1}
          className="border border-outline-variant px-3 py-1.5 font-label-caps text-on-surface-variant transition-colors hover:border-outline hover:text-primary disabled:pointer-events-none disabled:opacity-40"
        >
          이전 페이지
        </button>
        {buildPageItems(page, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="select-none px-1 font-label-caps text-outline-variant"
            >
              …
            </span>
          ) : item === page ? (
            <span
              key={item}
              aria-current="page"
              className="flex h-8 w-8 items-center justify-center bg-primary-container font-label-caps text-on-primary"
            >
              {item}
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className="flex h-8 w-8 items-center justify-center font-label-caps text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={page >= totalPages}
          className="border border-outline-variant px-3 py-1.5 font-label-caps text-on-surface-variant transition-colors hover:border-outline hover:text-primary disabled:pointer-events-none disabled:opacity-40"
        >
          다음 페이지
        </button>
      </div>
    </div>
  );
}
