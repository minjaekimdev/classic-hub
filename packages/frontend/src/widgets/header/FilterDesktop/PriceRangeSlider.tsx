import { Slider } from "@shared/ui/shadcn/slider";
import type { SetStateAction } from "react";
import type { filterCategoryObjType } from "../DesktopHeader";

interface PriceRangeSliderProps {
  filterValue: filterCategoryObjType;
  onSelect: React.Dispatch<SetStateAction<filterCategoryObjType>>;
}

const $MAX_PRICE = 30;
const PriceRangeSlider = ({ filterValue, onSelect }: PriceRangeSliderProps) => {
  const setPriceRange = (range: number[]) => {
    const startPrice = `${range[0]}만`;
    const endPrice = range[1] >= 30 ? `${range[1]}만+` : `${range[1]}만`;

    onSelect({...filterValue, price: `${startPrice} - ${endPrice}`});
  };
  return (
    <div className="" onClick={(e) => e.stopPropagation()}>
      <div className="w-75 mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold">가격 범위</h3>
          <span className="text-xs font-bold text-main">
            {filterValue.price === "가격" ? "10 - 20만" : filterValue.price}
          </span>
        </div>
        <Slider
          defaultValue={[10, 20]}
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
