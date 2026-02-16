import locationIcon from "@shared/assets/icons/location-gray.svg";
import moneyIcon from "@shared/assets/icons/dollar-gray.svg";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import PriceRangeSlider from "./SearchFilterPriceRangeSliderDesktop";
import { SearchFilterDateSelectDesktop } from "./SearchFilterDateSelectDesktop";
import searchIcon from "@shared/assets/icons/search-white.svg";
import { Check } from "lucide-react";
import { DropdownMenuItem } from "@/shared/ui/shadcn/dropdown-menu";
import SearchInput from "./SearchFilterInputDesktop";
import SearchField from "./SearchFilterFieldDesktop";
import SearchDesktop, {
  useSearchFilterDesktop,
} from "../../contexts/SearchFilterDesktop";
import { LOCATION_LIST } from "../../constants/category-list";

const SearchFilterDesktop = () => {
  const { searchValue, changeValue } = useSearchFilterDesktop();

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-[0.66rem] rounded-[0.875rem] border border-gray-200 bg-white shadow-xl p-[0.94rem] w-230 h-18">
      <SearchInput />
      <SearchField iconSrc={locationIcon} title="지역">
        <div onClick={(e) => e.stopPropagation()}>
          {LOCATION_LIST.map((item) => (
            <DropdownMenuItem
              className="text-xs cursor-pointer flex justify-between items-center"
              onSelect={() => changeValue({ 지역: item })}
              key={item}
            >
              <span>{item}</span>
              {searchValue.지역 === item && (
                <Check className="w-4 h-4 text-main" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </SearchField>
      <SearchField iconSrc={moneyIcon} title="가격">
        <PriceRangeSlider />
      </SearchField>
      <SearchField iconSrc={calendarIcon} title="날짜">
        <div onClick={(e) => e.stopPropagation()}>
          <SearchFilterDateSelectDesktop />
        </div>
      </SearchField>
      <div className="flex gap-3">
        <SearchDesktop.Reset>
          <div className="p-[0.69rem_0.56rem] border border-gray-200 rounded-main bg-white text-[0.77rem] transition-transform duration-200 hover:scale-105">
            <div className="flex items-center gap-[0.44rem] w-fit">초기화</div>
          </div>
        </SearchDesktop.Reset>
        <SearchDesktop.Apply>
          <div className="p-[0.69rem_0.56rem] rounded-main bg-main text-white text-[0.77rem] transition-transform duration-200 hover:scale-105">
            <div className="flex items-center gap-[0.44rem] w-fit">
              <img className="" src={searchIcon} alt="" />
              검색
            </div>
          </div>
        </SearchDesktop.Apply>
      </div>
    </div>
  );
};

export default SearchFilterDesktop;
