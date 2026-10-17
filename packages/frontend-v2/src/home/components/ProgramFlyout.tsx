/**
 * specs/home.md 구현 정책
 * - card-010: 프로그램 영역 hover 시 상세 곡 ui 노출, '외 N곡' 바로 하단 위치 고정,
 *   z-index는 공연 카드보다 높고 헤더(z-40)보다 낮게(z-30)
 */
import Icon from "@/components/Icon";
import ProgramList from "@/home/components/ProgramList";
import type { ConcertProgram } from "@/types/concert";

interface ProgramFlyoutProps {
  programs: ConcertProgram[];
  runtime: string | null;
}

/**
 * 프로그램 영역 hover 시 노출되는 전체 연주 프로그램 팝오버 (specs card-010).
 * '외 N곡' UI 바로 하단에 위치가 고정되며, 노출 자체는 CSS hover로 처리한다.
 */
export default function ProgramFlyout({ programs, runtime }: ProgramFlyoutProps) {
  return (
    <div className="invisible opacity-0 transition-opacity duration-150 group-hover/program:visible group-hover/program:opacity-100 absolute left-0 top-full z-30 mt-2 w-[28rem] max-w-[85vw] border border-outline-variant bg-surface-container-lowest shadow-[0_12px_40px_-8px_rgba(27,36,48,0.18)]">
      <div className="flex items-center justify-between border-b border-outline-variant/50 bg-surface-container-low px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Icon name="queue_music" size={18} className="text-secondary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            전체 연주 프로그램 (작곡가별 프로그램)
          </span>
        </div>
        <span className="rounded-xs bg-surface-container-high/80 px-2 py-0.5 text-[11px] font-medium text-on-surface-variant">
          상세 곡목
        </span>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-5">
        <ProgramList programs={programs} variant="flyout" />
      </div>
      <div className="flex items-center gap-1.5 border-t border-outline-variant/50 bg-surface-container-low px-5 py-2.5 text-[11px] text-on-surface-variant">
        <Icon name="schedule" size={14} />
        <span>공연 러닝타임: {runtime ?? "-"}</span>
      </div>
    </div>
  );
}
