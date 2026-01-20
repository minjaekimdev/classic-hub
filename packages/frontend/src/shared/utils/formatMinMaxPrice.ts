import type { Price } from "@classic-hub/shared/types/database";

const formatMinMaxPrice = (price: Price[]) => {

  if (price.length === 0) {
    return { min: 0, max: 0 };
  }

  const [maxPrice, minPrice] = price.reduce(
    (acc, e) => {
      if (e.price > acc[0]) acc[0] = e.price;
      if (e.price < acc[1]) acc[1] = e.price;
      return acc;
    },
    [0, Number.MAX_SAFE_INTEGER],
  );

  return {
    min: minPrice,
    max: maxPrice,
  };
};

export default formatMinMaxPrice;
