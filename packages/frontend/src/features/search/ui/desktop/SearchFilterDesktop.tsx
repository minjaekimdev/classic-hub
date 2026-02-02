import { SearchFilter, useFilter } from "./SearchFilter";
import locationIcon from "@shared/assets/icons/location-gray.svg";
import moneyIcon from "@shared/assets/icons/dollar-gray.svg";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import PriceRangeSlider from "./PriceRangeSlider";
import { DateSelect } from "./DateSelect";
import searchIcon from "@shared/assets/icons/search-white.svg";
import SearchFilterInput from "./SearchFilterInput";
import SearchFilterField from "./SearchFilterField";
import { Check } from "lucide-react";
import { DropdownMenuItem } from "@/shared/ui/shadcn/dropdown-menu";

const LOCATION_LIST = [
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

const SearchFilterDesktop = () => {
  const { filterValue, changeValue } = useFilter();

  console.log(filterValue);
  
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-[0.66rem] rounded-[0.875rem] border border-gray-200 bg-white shadow-xl p-[0.94rem] w-230 h-18">
      <SearchFilterInput />
      <SearchFilterField iconSrc={locationIcon} title="지역">
        <div onClick={(e) => e.stopPropagation()}>
          {LOCATION_LIST.map((item) => (
            <DropdownMenuItem
              className="text-xs cursor-pointer flex justify-between items-center"
              onSelect={() => changeValue({ 지역: item })}
              key={item}
            >
              <span>{item}</span>
              {filterValue.지역 === item && <Check className="w-4 h-4 text-main" />}
            </DropdownMenuItem>
          ))}
        </div>
      </SearchFilterField>
      <SearchFilterField iconSrc={moneyIcon} title="가격">
        <PriceRangeSlider />
      </SearchFilterField>
      <SearchFilterField iconSrc={calendarIcon} title="날짜">
        <div onClick={(e) => e.stopPropagation()}>
          <DateSelect />
        </div> 
      </SearchFilterField>
      <div className="flex gap-3">
        <SearchFilter.Reset>
          <div className="p-[0.69rem_0.56rem] border border-gray-200 rounded-main bg-white text-[0.77rem] transition-transform duration-200 hover:scale-105">
            <div className="flex items-center gap-[0.44rem] w-fit">초기화</div>
          </div>
        </SearchFilter.Reset>
        <SearchFilter.Search>
          <div className="p-[0.69rem_0.56rem] rounded-main bg-main text-white text-[0.77rem] transition-transform duration-200 hover:scale-105">
            <div className="flex items-center gap-[0.44rem] w-fit">
              <img className="" src={searchIcon} alt="" />
              검색
            </div>
          </div>
        </SearchFilter.Search>
      </div>
    </div>
  );
};

export default SearchFilterDesktop;
