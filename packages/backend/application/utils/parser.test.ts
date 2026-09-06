import { describe, it, expect } from "vitest";
import { getParsedPrice, getParsedBookingLinks } from "./parser";
import { BookingLink as KopisBookingLink } from "@/shared/types/kopis";

describe("getParsedPrice", () => {
  // 시나리오 1: 단일 구간 가격 파싱
  it("『전석 40,000원』 형태를 seatType/price 객체로 파싱한다", () => {
    expect(getParsedPrice("전석 40,000원")).toEqual([
      { seatType: "전석", price: 40000 },
    ]);
  });

  // 시나리오 2: 다중 구간 가격 파싱 - 콤마로 구분된 여러 가격이 각각 파싱된다
  it("여러 좌석 등급의 가격을 각각 파싱한다", () => {
    expect(getParsedPrice("R석 80,000원, S석 50,000원")).toEqual([
      { seatType: "R석", price: 80000 },
      { seatType: "S석", price: 50000 },
    ]);
  });

  // 시나리오 3: 콤마가 포함된 가격 숫자 정규화 (문자열 콤마 제거)
  it("가격의 천 단위 콤마를 제거한 숫자로 반환한다", () => {
    const result = getParsedPrice("VIP석 1,234,567원");
    expect(result[0].price).toBe(1234567);
  });

  // 시나리오 4: 무료 공연
  it("『전석무료』는 price 0인 단일 항목으로 반환한다", () => {
    expect(getParsedPrice("전석무료")).toEqual([{ seatType: "전석", price: 0 }]);
  });

  // 시나리오 5: 가격 정보 자체가 없는 경우
  it("null이면 빈 배열을 반환한다", () => {
    expect(getParsedPrice(null)).toEqual([]);
  });

  // 시나리오 6: 가격 문장이 포함되지 않은 문자열
  it("가격 문구가 없는 문자열이면 빈 배열을 반환한다", () => {
    expect(getParsedPrice("가격 미정")).toEqual([]);
  });

  // 시나리오 7: 앞뒤 공백 방어
  it("앞뒤 공백이 있어도 파싱한다", () => {
    expect(getParsedPrice("  전석 10,000원  ")).toEqual([
      { seatType: "전석", price: 10000 },
    ]);
  });

  // 시나리오 8: 영문 좌석 등급 (정규표현식 [가-힣A-Z] 계약)
  it("영문 좌석 등급(VIP)도 파싱한다", () => {
    expect(getParsedPrice("VIP 120,000원")).toEqual([
      { seatType: "VIP", price: 120000 },
    ]);
  });
});

describe("getParsedBookingLinks", () => {
  const link: KopisBookingLink = {
    relatenm: "인터파크",
    relateurl: "https://tickets.interpark.com/example",
  };

  // 시나리오 1: 단일 객체 → 배열로 정규화 + 필드명 매핑
  it("단일 예매처 객체를 1개짜리 배열로 정규화한다", () => {
    expect(getParsedBookingLinks(link)).toEqual([
      { name: "인터파크", url: "https://tickets.interpark.com/example" },
    ]);
  });

  // 시나리오 2: 배열 입력은 그대로 매핑
  it("배열 입력의 모든 항목을 name/url로 매핑한다", () => {
    const links: KopisBookingLink[] = [
      link,
      { relatenm: "예스24", relateurl: "https://ticket.yes24.com/example" },
    ];

    expect(getParsedBookingLinks(links)).toEqual([
      { name: "인터파크", url: "https://tickets.interpark.com/example" },
      { name: "예스24", url: "https://ticket.yes24.com/example" },
    ]);
  });

  // 시나리오 3: 예매처가 없는 경우 null 유지 (DB nullable 컬럼 대응)
  it("null이면 null을 반환한다", () => {
    expect(getParsedBookingLinks(null)).toBeNull();
  });
});
