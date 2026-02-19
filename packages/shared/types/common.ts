import type {REGION_LIST} from "../constants/region-list";

// 좌석 및 가격 정보
export interface Price {
  seatType: string;
  price: number;
}

// 예매처 정보
export interface BookingLink {
  name: string;
  url: string;
}

export type Location = (typeof REGION_LIST)[number];