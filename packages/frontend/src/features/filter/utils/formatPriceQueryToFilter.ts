import { MAX_PRICE } from "../constants/max-value";

const formatPriceQueryToFilter = (
  minPrice: string | null,
  maxPrice: string | null,
) => {
  const minString = Number(minPrice) / 10000;
  const maxString = Number(maxPrice) / 10000;
  if (!minPrice && maxPrice) {
    return `0만 - ${maxString}만+`;
  }
  if (minPrice && !maxPrice) {
    return `${minString}만 - ${MAX_PRICE}만+`;
  }
  if (!minPrice && !maxPrice) {
    return `0만 - ${MAX_PRICE}만+`;
  }
  return `${minString}만 - ${maxString}만`;
};

export default formatPriceQueryToFilter;
