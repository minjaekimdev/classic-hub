import { MAX_PRICE } from "../constants/max-value";
import type { SearchValue } from "../types/filter";

const usePriceSlider = (
  searchValue: SearchValue,
  changeValue: (value: SearchValue) => void,
) => {
  const { minPrice, maxPrice } = searchValue;

  const setPriceRange = (range: number[]) => {
    const min = String(range[0] * 10000);
    const max = String(range[1] * 10000);

    changeValue({ ...searchValue, minPrice: min, maxPrice: max });
  };

  const getCurrentSliderValue = () => {
    if (!searchValue.minPrice) {
      return [0, MAX_PRICE];
    }

    return [Number(minPrice) / 10000, Number(maxPrice) / 10000];
  };

  const sliderValue = getCurrentSliderValue();

  return {
    sliderValue,
    setPriceRange,
  };
};

export default usePriceSlider;
