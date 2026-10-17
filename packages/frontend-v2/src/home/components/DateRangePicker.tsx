/**
 * specs/home.md 구현 정책
 * - search-005: 공연 기간 선택 ui 우측 새로고침 버튼 클릭 시 탐색 가능한 최대 기간으로 초기화
 *   (최대 기간 정의는 lib/period.ts, 상태 적용은 useHomePageState.ts)
 */
import { useRef, useState } from "react";
import {
  DayPicker,
  type CalendarMonth,
  type DateRange as DayPickerDateRange,
} from "react-day-picker";
import Icon from "@/components/Icon";
import {
  addMonths,
  monthLabelEn,
  parseISODate,
  toDisplayDate,
  toISODate,
  todayISO,
  weekdayLabel,
} from "@/lib/date";
import { BROWSABLE_MONTHS, getBrowsablePeriod } from "@/lib/period";
import useDismiss from "@/lib/useDismiss";
import type { DateRange } from "@/types/concert";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

interface PresetOption {
  label: string;
  start: string;
  end: string;
}

const MonthCaption = ({ calendarMonth }: { calendarMonth: CalendarMonth }) => (
  <div className="mb-3 flex items-center justify-between px-1">
    <span className="font-serif text-headline-sm font-medium tracking-tight text-primary">
      {calendarMonth.date.getFullYear()}년 {calendarMonth.date.getMonth() + 1}월
    </span>
    <span className="font-label-caps font-semibold text-secondary">
      {monthLabelEn(calendarMonth.date)}
    </span>
  </div>
);

const getPresets = (browsable: DateRange): PresetOption[] => {
  const today = todayISO();
  const now = parseISODate(today);
  const monthEnd = toISODate(new Date(now.getFullYear(), now.getMonth() + 1, 0));

  // 이번 주말: 다가오는 토요일 ~ 일요일 (오늘이 일요일이면 오늘 하루)
  const daysUntilSaturday = (6 - now.getDay() + 7) % 7;
  const saturdayISO = toISODate(
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSaturday),
  );
  const sundayISO = toISODate(
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSaturday + 1),
  );
  const isSunday = now.getDay() === 0;
  const weekendStart = isSunday || daysUntilSaturday === 0 ? today : saturdayISO;
  const weekendEnd = isSunday ? today : sundayISO;

  const clampEnd = (iso: string) => (iso > browsable.end ? browsable.end : iso);

  return [
    { label: "오늘", start: today, end: today },
    { label: "이번 주말", start: weekendStart, end: weekendEnd },
    { label: "이번 달", start: today, end: clampEnd(monthEnd) },
    { label: "향후 1개월", start: today, end: clampEnd(addMonths(today, 1)) },
    { label: `향후 ${BROWSABLE_MONTHS}개월 전체`, start: browsable.start, end: browsable.end },
  ];
};

const toDayPickerRange = (range: DateRange): DayPickerDateRange => ({
  from: parseISODate(range.start),
  to: parseISODate(range.end),
});

const isEqualRange = (draft: DayPickerDateRange | undefined, range: DateRange): boolean => {
  if (!draft?.from || !draft.to) return false;
  return toISODate(draft.from) === range.start && toISODate(draft.to) === range.end;
};

