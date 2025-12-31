import locationIcon from "@shared/assets/icons/location-blue.svg";
import calendarIcon from "@shared/assets/icons/calendar-purple.svg";
import moneyIcon from "@shared/assets/icons/dollar-orange.svg";
import searchWhite from "@shared/assets/icons/search-white.svg";
import closeIcon from "@shared/assets/icons/close-gray.svg";
import FilterFieldMobile from "./FilterFieldMobile";
import { useState, type SetStateAction } from "react";
import type { filterCategoryObjType } from "@/features/filter/model/filter";
import LocationSelectMobile from "./LocationSelectMobile";
import FilterSearchInputMobile from "./FilterSearchInputMobile";
import FilterFieldContentMobile from "./FilterFieldContentMobile";
import { Calendar05 } from "./Calendar";
import PriceRangeSlider from "./PriceRangeSlider";

interface HeaderProps {
  onClose: React.Dispatch<SetStateAction<boolean>>;
}

const Header = ({ onClose }: HeaderProps) => {
  return (
    <div className="flex flex-col gap-[0.33rem] border-b border-b-[rgba(0,0,0,0.1)] px-[1.31rem] pt-[1.31rem] pb-[0.94rem]">
      <div className="flex justify-between items-center">
        <h3 className="text-dark text-[0.88rem]/[1.31rem] font-semibold">
          검색 필터
        </h3>
        <img
          src={closeIcon}
          alt=""
          className="w-[1.31rem] h-[1.31rem] cursor-pointer"
          onClick={() => onClose(false)}
        />
      </div>
      <span className="text-[#717182] text-[0.77rem]/[1.09rem]">
        원하는 공연을 찾아보세요
      </span>
    </div>
  );
};

const filterFieldTitleArray = [
  {
    iconSrc: locationIcon,
    label: "지역",
    subtitle: "가까운 지역의 공연 찾기",
  },
  {
    iconSrc: calendarIcon,
    label: "날짜",
    subtitle: "관람하고 싶은 날짜를 선택하세요",
  },
  {
    iconSrc: moneyIcon,
    label: "가격대",
    subtitle: "예산에 맞는 공연 찾기",
  },
];

interface FilterMobileProps {
  onClickClose: () => void;
}

const FilterMobile = ({ onClickClose }: FilterMobileProps) => {
  // 검색어는 별도의 상태로 관리
  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState<filterCategoryObjType>({
    location: "",
    date: "",
    price: "",
  });
  // 현재 어떤 카테고리가 선택되었는지
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const filterValueChange = (value: filterCategoryObjType) => {
    setFilterValue(value);
  };

  const showFieldContent = () => {
    if (selectedField === "지역") {
      return (
        <LocationSelectMobile
          filterValue={filterValue}
          onChange={filterValueChange}
        />
      );
    } else if (selectedField === "날짜") {
      return (
        <div className="border rounded-main border-[rgba(0,0,0,0.1)] p-[0.72rem]">
          <Calendar05 filterValue={filterValue} onChange={filterValueChange} />
        </div>
      );
    } else if (selectedField === "가격대") {
      return (
        <div className="bg-[#F9FAFB] rounded-main">
          <PriceRangeSlider
            filterValue={filterValue}
            onChange={filterValueChange}
          />
        </div>
      );
    }
  };

  return (
    <div className="fixed bottom-0 z-99 left-0 flex flex-col rounded-tl-[1.31rem] rounded-tr-[1.31rem] bg-white w-screen h-[90vh]">
      <div className="flex-none">
        <Header onClose={onClickClose} />
        <div className="border-b border-b-[rgba(0,0,0,0.1)] px-[1.31rem] py-[0.88rem]">
          <FilterSearchInputMobile
            value={searchText}
            onChange={setSearchText}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-[0.62rem] px-[1.31rem] py-[0.88rem]">
          <span className="text-[#364153] text-[0.77rem]/[1.09rem] font-medium">
            추천 필터
          </span>
          {filterFieldTitleArray.map((item) => (
            <FilterFieldMobile
              key={item.label}
              iconSrc={item.iconSrc}
              label={item.label}
              subtitle={item.subtitle}
              filterValue={filterValue}
              onSelect={setSelectedField}
            />
          ))}
        </div>
        {selectedField && (
          <FilterFieldContentMobile fieldName={selectedField}>
            {showFieldContent()}
          </FilterFieldContentMobile>
        )}
      </div>

      <div className="flex-none flex gap-[0.66rem] px-[1.31rem] py-[0.88rem]">
        <button
          className="grow flex justify-center items-center button border border-[rgba(0,0,0,0.1)] h-[1.97rem] text-[#0a0a0a] text-[0.77rem]/[1.09rem]"
          onClick={() => {
            setSearchText("");
            filterValueChange({
              location: "",
              date: "",
              price: "",
            });
            setSelectedField(null);
          }}
        >
          전체 삭제
        </button>
        <button className="grow flex justify-center items-center gap-[0.88rem] rounded-button bg-main h-[1.97rem] text-white text-[0.77rem]/[1.09rem]">
          <img src={searchWhite} alt="" className="" />
          검색
        </button>
      </div>
    </div>
  );
};

export default FilterMobile;
