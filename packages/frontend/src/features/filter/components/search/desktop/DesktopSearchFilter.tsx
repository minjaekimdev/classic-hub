import { useRef } from "react";
import { SearchFilter, type FilterHandle } from "./SearchFilter";
import type {FilterValue} from "../../../hooks/useSearchFilter";
import { LOCATION_LIST } from "../constants/location-list";
import locationIcon from "@shared/assets/icons/location-gray.svg";
import moneyIcon from "@shared/assets/icons/dollar-gray.svg";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import { DropdownMenuItem } from "@/shared/ui/shadcn/dropdown-menu";
import PriceRangeSlider from "./PriceRangeSlider";
import { DateSelect } from "./DateSelect";

const DesktopSearchFilter = () => {
  const filterRef = useRef<FilterHandle>(null);

  const handleChange = (value: Partial<FilterValue>) => {
    filterRef.current?.changeValue(value);
  }

  return (
    <SearchFilter ref={filterRef}>
      <SearchFilter.Input />
      <SearchFilter.Field
        iconSrc={locationIcon}
        title="지역"
      >
        {LOCATION_LIST.map((item) => (
          <DropdownMenuItem
            className="text-xs cursor-pointer"
            onSelect={() => handleChange({ location: item })}
          >
            {item}
          </DropdownMenuItem>
        ))}
      </SearchFilter.Field>
      <SearchFilter.Field
        iconSrc={moneyIcon}
        title="가격"
      >
        <DropdownMenuItem className="focus:bg-transparent w-75">
          <PriceRangeSlider />
        </DropdownMenuItem>
      </SearchFilter.Field>
      <SearchFilter.Field
        iconSrc={calendarIcon}
        title="날짜"
      >
        <DateSelect />
      </SearchFilter.Field>
    </SearchFilter>
  );
};

export default DesktopSearchFilter;
