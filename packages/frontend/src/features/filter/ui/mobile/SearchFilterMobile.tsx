import searchWhite from "@shared/assets/icons/search-white.svg";
import closeIcon from "@shared/assets/icons/close-gray.svg";
import FilterFieldMobile from "./SearchFilterFieldMobile";
import LocationSelectMobile from "./SearchFilterLocationSelectMobile";
import FilterSearchInputMobile from "./SearchFilterInputMobile";
import FilterFieldContentMobile from "./SearchFilterFieldContentMobile";
import { Calendar05 } from "./SearchFilterDateSelectMobile";
import PriceRangeSlider from "./SearchFilterPriceRangeSliderMobile";
import { useBottomSheet } from "@/shared/ui/bottom-sheet/BottomSheet";
import SearchMobile, {
  useSearchMobile,
} from "../../contexts/search-context.mobile";
import { filterFieldTitleArray } from "../../utils/search-filter-strategy.mobile";

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

const SearchFilterMobile = () => {
  const { activeField, reset } = useSearchMobile();
  const showFieldContent = () => {
    if (activeField === "location") {
      return <LocationSelectMobile />;
    } else if (activeField === "period") {
      return (
        <div className="border rounded-main border-[rgba(0,0,0,0.1)] p-[0.72rem]">
          <Calendar05 />
        </div>
      );
    } else if (activeField === "price") {
      return (
        <div className="bg-[#F9FAFB] rounded-main">
          <PriceRangeSlider />
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
          <FilterSearchInputMobile />
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
        {activeField && (
          <FilterFieldContentMobile fieldName={activeField}>
            {showFieldContent()}
          </FilterFieldContentMobile>
        )}
      </div>

      <div className="flex-none flex gap-[0.66rem] px-[1.31rem] py-[0.88rem]">
        <button
          className="grow flex justify-center items-center button border border-[rgba(0,0,0,0.1)] rounded-button h-[1.97rem] text-dark text-[0.77rem]/[1.09rem]"
          onClick={reset}
        >
          전체 삭제
        </button>
        <div className="grow">
          <SearchMobile.Apply>
            <button className="flex justify-center items-center gap-[0.88rem] rounded-button bg-main w-full h-[1.97rem] text-white text-[0.77rem]/[1.09rem]">
              <img src={searchWhite} alt="" className="" />
              검색
            </button>
          </SearchMobile.Apply>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterMobile;
