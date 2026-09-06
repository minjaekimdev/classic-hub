import { describe, it, expect } from "vitest";
import { getMinMaxPrice } from "./getMinMaxPrice";
import { Price } from "@classic-hub/shared/types/common";

describe("getMinMaxPrice", () => {
  // 시나리오 1: 여러 구간의 최소/최대 가격
  it("여러 좌석 등급이 있으면 최소/최대 가격을 반환한다", () => {
    const prices: Price[] = [
      { seatType: "R석", price: 80000 },
      { seatType: "S석", price: 50000 },
      { seatType: "VIP석", price: 120000 },
    ];

    expect(getMinMaxPrice(prices)).toEqual({
      minPrice: 50000,
      maxPrice: 120000,
    });
  });

  // 시나리오 2: 입력 순서와 무관하게 계산 (정렬 보장 없는 입력 방어)
  it("입력 순서가 정렬되어 있지 않아도 올바른 최소/최대를 반환한다", () => {
    const prices: Price[] = [
      { seatType: "S석", price: 50000 },
      { seatType: "R석", price: 80000 },
    ];

    expect(getMinMaxPrice(prices)).toEqual({
      minPrice: 50000,
      maxPrice: 80000,
    });
  });

  // 시나리오 3: 단일 구간 - 최소와 최대가 동일
  it("좌석 등급이 하나면 minPrice와 maxPrice가 같다", () => {
    const prices: Price[] = [{ seatType: "전석", price: 40000 }];

    expect(getMinMaxPrice(prices)).toEqual({
      minPrice: 40000,
      maxPrice: 40000,
    });
  });

  // 시나리오 4: 무료 좌석(0원) 포함 - 0이 최소가 된다
  it("0원 항목이 있으면 minPrice는 0이다", () => {
    const prices: Price[] = [
      { seatType: "전석", price: 0 },
      { seatType: "R석", price: 50000 },
    ];

    expect(getMinMaxPrice(prices)).toEqual({
      minPrice: 0,
      maxPrice: 50000,
    });
  });

  // 시나리오 5: 빈 배열 - 가격 정보가 없는 공연 (DB nullable 컬럼 대응)
  it("빈 배열이면 minPrice/maxPrice 모두 null이다", () => {
    expect(getMinMaxPrice([])).toEqual({ minPrice: null, maxPrice: null });
  });
});
