import { Slider } from "@/shared/ui/shadcn/slider";
import { useSearchFilterDesktop } from "../../contexts/search-desktop-context";
import formatPriceQueryToFilter from "../../utils/formatPriceQueryToFilter";
import { MAX_PRICE } from "../../constants/max-value";

const $MAX_PRICE = 50;
const PriceRangeSlider = () => {
  const { searchValue, changeValue } = useSearchFilterDesktop();

  const handleSetPriceRange = (range: number[]) => {
    changeValue({
      ...searchValue,
      minPrice: String(range[0] * 10000),
      maxPrice: String(range[1] * 10000),
    });
  };

  const getCurrentSliderValue = () => {
    if (!searchValue.minPrice) {
      return [0, MAX_PRICE];
    }

    const [startPrice, endPrice] = [
      Number(searchValue.minPrice) / 10000,
      Number(searchValue.maxPrice) / 10000,
    ];

    return [startPrice, endPrice];
  };

  return (
    <div className="" onClick={(e) => e.stopPropagation()}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4 w-60">
          <h3 className="text-xs font-bold">가격 범위</h3>
          <span className="text-xs font-bold text-main">
            {searchValue.minPrice
              ? formatPriceQueryToFilter(
                  searchValue.minPrice,
                  searchValue.maxPrice,
                )
              : `0 - ${MAX_PRICE}만+`}
          </span>
        </div>
        <Slider
          className="w-60 **:data-[slot='slider-range']:bg-main! **:data-[slot='slider-thumb']:border-main!"
          value={getCurrentSliderValue()}
          onValueChange={handleSetPriceRange}
          min={0}
          max={MAX_PRICE}
        />
        <div className="flex justify-between text-xs mt-2 text-gray-500">
          <span>₩0</span>
          <span>₩{$MAX_PRICE}만+</span>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
