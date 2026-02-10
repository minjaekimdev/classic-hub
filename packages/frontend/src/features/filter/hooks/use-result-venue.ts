import formatArea from "@/shared/utils/formatArea";
import formatVenue from "@/shared/utils/formatVenue";
import type { DetailPerformance } from "@classic-hub/shared/types/client";
import REGION_LIST from "@classic-hub/shared/constants/region-list";
import type { Region } from "../types/filter";

type TempGroupMap = Record<
  string,
  {
    totalCount: number;
    venues: Record<string, number>;
  }
>;
const useResultVenue = (result: DetailPerformance[]): Region[] => {
  const venueObj = result.reduce<TempGroupMap>((acc, perf) => {
    const { area: rawArea, venue: rawVenue } = perf;
    /*
      {
        서울: {
          totalCount: 10,
          venues: {
            예술의전당: 2,
            ...
          }
        }
      }

    */
    const area = formatArea(rawArea);
    const venue = formatVenue(rawVenue);

    console.log(`result length: ${result.length}`);
    console.log(`area: ${area}, venue: ${venue}`);
    if (!acc[area]) {
      acc[area] = {
        totalCount: 0,
        venues: {},
      };
    }

    acc[area].totalCount += 1;
    acc[area].venues[venue] = (acc[area].venues[venue] || 0) + 1;

    return acc;
  }, {});

  /*
    [
      {
        name: 서울
        totalCount: 12,
        venues: [
          { name: 예술의전당, count: 3 }
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
    venues: Object.entries(venueObj[area].venues).map(([name, count]) => ({
      name,
      count,
    })),
  }));
};

export default useResultVenue;
