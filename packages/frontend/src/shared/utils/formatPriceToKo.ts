import { MAX_PRICE } from "../../features/filter/constants/max-value";

const formatPriceToKo = (
  minPrice: string | null | "",
  maxPrice: string | null | "",
) => {
  const minString = Number(minPrice) / 10000;
  const maxString = Number(maxPrice) / 10000;

  if (maxPrice) {
    if (maxString == MAX_PRICE) {
      return `${minString}만 - ${MAX_PRICE}만+`;
    }
    return `${minString}만 - ${maxString}만`;
  }
  return `${minString}만 - ${MAX_PRICE}만+`;
};

export default formatPriceToKo;
