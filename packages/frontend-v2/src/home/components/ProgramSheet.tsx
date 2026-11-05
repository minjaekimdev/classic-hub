/**
 * specs/home.md 구현 정책
 * - card-009: '전체 프로그램 보기' 버튼 클릭 시 상세 곡 바텀시트 표시(모바일)
 * - search-008: 검색어와 일치하는 곡은 목록 안에서도 gold 언더라인으로 표시
 * - (수정안) 헤더에 러닝타임을 함께 표기하고, 곡 수가 많은 프로그램은 목록 영역만 스크롤하며
 *   스크롤 중 작곡가 그룹 헤더는 고정된다
 * - (수정안) 모바일에서는 곡 수와 무관하게 시트 높이를 최대(92vh)로 고정한다 — 곡이 적은
 *   프로그램에서 시트가 지나치게 낮아지는 것을 방지 (ResponsiveDialog mobileFullHeight)
 *   (디자인: prototype/전체 프로그램 바텀시트(모바일) — 위치·크기 값은 프로토타입과 동일)
 */
import Icon from "@/components/Icon";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import ProgramList from "@/home/components/ProgramList";
import type { ConcertProgram } from "@/types/concert";

interface ProgramSheetProps {
  isOpen: boolean;
  onClose: () => void;
  programs: ConcertProgram[];
  runtime: string | null;
  /** 현재 검색어 — 일치하는 곡에 gold 언더라인 표시 (specs search-008) */
  searchQuery?: string;
}

/** '전체 프로그램 보기' 버튼으로 열리는 전체 연주 프로그램 바텀시트 (specs card-009) */
export default function ProgramSheet({
  isOpen,
  onClose,
  programs,
  runtime,
  searchQuery = "",
}: ProgramSheetProps) {
  return (
    <ResponsiveDialog
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="전체 연주 프로그램"
      containerClassName="md:max-w-lg"
      mobileFullHeight
    >
      {/* 드래그 핸들 (모바일) */}
      <div className="mx-auto mb-0.5 flex w-full items-center justify-center pt-3 md:hidden">
        <div className="h-1 w-10 rounded-full bg-outline-variant/80" />
      </div>

      {/* 헤더(제목 + 러닝타임 + 닫기)는 고정, 목록 영역만 스크롤된다 */}
      <header className="sticky top-0 z-10 flex flex-none items-center justify-between gap-3 border-b border-outline-variant bg-surface-container-lowest px-[18px] pt-[13px] pb-2">
        <h2 className="text-[15px] font-bold text-primary">전체 연주 프로그램</h2>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px] text-on-surface-variant">
            <Icon name="schedule" size={13} />
            <span>러닝타임: {runtime ?? "-"}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-colors hover:text-primary"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      </header>

      {/* 모바일: 시트가 92vh로 고정되어 남은 공간을 목록이 채우고 그 안에서만 스크롤된다.
          데스크톱: 기존과 동일하게 목록 최대 높이(70vh)로 제한 */}
      <div className="min-h-0 flex-1 overflow-y-auto px-[18px] pt-3.5 pb-[18px] overscroll-contain [scrollbar-width:thin] md:max-h-[70vh]">
        <ProgramList programs={programs} variant="sheet" searchQuery={searchQuery} />
      </div>
    </ResponsiveDialog>
  );
}
