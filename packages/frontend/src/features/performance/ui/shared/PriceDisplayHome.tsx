import { BREAKPOINTS } from "@/shared/constants";
import useBreakpoint from "@/shared/hooks/useBreakpoint";

interface PriceDisplayProps {
  minPrice: number | null;
  maxPrice: number | null;
}

const PriceFreeDisplay = () => {
  return (
    <span className="text-dark text-[0.88rem]/[1.31rem] font-semibold">
      전석 무료
    </span>
  );
};

const PriceSameDisplay = ({ minPrice }: { minPrice: number }) => {
  const formattedMin = minPrice.toLocaleString();
  return (
    <span className="text-dark text-[0.88rem]/[1.31rem] font-semibold">
      전석 {formattedMin}원
    </span>
  );
};

const PriceDisplayDesktop = ({ minPrice }: { minPrice: number }) => {
  const formattedMin = minPrice.toLocaleString();

  return (
    <p className="flex text-dark text-[0.88rem]/[1.31rem] font-semibold">
      {formattedMin}원
      <span className="mt-[0.1rem] text-[#6a7282] text-[0.77rem]/[1.09rem] font-normal">
        부터
      </span>
    </p>
  );
};

interface PriceDisplayMobileProps {
  minPrice: number;
  maxPrice: number;
}

const PriceDisplayMobile = ({
  minPrice,
  maxPrice,
}: PriceDisplayMobileProps) => {
  const formattedMin = minPrice.toLocaleString();
  const formattedMax = maxPrice.toLocaleString();

  return (
    <p className="text-dark text-[0.88rem]/[1.31rem] font-semibold">
      {formattedMin}원
      <span className="text-[#6a7282] text-[0.77rem]/[1.1rem] font-normal">
        {" "}
        ~{" "}
      </span>
      {formattedMax}원
    </p>
  );
};

export const Fallback = () => {
  return <span className="">가격 정보가 제공되지 않습니다.</span>;
};

export const PriceDisplay = ({ minPrice, maxPrice }: PriceDisplayProps) => {
  const isMobile = useBreakpoint(BREAKPOINTS.MOBILE);
  const isFree = minPrice === maxPrice && minPrice === 0;

  if (minPrice === null || maxPrice === null) {
    return <Fallback />;
  }

  return (
    <>
      {isFree ? (
        <PriceFreeDisplay />
      ) : minPrice === maxPrice ? (
        <PriceSameDisplay minPrice={minPrice} />
      ) : isMobile ? (
        <PriceDisplayMobile minPrice={minPrice} maxPrice={maxPrice} />
      ) : (
        <PriceDisplayDesktop minPrice={minPrice} />
      )}
    </>
  );
};
