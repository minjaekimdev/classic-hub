interface ResultPriceDisplay {
  minPrice: number;
  maxPrice: number;
}

const ResultPriceDisplay = ({ minPrice, maxPrice }: ResultPriceDisplay) => {
  const formattedMin = minPrice.toLocaleString();
  const formattedMax = maxPrice.toLocaleString();

  const fontStyle = "text-[#155dfc] text-[0.77rem]/[1.09rem] font-semibold";

  // 1. 단일 가격인 경우 (전석 무료 or 전석 x원)
  if (minPrice === maxPrice) {
    if (minPrice === 0) {
      return <span className={`${fontStyle}`}>전석 무료</span>;
    }
    return <span className={`${fontStyle}`}>전석 {formattedMin}원</span>;
  }

  // 2. 가격 범위가 있는 경우 (모바일 vs 데스크탑)

  return (
    <p className={`${fontStyle}`}>
      {formattedMin}원
      <span className="text-[#6a7282] text-[0.77rem]/[1.1rem font-normal]">
        {" "}
        ~{" "}
      </span>
      {formattedMax}원
    </p>
  );
};

export default ResultPriceDisplay;
