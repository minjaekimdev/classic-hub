import supabase from "@/app/api/supabase-client";
import type { Hall } from "@classic-hub/shared/types/client";
import { getMappedFacilityData, type RawType } from "../mappers/venue-detail.mapper";

const getHallName = (venueName: string) => {
  const match = venueName.match(/\(([^)]+)\)/);
  const result = match ? match[1] : venueName;
  return result;
};

const getVenueInfo = async (
  venueId: string,
  venueName: string,
): Promise<Hall | null> => {
  // ID가 없거나 Mock 데이터에 없으면 기본값 혹은 null 반환
  const { error, data } = await supabase
    .from("halls")
    .select(
      `
      seat_count,
      facilities (
        tel,
        url,
        adress,
        has_restaurant,
        has_cafe,
        has_store,
        has_nolibang,
        has_suyu,
        has_parking,
        has_disabled_parking,
        has_disabled_restroom,
        has_disabled_ramp,
        has_disabled_elevator
      )
      `,
    )
    .eq("facility_id", venueId)
    .eq("name", getHallName(venueName))
    .returns<RawType[]>();

  if (error || !data || data.length === 0) {
    console.log("[FETCH_FAIL] 공연장 정보 가져오기 실패", error);
    return null;
  } 

  return getMappedFacilityData(data[0]);  
};

export default getVenueInfo;