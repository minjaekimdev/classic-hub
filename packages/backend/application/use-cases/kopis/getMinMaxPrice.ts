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

  return price.reduce(
    (acc, item) => ({
      minPrice: Math.min(acc.minPrice, item.price),
      maxPrice: Math.max(acc.maxPrice, item.price),
    }),
    { minPrice: price[0].price, maxPrice: price[0].price },
  );
};
