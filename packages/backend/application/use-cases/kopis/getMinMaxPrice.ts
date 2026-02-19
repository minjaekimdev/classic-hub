import { Price } from "@classic-hub/shared/types/common";

interface MinMaxObjType {
  minPrice: number | null;
  maxPrice: number | null;
}

export const getMinMaxPrice = (price: Price[]): MinMaxObjType => {
  if (price.length === 0) {
    return {
      minPrice: null,
      maxPrice: null,
    };
  }

  const prices = price.map((item) => item.price);

  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
  }
};
