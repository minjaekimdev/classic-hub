import formatArea from "@/shared/utils/formatArea";
import formatVenue from "@/shared/utils/formatVenue";
import type { DetailPerformance } from "@classic-hub/shared/types/client";
import { REGION_LIST } from "@classic-hub/shared/constants/region-list";
import type { Location } from "@classic-hub/shared/types/common";

// 결과값의 개별 아이템 타입 정의
interface VenueGroup {
  name: Location;
  totalCount: number;
  venues: {
    id: string;
    name: string;
    count: number;
  }[];
}

// 누적 계산을 위한 임시 맵 타입 (Key를 Region으로 제한)
type TempGroupMap = Partial<Record<Location, {
  totalCount: number;
  venues: Record<string, { name: string; count: number }>;
}>>;

const useResultVenue = (result: DetailPerformance[]): VenueGroup[] => {
  const venueObj = result.reduce<TempGroupMap>((acc, perf) => {
    const { area: rawArea, venue: rawVenue, venueId } = perf;

    // 데이터가 없거나 변환에 실패하면 해당 데이터는 건너뜀 (acc를 그대로 반환해야 함)
    if (!rawArea || !rawVenue || !venueId) {
      return acc;
    }

    const area = formatArea(rawArea);
    if (!area) return acc; // 매핑되지 않는 지역인 경우

    const venueName = formatVenue(rawVenue);

    // 1. 해당 지역 초기화
    if (!acc[area]) {
      acc[area] = {
        totalCount: 0,
        venues: {},
      };
    }

    // 2. 해당 공연장 초기화
    const targetArea = acc[area]!;
    if (!targetArea.venues[venueId]) {
      targetArea.venues[venueId] = {
        name: venueName,
        count: 0,
      };
    }

    // 3. 카운팅
    targetArea.totalCount++;
    targetArea.venues[venueId].count++;

    return acc;
  }, {});

  // REGION_LIST 순서대로 정렬하여 결과 배열 생성
  return REGION_LIST.reduce<VenueGroup[]>((acc, area) => {
    const data = venueObj[area];
    
    if (data) {
      acc.push({
        name: area,
        totalCount: data.totalCount,
        venues: Object.entries(data.venues)
          .map(([id, info]) => ({
            id,
            name: info.name,
            count: info.count,
          }))
          .sort((a, b) => b.count - a.count),
      });
    }
    return acc;
  }, []);
};

export default useResultVenue;