import formatArea from "@/shared/utils/formatArea";
import formatVenue from "@/shared/utils/formatVenue";
import type { DetailPerformance } from "@classic-hub/shared/types/client";
import REGION_LIST from "@classic-hub/shared/constants/region-list";
import type { Region } from "../types/filter";

type TempGroupMap = Record<
  string,
  {
    totalCount: number;
    venues: Record<string, { name: string; count: number }>;
  }
>;
const useResultVenue = (result: DetailPerformance[]): Region[] => {
  const venueObj = result.reduce<TempGroupMap>((acc, perf) => {
    const { area: rawArea, venue: rawVenue, venueId } = perf;
    /* 중간 객체 예시
      {
        서울: {
          totalCount: 10,
          venues: {
            PF1234: {
              name: 예술의전당,
              count: 2,
            },
            ...
          }
        }
      }
    */

    const area = formatArea(rawArea);
    const venue = formatVenue(rawVenue);

    if (!acc[area]) {
      acc[area] = {
        totalCount: 0,
        venues: {},
      };
    }

    if (!acc[area].venues[venueId]) {
      acc[area].venues[venueId] = {
        name: venue,
        count: 0,
      };
    }

    acc[area].totalCount++;
    acc[area].venues[venueId].count++;

    return acc;
  }, {});

  /* 리턴 배열 예시
    [
      {
        name: 서울
        totalCount: 12,
        venues: [
          { id: PF1234, name: 예술의전당, count: 3 }
           ...
        ]
      }
      ...
    ]
  */

  // 배열 형태로 가공하기
  return REGION_LIST.filter((area) => venueObj[area]).map((area) => ({
    name: area,
    totalCount: venueObj[area].totalCount,
    venues: Object.entries(venueObj[area].venues).map(([key, value]) => ({
      id: key,
      name: value.name,
      count: value.count,
    })).sort((a, b) => b.count - a.count),
  }));
};

export default useResultVenue;
