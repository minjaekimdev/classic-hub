interface ResultPriceDisplay {
  minPrice: number | null;
  maxPrice: number | null;
}

const ResultPriceDisplay = ({ minPrice, maxPrice }: ResultPriceDisplay) => {
  const fontStyle = "text-[#155dfc] text-[0.77rem]/[1.09rem] font-semibold";

  // 가격 정보가 제공되지 않는 경우
  if (minPrice === null || maxPrice === null) {
    return <span className={`${fontStyle}`}>-</span>;
  }

  const formattedMin = minPrice.toLocaleString();
  const formattedMax = maxPrice.toLocaleString();

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
