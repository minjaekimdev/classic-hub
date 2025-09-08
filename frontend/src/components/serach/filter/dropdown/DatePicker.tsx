import React from "react";
import { DayPicker } from "react-day-picker";
import "./DatePicker.scss";

const DatePicker: React.FC = () => {
  return (
    <DayPicker
      fixedWeeks
      numberOfMonths={2}
      navLayout="around"
      animate
      mode="range"
      disabled={{ before: new Date() }}
    />
  );
};

export default DatePicker;
