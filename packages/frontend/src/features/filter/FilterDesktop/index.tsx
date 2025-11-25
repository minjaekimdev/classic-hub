import React from "react";
import locationIcon from "@shared/assets/icons/location-gray.svg";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import moneyIcon from "@shared/assets/icons/dollar-gray.svg";
import searchIcon from "@shared/assets/icons/search-white.svg";
import SearchField from "./SearchField";
import Field from "./Field";

const fieldArray = [
  {
    icon: locationIcon,
    label: "지역",
  },
  {
    icon: calendarIcon,
    label: "날짜",
  },
  {
    icon: moneyIcon,
    label: "가격",
  },
];

const FilterDesktop = () => {
  return (
    <div className="grid grid-flow-col gap-[0.66rem] auto-cols-[2fr_1fr_1fr_1fr_auto] rounded-[0.875rem] border border-gray-200 bg-white shadow-xl p-[0.94rem] w-4xl">
      <SearchField />
      {fieldArray.map((item) => (
        <Field icon={item.icon} label={item.label} />
      ))}
      <button className="p-[0.69rem_0.56rem] rounded-[0.55rem] bg-main text-white text-[0.77rem] transition-transform duration-200 hover:scale-105">
        <div className="flex items-center gap-[0.44rem] w-fit">
          <img className="" src={searchIcon} alt="" />
          검색
        </div>
      </button>
    </div>
  );
};

export default FilterDesktop;
