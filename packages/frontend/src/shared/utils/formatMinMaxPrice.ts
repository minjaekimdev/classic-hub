import type { Price } from "@classic-hub/shared/types/common";

const formatMinMaxPrice = (price: Price[] | null) => {
  if (!price) {
    return {
      minPrice: null,
      maxPrice: null,
    };
  }
  if (price.length === 0) {
    return { minPrice: 0, maxPrice: 0 };
  }

  const prices = price.map((item) => item.price);

  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
  };
};

export default formatMinMaxPrice;
