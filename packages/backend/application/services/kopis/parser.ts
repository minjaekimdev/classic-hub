import { BookingLink as KopisBookingLink } from "@/models/kopis";
import { BookingLink } from "@classic-hub/shared/types/common";

// "전석 40,000원" 형태인 경우 [ { seatType: '전석', price: 40000 } ]
// "전석무료" 인 경우 빈 배열 반환
export const getParsedPrice = (raw: string) => {
  // "R석 12,345원" 형태의 그룹을 캡쳐하기 위한 정규표현식
  const regex = /([가-힣A-Z]+)\s+([\d,]+)원/g;

  const matches = raw.matchAll(regex);
  const parsedPrice = [];
  for (const match of matches) {
    const seatType = match[1];
    const price = Number(match[2].replace(/,/g, ""));
    parsedPrice.push({ seatType, price });
  }

  return parsedPrice;
};

export const getParsedBookingLinks = (
  raw: KopisBookingLink | KopisBookingLink[],
): BookingLink[] => {
  const bookingLinks = Array.isArray(raw) ? raw : [raw];
  return bookingLinks.map((item) => ({
    name: item.relatenm,
    url: item.relateurl,
  }));
};