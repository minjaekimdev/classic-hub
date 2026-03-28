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
  useSearch,
} from "../../contexts/search-context.desktop";
import { REGION_LIST } from "@classic-hub/shared/constants/region-list";

const SearchFilterDesktop = () => {
  const { searchValue, changeValue } = useSearch();

  const areas = ["전체", ...REGION_LIST];

  return (
    <div className="gap-066 grid h-18 w-230 grid-cols-[2fr_1fr_1fr_1fr_auto] rounded-[0.875rem] border border-gray-200 bg-white p-[0.94rem] shadow-xl">
      <SearchInput />
      <SearchField iconSrc={locationIcon} field="location">
        <div onClick={(e) => e.stopPropagation()}>
          {areas.map((area) => (
            <DropdownMenuItem
              className="flex cursor-pointer items-center justify-between text-xs"
              onSelect={() => changeValue({ ...searchValue, location: area })}
              key={area}
            >
              <span>{area}</span>
              {searchValue.location === area && (
                <Check className="text-main h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </SearchField>
      <SearchField iconSrc={moneyIcon} field="price">
        <PriceRangeSlider />
      </SearchField>
      <SearchField iconSrc={calendarIcon} field="period">
        <div onClick={(e) => e.stopPropagation()}>
          <SearchFilterDateSelectDesktop />
        </div>
      </SearchField>
      <div className="flex gap-3">
        <SearchDesktop.Reset>
          <div className="rounded-main border border-gray-200 bg-white p-[0.69rem_0.56rem] text-[0.77rem] transition-transform duration-200 hover:scale-105">
            <div className="flex w-fit items-center gap-[0.44rem]">초기화</div>
          </div>
        </SearchDesktop.Reset>
        <SearchDesktop.Apply>
          <div className="rounded-main bg-main p-[0.69rem_0.56rem] text-[0.77rem] text-white transition-transform duration-200 hover:scale-105">
            <div className="flex w-fit items-center gap-[0.44rem]">
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
