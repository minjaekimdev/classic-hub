import locationIcon from "@shared/assets/icons/location-gray.svg";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import moneyIcon from "@shared/assets/icons/dollar-gray.svg";
import searchIcon from "@shared/assets/icons/search-white.svg";
import SearchField from "./SearchInputMobile";
import FilterFieldDesktop from "./FilterFieldDesktop";
import { DropdownMenuItem } from "@shared/ui/shadcn/dropdown-menu";
import PriceRangeSlider from "./PriceRangeSlider";
import { Calendar05 } from "./Calendar";
import type { filterCategoryObjType } from "@shared/model/filter";

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

interface FilterDesktopProps {
  filterValue: filterCategoryObjType;
  onChange: (value: filterCategoryObjType) => void;
}

const FilterDesktop = ({ filterValue, onChange }: FilterDesktopProps) => {
  return (
    <div className="grid grid-flow-col gap-[0.66rem] auto-cols-[2fr_1fr_1fr_1fr_auto] rounded-[0.875rem] border border-gray-200 bg-white shadow-xl p-[0.94rem] w-4xl">
      <SearchField filterValue={filterValue} onChange={onChange} />
      <FilterFieldDesktop icon={locationIcon} label={filterValue.location}>
        {locationArray.map((item) => (
          <DropdownMenuItem
            className="text-xs cursor-pointer"
            onSelect={() => onChange({ ...filterValue, location: item })}
          >
            {item}
          </DropdownMenuItem>
        ))}
      </FilterFieldDesktop>
      <FilterFieldDesktop icon={moneyIcon} label={filterValue.price}>
        <DropdownMenuItem className="focus:bg-transparent w-75">
          <PriceRangeSlider
            filterValue={filterValue}
            onChange={onChange}
          />
        </DropdownMenuItem>
      </FilterFieldDesktop>
      <FilterFieldDesktop icon={calendarIcon} label={filterValue.date}>
        <Calendar05 filterValue={filterValue} onChange={onChange} />
      </FilterFieldDesktop>
      <div className="flex gap-3">
        <button
          className="p-[0.69rem_0.56rem] border border-gray-200 rounded-main bg-white text-[0.77rem] transition-transform duration-200 hover:scale-105"
          onClick={() => {
            onChange({
              searchText: "",
              location: "지역",
              price: "가격",
              date: "날짜",
            });
          }}
        >
          <div className="flex items-center gap-[0.44rem] w-fit">초기화</div>
        </button>
        <button className="p-[0.69rem_0.56rem] rounded-main bg-main text-white text-[0.77rem] transition-transform duration-200 hover:scale-105">
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
