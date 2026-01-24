import { type DateRange } from "react-day-picker";
import { Calendar } from "@shared/ui/shadcn/calendar";
import { useFilter } from "./SearchFilter";

export function DateSelect() {
  const { filterValue, changeValue } = useFilter();
  let calendarDateRange: DateRange | undefined;
  const isValidDateRange = /^\d{4}\/\d{2}\/\d{2} - \d{4}\/\d{2}\/\d{2}$/.test(
    filterValue.날짜,
  );
  if (!isValidDateRange) {
    calendarDateRange = {
      from: new Date(),
      to: new Date(),
    };
  } else {
    const [startDate, endDate] = filterValue.날짜
      .split(" - ")
      .map((item: string) => item.replaceAll("/", "-"));
    calendarDateRange = {
      from: new Date(startDate),
      to: new Date(endDate),
    };
  }

  const handleSelect = (range: DateRange | undefined) => {
    // 1. 선택 취소되거나 값이 없으면 초기화
    if (!range?.from) {
      changeValue({ 날짜: "날짜" });
      return;
    }

    // 2. 날짜 포맷팅 헬퍼 함수 (YYYY/MM/DD)
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}/${month}/${day}`;
    };

    const fromStr = formatDate(range.from);
    // to가 없으면(아직 선택 중이면) from과 같은 값으로 표시
    const toStr = range.to ? formatDate(range.to) : fromStr;

    // 3. 부모에게 문자열로 전달
    changeValue({ 날짜: `${fromStr} - ${toStr}` });
  };

  return (
    <Calendar
      mode="range"
      defaultMonth={calendarDateRange.from}
      selected={calendarDateRange}
      onSelect={handleSelect}
      numberOfMonths={2}
      className="rounded-lg
      /* 1. 단일 선택 날짜 (Single Selected) */
        /* 배경을 #c00으로, 글자는 흰색으로, 호버 시 약간 진하게 */
        [&_[data-selected-single=true]]:bg-[#c00]
        [&_[data-selected-single=true]]:text-white
        [&_[data-selected-single=true]]:hover:bg-[#c00]/90
        
        /* 2. 범위 선택 - 시작일 & 종료일 (Range Start/End) */
        [&_[data-range-start=true]]:bg-[#c00]
        [&_[data-range-start=true]]:text-white
        [&_[data-range-end=true]]:bg-[#c00]
        [&_[data-range-end=true]]:text-white

        /* 3. 범위 선택 - 중간 날짜 (Range Middle) */
        /* 배경을 연한 #c00(10% 투명도)으로, 글자는 검정색 */
        [&_[data-range-middle=true]]:bg-[#c00]/10
        [&_[data-range-middle=true]]:text-neutral-900

        /* 4. 오늘 날짜 (Today) - 선택 안 됐을 때 */
        /* 기본 회색 배경을 바꾸고 싶다면 아래 주석 해제 */
        /* [&_.rdp-day_today:not([data-selected=true])]:bg-gray-100 */
        /* [&_.rdp-day_today:not([data-selected=true])]:text-[#c00] */
     "
    />
  );
}
