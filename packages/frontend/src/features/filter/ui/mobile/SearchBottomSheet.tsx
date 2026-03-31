import searchWhite from "@shared/assets/icons/search-white.svg";
import closeIcon from "@shared/assets/icons/close-gray.svg";
import FilterFieldMobile from "./SearchFilterFieldMobile";
import LocationSelectMobile from "./SearchFilterLocationSelectMobile";
import FilterSearchInputMobile from "./SearchFilterInputMobile";
import FilterFieldContentMobile from "./SearchFilterFieldContentMobile";
import { Calendar05 } from "./SearchFilterDateSelectMobile";
import PriceRangeSlider from "./SearchFilterPriceRangeSliderMobile";
import SearchMobile, {
  useSearchMobile,
} from "../../contexts/search-context.mobile";
import { filterFieldTitleArray } from "../../utils/search-filter-strategy.mobile";
import { BottomSheetWrapper } from "@/app/providers/bottom-sheet/BottomSheetWrapper";
import { useBottomSheet } from "@/app/providers/bottom-sheet/useBottomSheet";

const Header = () => {
  const { closeBottomSheet } = useBottomSheet();
  return (
    <div className="gap-033 flex flex-col border-b border-b-[rgba(0,0,0,0.1)] px-[1.31rem] pt-[1.31rem] pb-[0.94rem]">
      <div className="flex items-center justify-between">
        <h3 className="text-dark text-[0.88rem]/[1.31rem] font-semibold">
          검색 필터
        </h3>
        <img
          src={closeIcon}
          alt=""
          className="h-[1.31rem] w-[1.31rem] cursor-pointer"
          onClick={closeBottomSheet}
        />
      </div>
      <span className="text-[0.77rem]/[1.09rem] text-[#717182]">
        원하는 공연을 찾아보세요
      </span>
    </div>
  );
};

const SearchBottomSheet = () => {
  const { activeField, reset } = useSearchMobile();
  const showFieldContent = () => {
    if (activeField === "location") {
      return <LocationSelectMobile />;
    } else if (activeField === "period") {
      return (
        <div className="rounded-main border border-[rgba(0,0,0,0.1)] p-[0.72rem]">
          <Calendar05 />
        </div>
      );
    } else if (activeField === "price") {
      return (
        <div className="rounded-main bg-[#F9FAFB]">
          <PriceRangeSlider />
        </div>
      );
    }
  };

  return (
    <BottomSheetWrapper>
      <div
        className="flex h-[90vh] flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-none">
          <Header />
          <div className="py-088 border-b border-b-[rgba(0,0,0,0.1)] px-[1.31rem]">
            <FilterSearchInputMobile />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="py-088 flex flex-col gap-[0.62rem] px-[1.31rem]">
            <span className="text-composer-dark text-[0.77rem]/[1.09rem] font-medium">
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

        <div className="gap-066 py-088 flex flex-none px-[1.31rem]">
          <button
            className="button rounded-button text-dark flex h-[1.97rem] grow items-center justify-center border border-[rgba(0,0,0,0.1)] text-[0.77rem]/[1.09rem]"
            onClick={reset}
          >
            전체 삭제
          </button>
          <div className="grow">
            <SearchMobile.Apply>
              <button className="gap-088 rounded-button bg-main flex h-[1.97rem] w-full items-center justify-center text-[0.77rem]/[1.09rem] text-white">
                <img src={searchWhite} alt="" className="" />
                검색
              </button>
            </SearchMobile.Apply>
          </div>
        </div>
      </div>
    </BottomSheetWrapper>
  );
};

export default SearchBottomSheet;
