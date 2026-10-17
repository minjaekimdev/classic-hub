/**
 * specs/home.md 구현 정책
 * - card-009: '전체 프로그램 보기' 버튼 클릭 시 상세 곡 바텀시트 표시(모바일)
 */
import Icon from "@/components/Icon";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import ProgramList from "@/home/components/ProgramList";
import type { ConcertProgram } from "@/types/concert";

interface ProgramSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** 푸터의 '프로그램 오류 제보' 버튼 동작 (specs card-009 바텀시트 푸터) */
  onReport: () => void;
  programs: ConcertProgram[];
  runtime: string | null;
}

/** '전체 프로그램 보기' 버튼으로 열리는 전체 연주 프로그램 바텀시트 (specs card-009) */
export default function ProgramSheet({
  isOpen,
  onClose,
  onReport,
  programs,
  runtime,
}: ProgramSheetProps) {
  return (
    <ResponsiveDialog
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="전체 연주 프로그램"
      containerClassName="md:max-w-lg"
    >
      {/* 드래그 핸들 (모바일) */}
      <div className="flex w-full items-center justify-center pb-1 pt-3 md:hidden">
        <div className="h-1 w-10 rounded-full bg-outline-variant/80" />
      </div>

      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-6 py-4">
        <div>
          <span className="mb-0.5 inline-block rounded-xs border border-secondary/20 bg-secondary-fixed/40 px-2 py-0.5 font-label-caps tracking-wider text-secondary">
            상세 곡목
          </span>
          <h2 className="font-serif text-headline-sm tracking-tight text-primary">
            전체 연주 프로그램
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="-mr-2 p-2 text-on-surface-variant transition-colors hover:text-primary"
        >
          <Icon name="close" size={24} />
        </button>
      </header>

      <div className="px-6 pb-5">
        <ProgramList programs={programs} variant="sheet" />
      </div>

      <footer className="space-y-3 border-t border-outline-variant bg-surface-container-lowest p-4 sm:p-5">
        <div className="flex items-center justify-between px-1 text-on-surface-variant">
          <div className="flex items-center gap-1.5 font-label-md text-primary">
            <Icon name="timer" size={18} className="text-secondary" />
            <span>러닝타임: {runtime ?? "-"}</span>
          </div>
          <button
            type="button"
            onClick={onReport}
            className="flex shrink-0 items-center gap-1 rounded-lg border border-outline-variant/40 bg-surface-container-low px-2.5 py-1.5 text-body-sm shadow-sm transition-colors hover:bg-surface-variant hover:text-primary"
          >
            <Icon name="flag" size={14} />
            <span>프로그램 오류 제보</span>
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-xs bg-primary py-3 text-center font-label-md text-on-primary transition-colors hover:bg-primary-container"
        >
          <span>확인 및 닫기</span>
        </button>
      </footer>
    </ResponsiveDialog>
  );
}
