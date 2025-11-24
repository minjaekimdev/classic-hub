import React, { useState, type SetStateAction } from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import "./DatePicker.scss";
import { format } from "date-fns";
import type { OnSelectHandler, DateRange } from "react-day-picker";
import type { fieldContentType } from "../../../Header";

const DatePicker: React.FC<{
  setFieldContent: React.Dispatch<SetStateAction<fieldContentType>>;
}> = ({ setFieldContent }) => {
  const [range, setRange] = useState<DateRange>();

  const handleSelect: OnSelectHandler<DateRange | undefined> = (selected) => {
    const fromStr = selected?.from ? format(selected.from, "yyyy-MM-dd") : "";
    const toStr = selected?.to ? format(selected.to, "yyyy-MM-dd") : "";
    const period =
      fromStr && toStr
        ? `${fromStr}
    ~ ${toStr}`
        : "기간 선택";
    setRange(selected);
    setFieldContent((prev) => ({ ...prev, 기간: period }));
  };

  return (
    <DayPicker
      onDayClick={(day, modifiers, e) => {
        e.stopPropagation();
      }}
      fixedWeeks
      numberOfMonths={2}
      navLayout="around"
      animate
      mode="range"
      selected={range}
      onSelect={handleSelect}
      disabled={{ before: new Date() }}
      required={false}
      formatters={{
        formatCaption: (date) => format(date, "yyyy년 LLL", { locale: ko }),
        formatWeekdayName: (weekday) =>
          ["일", "월", "화", "수", "목", "금", "토"][weekday.getDay()],
      }}
    />
  );
};

export default DatePicker;
