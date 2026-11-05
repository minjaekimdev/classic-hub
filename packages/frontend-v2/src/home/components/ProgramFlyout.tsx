/**
 * specs/home.md 구현 정책
 * - card-010: 프로그램 영역 hover 시 상세 곡 ui 노출, '외 N곡' 바로 하단 위치 고정,
 *   z-index는 공연 카드보다 높고 헤더(z-40)보다 낮게(z-30)
 * - search-008: 검색어와 일치하는 곡은 목록 안에서도 gold 언더라인으로 표시
 * - (수정안) 헤더에 러닝타임을 함께 표기하고, 곡 수가 많은 프로그램은 목록 영역만 스크롤하며
 *   스크롤 중 작곡가 그룹 헤더는 고정된다
 *   (디자인: prototype/홈페이지 수정안 index-album.html — 위치·크기 값은 프로토타입과 동일)
 */
import Icon from "@/components/Icon";
import ProgramList from "@/home/components/ProgramList";
import type { ConcertProgram } from "@/types/concert";

interface ProgramFlyoutProps {
  programs: ConcertProgram[];
  runtime: string | null;
  /** 현재 검색어 — 일치하는 곡에 gold 언더라인 표시 (specs search-008) */
  searchQuery?: string;
  /** 루트 컨테이너 위치/크기 클래스 — 리스트형(트리거 앵커)과 앨범형(박스 앵커)이 다르게 지정한다 */
  className?: string;
}

export default function ProgramFlyout({
  programs,
  runtime,
  searchQuery = "",
  className,
}: ProgramFlyoutProps) {
  return (
    <div
      className={[
        "invisible opacity-0 transition-opacity duration-150 group-hover/program:visible group-hover/program:opacity-100 flex max-h-[416px] flex-col rounded-lg border border-outline-variant bg-surface-bright text-left shadow-[0_10px_30px_rgba(22,35,58,0.14)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* 헤더(제목 + 러닝타임)는 고정, 목록 영역만 스크롤된다 */}
      <div className="flex flex-none items-center justify-between border-b border-outline-variant px-4 pt-[13px] pb-2">
        <div className="flex items-center gap-1.5">
          <Icon name="queue_music" size={15} className="text-secondary" />
          <span className="font-serif text-[10.5px] font-bold tracking-[0.15em] text-secondary">
            전체 연주 프로그램
          </span>
        </div>
        <span className="flex items-center gap-1 text-[11px] text-on-surface-variant">
          <Icon name="schedule" size={13} />
          <span>러닝타임: {runtime ?? "-"}</span>
        </span>
      </div>
      <div className="max-h-[320px] overflow-y-auto px-4 pb-[13px] pt-1 overscroll-contain [scrollbar-width:thin]">
        <ProgramList programs={programs} variant="flyout" searchQuery={searchQuery} />
      </div>
    </div>
  );
}
