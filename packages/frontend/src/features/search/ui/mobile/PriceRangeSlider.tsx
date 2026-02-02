import { Slider } from "@/shared/ui/shadcn/slider";
import type { filterCategoryObjType } from "../../types";

interface PriceRangeSliderProps {
  filterValue: filterCategoryObjType;
  onChange: (value: filterCategoryObjType) => void;
}

const $MAX_PRICE = 50;
const PriceRangeSlider = ({ filterValue, onChange }: PriceRangeSliderProps) => {
  const setPriceRange = (range: number[]) => {
    const startPrice = `${range[0]}만`;
    const endPrice = range[1] >= 50 ? `${range[1]}만+` : `${range[1]}만`;

    onChange({ ...filterValue, price: `${startPrice} - ${endPrice}` });
  };

  const getCurrentSliderValue = () => {
    if (!filterValue.price) {
      return [0, 50];
    }

    const [startPrice, endPrice] = filterValue.price
      .split(" - ")
      .map((item) => parseInt(item.replace("만+", "").replace("만", "").trim()));

    return [startPrice, endPrice];
  };

  const sliderValue = getCurrentSliderValue();

  return (
    <div className="w-full" onClick={(e) => e.stopPropagation()}>
      <div className="mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold">가격 범위</h3>
          <span className="text-xs font-bold text-main">
            {filterValue.price === "가격" ? "10 - 20만" : filterValue.price}
          </span>
        </div>
        <Slider
          value={sliderValue}
          onValueChange={setPriceRange}
          min={0}
          max={30}
          step={1}
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
