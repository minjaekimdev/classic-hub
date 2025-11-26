import React, { useState } from "react";
import locationIcon from "@shared/assets/icons/location-gray.svg";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import moneyIcon from "@shared/assets/icons/dollar-gray.svg";
import searchIcon from "@shared/assets/icons/search-white.svg";
import SearchField from "./SearchField";
import FilterField from "./FilterField";
import { DropdownMenuItem } from "@shared/ui/shadcn/dropdown-menu";
import PriceRangeSlider from "./PriceRangeSlider";
import { Calendar05 } from "./Calendar";

const locationArray = [
  "전체",
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

const FilterDesktop = () => {
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("지역");
  const [priceRange, setPriceRange] = useState("가격");
  const [dateRange, setDateRange] = useState("날짜");

  return (
    <div className="grid grid-flow-col gap-[0.66rem] auto-cols-[2fr_1fr_1fr_1fr_auto] rounded-[0.875rem] border border-gray-200 bg-white shadow-xl p-[0.94rem] w-4xl">
      <SearchField inputValue={searchText} onChange={setSearchText}/>
      <FilterField icon={locationIcon} label={location}>
        {locationArray.map((item) => (
          <DropdownMenuItem
            className="text-xs cursor-pointer"
            onSelect={() => setLocation(item)}
          >
            {item}
          </DropdownMenuItem>
        ))}
      </FilterField>
      <FilterField icon={moneyIcon} label={priceRange}>
        <DropdownMenuItem className="focus:bg-transparent">
          <PriceRangeSlider priceRange={priceRange} onSelect={setPriceRange} />
        </DropdownMenuItem>
      </FilterField>
      <FilterField icon={calendarIcon} label={dateRange}>
        <Calendar05 dateRange={dateRange} onSelect={setDateRange} />
      </FilterField>
      <div className="flex gap-3">
        <button
          className="p-[0.69rem_0.56rem] border border-gray-200 rounded-[0.55rem] bg-white text-[0.77rem] transition-transform duration-200 hover:scale-105"
          onClick={() => {
            setSearchText("");
            setLocation("지역");
            setPriceRange("가격");
            setDateRange("날짜");
          }}
        >
          <div className="flex items-center gap-[0.44rem] w-fit">초기화</div>
        </button>
        <button className="p-[0.69rem_0.56rem] rounded-[0.55rem] bg-main text-white text-[0.77rem] transition-transform duration-200 hover:scale-105">
          <div className="flex items-center gap-[0.44rem] w-fit">
            <img className="" src={searchIcon} alt="" />
            검색
          </div>
        </button>
      </div>
    </div>
  );
};

export default FilterDesktop;
