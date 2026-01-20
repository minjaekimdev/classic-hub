import type { DBdailyRankingWithDetails } from "@classic-hub/shared/types/database";
import type { HomePerformance } from "@classic-hub/shared/types/client";

const mapToHomePerformance = (
  raw: DBdailyRankingWithDetails,
): HomePerformance => {
  const getParsedDate = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const [startDate, endDate] = raw.period.split("~");
    const startDayIdx = new Date(startDate.replaceAll(".", "-")).getDay();
    const endDayIdx = new Date(endDate.replaceAll(".", "-")).getDay();

    if (startDate === endDate) {
      return `${startDate}(${days[startDayIdx]})`;
    }
    return `${startDate}(${days[startDayIdx]}) ~ ${endDate}(${days[endDayIdx]})`;
  }

  const getPriceString = () => {
    const rawPrice = raw.price;
    console.log(raw);

    if (rawPrice.length === 0) {
      return { min: 0, max: 0 };
    }

    const [maxPrice, minPrice] = rawPrice.reduce(
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

  return {
    id: raw.performance_id,
    title: raw.performance_name,
    rank: raw.current_rank,
    poster: raw.poster,
    artist: raw.cast,
    date: getParsedDate(),
    venue: raw.venue_name,
    price: getPriceString(),
  };
};

export default mapToHomePerformance;
