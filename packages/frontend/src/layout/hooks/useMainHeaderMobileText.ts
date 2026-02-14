import useQueryParams from "@/shared/hooks/useParams";

const useMainHeaderMobileText = () => {
  const { filters } = useQueryParams();
  const {
    keyword: rawKeyword,
    location: rawLocation,
    minPrice,
    maxPrice,
    startDate,
    endDate,
  } = filters;

  const keyword = rawKeyword ? rawKeyword : "";
  const location = rawLocation ? rawLocation : "";

  let priceText = "";
  if (minPrice && !maxPrice) {
    priceText = `${Number(minPrice) / 10000}만 -`;
  }
  if (minPrice && maxPrice) {
    priceText = `${Number(minPrice) / 10000}만 - ${Number(maxPrice) / 10000}만`;
  }

  let periodText = "";
  if (startDate) {
    const year = startDate.slice(0, 4);
    const month = startDate.slice(4, 6);
    const day = startDate.slice(6, 8);
    if (endDate) {
      if (startDate === endDate) {
        periodText += `${year}년 ${month}월 ${day}일`;
      } else {
        const [year, month, day] = endDate.split("-");
        periodText += ` ~ ${year}년 ${month}월 ${day}일`;
      }
    }
  }

  // 1. 순서대로 배열 정의 (우선순위: 검색어 -> 지역 -> 가격 -> 날짜)
  const allFilters = [keyword, location, priceText, periodText];
  const hasFilters = allFilters.filter((item) => item);
  
  return hasFilters.join(", ");
};

export default useMainHeaderMobileText;
