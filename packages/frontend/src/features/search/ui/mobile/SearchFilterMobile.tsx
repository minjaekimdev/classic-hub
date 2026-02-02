import locationIcon from "@shared/assets/icons/location-blue.svg";
import calendarIcon from "@shared/assets/icons/calendar-purple.svg";
import moneyIcon from "@shared/assets/icons/dollar-orange.svg";
import searchWhite from "@shared/assets/icons/search-white.svg";
import closeIcon from "@shared/assets/icons/close-gray.svg";
import FilterFieldMobile from "./SearchFieldMobile";
import LocationSelectMobile from "./LocationSelectMobile";
import FilterSearchInputMobile from "./FilterSearchInputMobile";
import FilterFieldContentMobile from "./SearchFieldContentMobile";
import { Calendar05 } from "./Calendar";
import PriceRangeSlider from "./PriceRangeSlider";
import { useBottomSheet } from "@/shared/ui/bottom-sheet/BottomSheet";
import { useSearchMobile } from "../../hooks/SearchMobile";

const Header = () => {
  const { close } = useBottomSheet();
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
          onClick={close}
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

const SearchFilterMobile = () => {
  const {activeCategory, reset} = useSearchMobile();
  const showFieldContent = () => {
    if (activeCategory === "location") {
      return (
        <LocationSelectMobile
        />
      );
    } else if (activeCategory === "date") {
      return (
        <div className="border rounded-main border-[rgba(0,0,0,0.1)] p-[0.72rem]">
          <Calendar05/>
        </div>
      );
    } else if (activeCategory === "price") {
      return (
        <div className="bg-[#F9FAFB] rounded-main">
          <PriceRangeSlider
          />
        </div>
      );
    }
  };

  return (
    <div
      className="fixed bottom-0 z-99 left-0 flex flex-col rounded-tl-[1.31rem] rounded-tr-[1.31rem] bg-white w-screen h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex-none">
        <Header />
        <div className="border-b border-b-[rgba(0,0,0,0.1)] px-[1.31rem] py-[0.88rem]">
          <FilterSearchInputMobile
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
            />
          ))}
        </div>
        {activeCategory && (
          <FilterFieldContentMobile fieldName={activeCategory}>
            {showFieldContent()}
          </FilterFieldContentMobile>
        )}
      </div>

      <div className="flex-none flex gap-[0.66rem] px-[1.31rem] py-[0.88rem]">
        <button
          className="grow flex justify-center items-center button border border-[rgba(0,0,0,0.1)] h-[1.97rem] text-dark text-[0.77rem]/[1.09rem]"
          onClick={reset}
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

export default SearchFilterMobile;
