interface PriceDisplayProps {
  isMobile: boolean;
  minPrice: number;
  maxPrice: number;
}

const PriceDisplay = ({ isMobile, minPrice, maxPrice }: PriceDisplayProps) => {
  const formattedMin = minPrice.toLocaleString();
  const formattedMax = maxPrice.toLocaleString();

  const fontStyle = "text-dark text-[0.88rem]/[1.31rem] font-semibold";

  // 1. 단일 가격인 경우 (전석 무료 or 전석 x원)
  if (minPrice === maxPrice) {
    if (minPrice === 0) {
      return <span className={`${fontStyle}`}>전석 무료</span>;
    }
    return <span className={`${fontStyle}`}>전석 {formattedMin}원</span>;
  }

  // 2. 가격 범위가 있는 경우 (모바일 vs 데스크탑)
  if (isMobile) {
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
  }

  return (
    <p className={`flex ${fontStyle}`}>
      {formattedMin}원
      <span className="mt-[0.1rem] text-[#6a7282] text-[0.77rem]/[1.09rem] font-normal">
        부터
      </span>
    </p>
  );
};

export default PriceDisplay;