const FULL_BROWSABLE_PRESET_LABEL = `향후 ${BROWSABLE_MONTHS}개월 전체`;

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<DayPickerDateRange>({ from: undefined, to: undefined });
  const containerRef = useRef<HTMLDivElement>(null);

  const browsable = getBrowsablePeriod();
  const presets = getPresets(browsable);

  useDismiss(isOpen, containerRef, () => setIsOpen(false));

  const handleOpen = () => {
    setDraft(toDayPickerRange(value));
    setIsOpen(true);
  };

  const handleApply = () => {
    if (!draft.from || !draft.to) return;
    onChange({ start: toISODate(draft.from), end: toISODate(draft.to) });
    setIsOpen(false);
  };

  const handleResetDraft = () => {
    setDraft(toDayPickerRange(browsable));
  };

  const canApply = Boolean(draft.from && draft.to);
  const isFullBrowsableActive = isEqualRange(draft, browsable);

  return (
    <div className="relative flex items-center gap-2" ref={containerRef}>
      <div className="hidden items-center gap-1.5 md:flex">
        <Icon name="calendar_today" size={18} className="text-outline" />
        <span className="font-label-caps text-on-surface-variant">공연 기간:</span>
      </div>
      <button
        type="button"
        onClick={handleOpen}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 rounded-xs border border-outline-variant bg-surface-bright px-2.5 py-1.5 text-[12px] text-on-surface transition-colors hover:border-secondary md:px-3 md:py-1 md:text-body-md"
      >
        <Icon name="calendar_today" size={15} className="text-secondary md:hidden" />
        <span>
          {toDisplayDate(value.start)} ~ {toDisplayDate(value.end)}
        </span>
        <Icon name="expand_more" size={16} className="hidden text-outline md:inline" />
      </button>
      <button
        type="button"
        onClick={() => onChange(browsable)}
        title="기간 초기화 (탐색 가능한 최대 기간)"
        aria-label="기간 초기화"
        className="rounded-xs border border-outline-variant bg-surface-bright p-1.5 text-outline transition-colors hover:text-primary md:border-0 md:bg-transparent md:p-1"
      >
        <Icon name="restart_alt" size={18} />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="공연 기간 선택"
          className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border border-outline-variant bg-surface-container-lowest shadow-[0_12px_40px_-8px_rgba(27,36,48,0.18)] md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:max-h-none md:w-[780px] md:rounded-t-xs"
        >
          <div className="flex items-start justify-between border-b border-outline-variant/60 bg-surface-container-low/40 p-5 md:p-6">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Icon name="date_range" size={20} className="text-secondary" />
                <h2 className="font-serif text-headline-sm text-primary">공연 기간 선택</h2>
                <span className="rounded-xs bg-primary px-2 py-0.5 text-[10px] font-semibold tracking-wider text-on-primary">
                  최대 {BROWSABLE_MONTHS}개월 탐색
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                공연 기획사 및 공연장 등록 기준 향후 {BROWSABLE_MONTHS}개월간의 공식 프로그램을
                조회합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="닫기"
              className="p-1 text-outline transition-colors hover:text-primary"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-outline-variant/40 bg-surface-container-low/20 px-5 py-3 md:px-6">
            <span className="mr-1 font-label-caps text-on-surface-variant">기간 프리셋:</span>
            {presets.map((preset) => {
              const isActive = preset.label === FULL_BROWSABLE_PRESET_LABEL && isFullBrowsableActive;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() =>
                    setDraft(toDayPickerRange({ start: preset.start, end: preset.end }))
                  }
                  className={`flex items-center gap-1 rounded-xs border px-3 py-1 text-xs transition-colors ${
                    isActive
                      ? "border-secondary bg-secondary-container/20 font-semibold text-secondary"
                      : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-secondary hover:text-secondary"
                  }`}
                >
                  {isActive && <Icon name="check" size={14} />}
                  {preset.label}
                </button>
              );
            })}
          </div>

          <div className="p-5 md:p-6">
            <DayPicker
              mode="range"
              numberOfMonths={2}
              selected={draft}
              onSelect={(range) => setDraft(range ?? { from: undefined, to: undefined })}
              excludeDisabled
              disabled={[
                {
                  before: parseISODate(browsable.start),
                  after: parseISODate(browsable.end),
                },
              ]}
              formatters={{
                formatCaption: (month) => `${month.getFullYear()}년 ${month.getMonth() + 1}월`,
                formatWeekdayName: (date) => WEEKDAY_LABELS[date.getDay()],
              }}
              modifiers={{ sunday: (date) => date.getDay() === 0 }}
              modifiersClassNames={{ sunday: "[&>button]:text-tertiary" }}
              components={{ MonthCaption }}
              classNames={{
                months: "flex flex-col gap-8 md:flex-row",
                month: "flex-1",
                month_caption: "mb-3",
                month_grid: "w-full border-collapse",
                weekday: "pb-2 text-center font-label-caps font-normal text-on-surface-variant",
                day: "h-9 p-0 text-center align-middle",
                day_button:
                  "inline-flex h-8 w-8 items-center justify-center rounded-full text-xs text-on-surface transition-colors hover:text-secondary",
                selected: "[&>button]:font-medium",
                range_middle: "bg-secondary/15",
                range_start:
                  "rounded-l-full bg-secondary/15 [&>button]:bg-primary [&>button]:text-on-primary",
                range_end:
                  "rounded-r-full bg-secondary/15 [&>button]:bg-primary [&>button]:text-on-primary",
                disabled: "[&>button]:text-outline-variant/40",
                chevron: "fill-outline",
              }}
            />
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant bg-surface-container-low px-5 py-4 md:flex-row md:px-6">
            <div className="flex w-full items-center gap-2 md:w-auto">
              <div className="flex flex-1 items-center gap-2 rounded-xs border border-outline-variant bg-surface-container-lowest px-3 py-1.5 md:flex-none">
                <span className="font-label-caps text-on-surface-variant">시작일</span>
                <span className="font-label-md font-semibold text-primary">
                  {draft.from
                    ? `${toDisplayDate(toISODate(draft.from))} (${weekdayLabel(draft.from)})`
                    : "-"}
                </span>
              </div>
              <span className="font-semibold text-outline-variant">~</span>
              <div className="flex flex-1 items-center gap-2 rounded-xs border border-outline-variant bg-surface-container-lowest px-3 py-1.5 md:flex-none">
                <span className="font-label-caps text-on-surface-variant">종료일</span>
                <span className="font-label-md font-semibold text-primary">
                  {draft.to
                    ? `${toDisplayDate(toISODate(draft.to))} (${weekdayLabel(draft.to)})`
                    : "-"}
                </span>
              </div>
            </div>
            <div className="flex w-full items-center justify-end gap-3 md:w-auto">
              <button
                type="button"
                onClick={handleResetDraft}
                className="flex items-center gap-1 px-3 py-2 font-label-md text-on-surface-variant transition-colors hover:text-primary"
              >
                <Icon name="restart_alt" size={16} />
                <span>초기화 ({BROWSABLE_MONTHS}개월)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xs border border-outline-variant px-4 py-2 font-label-md text-primary transition-colors hover:bg-surface"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!canApply}
                className="flex items-center gap-1.5 rounded-xs bg-primary px-6 py-2 font-label-md text-on-primary shadow-sm transition-all hover:bg-primary-container active:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>적용하기</span>
                <Icon name="check" size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
