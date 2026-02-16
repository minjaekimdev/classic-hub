import useQueryParams from "@/shared/hooks/useParams";

const useSmallFilterInfo = () => {
  const { filters } = useQueryParams();
  const { keyword: rawKeyword, location: rawLocation, minPrice, maxPrice, startDate, endDate } = filters;

  const keyword = rawKeyword ? rawKeyword : "";
  const location = rawLocation ? rawLocation : "";

  let priceText = "";
  if (minPrice && !maxPrice) {
    priceText = `${Number(minPrice) / 10000}만 -`;
  }
  if (minPrice && maxPrice) {
    priceText = `${Number(minPrice) / 10000}만 - ${Number(maxPrice) / 10000}만`;
  }

  let dateText = "";
  if (startDate) {
    const [year, month, day] = startDate.split("-");
    if (endDate) {
      if (startDate === endDate) {
        dateText += `${year}년 ${month}월 ${day}일`;
      } else {
        const [year, month, day] = endDate.split("-");
        dateText += ` ~ ${year}년 ${month}월 ${day}일`;
      }
    }
  }

  return {
    keyword,
    location,
    priceText,
    dateText,
  };
};

export default useSmallFilterInfo;
