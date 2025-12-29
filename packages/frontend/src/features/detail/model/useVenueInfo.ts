import type { VenueData } from "../components/shared/VenueInfo"; // 타입은 적절한 곳에서 import

// 1. 가짜 데이터 셋을 만듭니다. (ID를 키로 사용)
const MOCK_VENUE_DB: Record<string, VenueData> = {
  // 롯데콘서트홀 ID
  "FC001513": {
    address: "서울특별시 송파구 올림픽로 300",
    tel: "1544-7744",
    seatscale: "2036",
    link: "http://www.lotteconcerthall.com",
    facilities: {
      restaurant: true, cafe: true, store: true, nolibang: false, suyu: true,
      parkbarrier: true, restbarrier: true, runwbarrier: true, elevbarrier: true, parkinglot: true,
    },
  },
  // 세종문화회관 ID (예시)
  "FC000001": {
    address: "서울특별시 종로구 세종대로 175",
    tel: "02-399-1114",
    seatscale: "3022",
    link: "https://www.sejongpac.or.kr",
    facilities: {
      restaurant: true, cafe: true, store: false, nolibang: false, suyu: true,
      parkbarrier: false, restbarrier: true, runwbarrier: true, elevbarrier: false, parkinglot: true,
    },
  },
};

// 2. 훅을 만듭니다.
export const useVenueInfo = (venueId: string | undefined) => {
  // ID가 없거나 Mock 데이터에 없으면 기본값 혹은 null 반환
  if (!venueId || !MOCK_VENUE_DB[venueId]) {
    return null; 
  }

  return MOCK_VENUE_DB[venueId];
};