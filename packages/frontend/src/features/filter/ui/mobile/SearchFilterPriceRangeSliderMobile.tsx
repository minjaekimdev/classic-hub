import { Slider } from "@/shared/ui/shadcn/slider";
import { useSearchFilterMobile } from "../../contexts/search-mobile-context";
import { MAX_PRICE } from "../../constants/max-value";

const SearchFilterMobilePriceRangeSlider = () => {
  const { filters, updateFilters } = useSearchFilterMobile();
  const setPriceRange = (range: number[]) => {
    const startPrice = `${range[0]}만`;
    const endPrice = range[1] >= MAX_PRICE ? `${range[1]}만+` : `${range[1]}만`;

    updateFilters({ ...filters, price: `${startPrice} - ${endPrice}` });
  };

  const getCurrentSliderValue = () => {
    if (!filters.price) {
      return [0, MAX_PRICE];
    }

    const [startPrice, endPrice] = filters.price
      .split(" - ")
      .map((item) =>
        parseInt(item.replace("만+", "").replace("만", "").trim()),
      );

    return [startPrice, endPrice];
  };

  const sliderValue = getCurrentSliderValue();

  return (
    <div className="w-full" onClick={(e) => e.stopPropagation()}>
      <div className="mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold">가격 범위</h3>
          <span className="text-xs font-bold text-main">
            {filters.price === "" ? `0 - ${MAX_PRICE}만+` : filters.price}
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
