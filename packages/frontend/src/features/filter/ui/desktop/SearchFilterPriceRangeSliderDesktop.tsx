import { Slider } from "@/shared/ui/shadcn/slider";
import { useSearchFilterDesktop } from "../../contexts/SearchFilterDesktop";

const $MAX_PRICE = 50;
const PriceRangeSlider = () => {
  const { searchValue, changeValue } = useSearchFilterDesktop();

  const setPriceRange = (range: number[]) => {
    const startPrice = `${range[0]}만`;
    const endPrice = range[1] >= 50 ? `${range[1]}만+` : `${range[1]}만`;

    changeValue({ 가격: `${startPrice} - ${endPrice}` });
  };

  const getCurrentSliderValue = () => {
    if (!searchValue.가격) {
      return [0, 50];
    }

    const [startPrice, endPrice] = searchValue.가격
      .split(" - ")
      .map((item) =>
        parseInt(item.replace("만+", "").replace("만", "").trim()),
      );

    return [startPrice, endPrice];
  };

  const sliderValue = getCurrentSliderValue();

  return (
    <div className="" onClick={(e) => e.stopPropagation()}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4 w-60">
          <h3 className="text-xs font-bold">가격 범위</h3>
          <span className="text-xs font-bold text-main">
            {searchValue.가격 ? searchValue.가격 : "0 - 50만+"}
          </span>
        </div>
        <Slider
          className="w-60 **:data-[slot='slider-range']:bg-main! **:data-[slot='slider-thumb']:border-main!"
          value={sliderValue}
          onValueChange={setPriceRange}
          min={0}
          max={50}
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
