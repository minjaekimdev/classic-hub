import { Slider } from "@/shared/ui/shadcn/slider";
import { MAX_PRICE } from "../../constants/max-value";
import formatPriceToKo from "@/shared/utils/formatPriceToKo";
import usePriceSlider from "../../hooks/usePriceSlider";
import { useSearchMobile } from "../../contexts/search-context.mobile";

const SearchFilterMobilePriceRangeSlider = () => {
  const { searchValue, changeValue } = useSearchMobile();
  const { sliderValue, setPriceRange } = usePriceSlider(
    searchValue,
    changeValue,
  );

  return (
    <div className="w-full" onClick={(e) => e.stopPropagation()}>
      <div className="mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold">가격 범위</h3>
          <span className="text-xs font-bold text-main">
            {searchValue.minPrice === ""
              ? `0 - ${MAX_PRICE}만+`
              : formatPriceToKo(searchValue.minPrice, searchValue.maxPrice)}
          </span>
        </div>
        <Slider
          className="w-full **:data-[slot='slider-range']:bg-main! **:data-[slot='slider-thumb']:border-main!"
          value={sliderValue}
          onValueChange={setPriceRange}
          min={0}
          max={MAX_PRICE}
          step={1}
        />
        <div className="flex justify-between text-xs mt-2 text-gray-500">
          <span>₩0</span>
          <span>₩{MAX_PRICE}만+</span>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterMobilePriceRangeSlider;
