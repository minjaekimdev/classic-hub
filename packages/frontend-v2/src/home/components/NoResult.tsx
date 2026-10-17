/**
 * specs/home.md 구현 정책
 * - search-007: '검색 필터 초기화' 버튼으로 검색어/공연상태/공연기간/정렬기준 전체 초기화 요청
 * - exception-03: 조건에 맞는 공연이 없을 때 표시되는 no-result ui
 */
import Icon from "@/components/Icon";
import { toDotDate } from "@/lib/date";
import type { DateRange } from "@/types/concert";

interface NoResultProps {
  query: string;
  dateRange: DateRange;
  onResetFilters: () => void;
  onSearchExample: (query: string) => void;
}

const EXAMPLE_COMPOSERS = ["스트라빈스키", "라흐마니노프", "베토벤"];

export default function NoResult({
  query,
  dateRange,
  onResetFilters,
  onSearchExample,
}: NoResultProps) {
  return (
    <section className="mx-auto mb-10 w-full max-w-4xl rounded-lg border border-outline-variant bg-surface-container-lowest p-8 text-center shadow-xs md:p-14">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl border border-secondary/30 bg-secondary-fixed/40 text-secondary">
        <Icon name="music_note" fill size={32} />
      </div>
      <div className="mb-4 inline-flex items-center gap-1.5 rounded-xs border border-secondary/40 bg-secondary-fixed/30 px-3 py-1 font-label-caps text-secondary">
        <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
        ARCHIVE QUERY · 0 RESULTS
      </div>
      <h2 className="mb-3 font-serif text-headline-lg text-primary">
        일치하는 연주 프로그램을 찾을 수 없습니다
      </h2>
      <p className="mx-auto mb-8 max-w-2xl leading-relaxed text-body-lg text-on-surface-variant">
        {query ? (
          <>
            입력하신 검색어 <strong className="font-medium text-primary">‘{query}’</strong> 및{" "}
          </>
        ) : null}
        지정된 기간 내에 등록된 정기 연주회 또는 기획 공연 편성 내역이 데이터베이스에 존재하지
        않습니다.
      </p>

      <div className="mx-auto mb-8 max-w-2xl rounded-sm border border-outline-variant/70 bg-surface-container-low p-5 text-left">
        <div className="mb-3 flex items-center gap-2 font-label-caps text-secondary">
          <Icon name="tips_and_updates" size={16} />
          <span>권장 검색 방식 및 제안</span>
        </div>
        <ul className="space-y-2.5 text-body-sm text-on-surface-variant">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-xs font-bold text-secondary">•</span>
            <span>
              작곡가의 성(Last Name)으로 넓게 검색해 보세요 (예:{" "}
              {EXAMPLE_COMPOSERS.map((composer, index) => (
                <span key={composer}>
                  {index > 0 && ", "}
                  <button
                    type="button"
                    onClick={() => onSearchExample(composer)}
                    className="text-primary underline underline-offset-2 transition-colors hover:text-secondary"
                  >
                    {composer}
                  </button>
                </span>
              ))}
              ).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-xs font-bold text-secondary">•</span>
            <span>
              현재 설정된 공연 기간(
              <strong className="font-medium text-primary">
                {toDotDate(dateRange.start)} ~ {toDotDate(dateRange.end)}
              </strong>
              ) 내 기간 프리셋(오늘, 이번 주말, 이번 달 등)으로 조회 범위를 바꿔 보세요.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-xs font-bold text-secondary">•</span>
            <span>
              악장 번호나 카탈로그 번호(Opus / BWV / K.)를 제외하고 단어 단위를 간소화하여 재입력해
              보세요.
            </span>
          </li>
        </ul>
      </div>

      <button
        type="button"
        onClick={onResetFilters}
        className="inline-flex items-center gap-2 border border-outline-variant bg-surface-bright px-5 py-2.5 font-label-md text-primary transition-colors hover:border-secondary"
      >
        <Icon name="restart_alt" size={18} />
        <span>검색 필터 초기화</span>
      </button>
    </section>
  );
}
