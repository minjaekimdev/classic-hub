import { describe, it, expect } from "vitest";
import { mapExternalToInternal } from "./mapExternalToInternal";
import { PerformanceDetail } from "@/shared/types/kopis";

// 헬퍼: KOPIS 상세 응답의 대표 샘플. 필요한 필드만 overrides로 교체한다.
const makePerformanceDetail = (
  overrides: Partial<PerformanceDetail> = {},
): PerformanceDetail => ({
  mt20id: "PF240658",
  mt10id: "FC001431",
  prfnm: "베토벤 바이올린 소나타 전곡 시리즈",
  prfpdfrom: "2026.08.01",
  prfpdto: "2026.08.31",
  fcltynm: "세종문화회관 M씨어터",
  prfcast: "김출연, 이출연",
  prfcrew: "박제작",
  prfruntime: "2시간",
  prfage: "만 8세 이상",
  entrpsnmP: "클래식제작사",
  entrpsnmA: "클래식기획사",
  entrpsnmH: "세종문화회관",
  entrpsnmS: "클래식주관사",
  pcseguidance: "R석 80,000원, S석 50,000원",
  poster: "http://www.kopis.or.kr/upload/poster/000168/240658_m.jpg",
  sty: "베토벤의 바이올린 소나타를 전곡 연주하는 시리즈.",
  area: "서울특별시",
  genrenm: "클래식",
  prfstate: "공연예정",
  openrun: "N",
  visit: "N",
  child: "N",
  daehakro: "N",
  festival: "N",
  musicallicense: "N",
  musicalcreate: "N",
  updatedate: "2026-07-01 10:00:00",
  relates: {
    relate: [
      {
        relatenm: "인터파크",
        relateurl: "https://tickets.interpark.com/example",
      },
    ],
  },
  styurls: { styurl: "http://www.kopis.or.kr/upload/detail/1.jpg" },
  dtguidance: "화요일 ~ 금요일(20:00)",
  ...overrides,
});

describe("mapExternalToInternal", () => {
  // 시나리오 1: KOPIS 필드 → 내부 필드 1:1 매핑 기록 (명세 = InternalPerformance)
  it("KOPIS 상세 데이터를 내부 공연 객체로 매핑한다", () => {
    const rawData = makePerformanceDetail();
    const posterBuffer = Buffer.from("poster");
    const detailImageBuffers = [Buffer.from("detail1")];

    const result = mapExternalToInternal(
      rawData,
      posterBuffer,
      detailImageBuffers,
    );

    expect(result).toEqual({
      performanceId: "PF240658",
      venueId: "FC001431",
      title: "베토벤 바이올린 소나타 전곡 시리즈",
      startDate: "2026.08.01",
      endDate: "2026.08.31",
      venueName: "세종문화회관 M씨어터",
      cast: "김출연, 이출연",
      crew: "박제작",
      runtime: "2시간",
      ageLimit: "만 8세 이상",
      productionCompany: "클래식제작사",
      agencyCompany: "클래식기획사",
      hostCompany: "세종문화회관",
      organizerCompany: "클래식주관사",
      priceInfo: "R석 80,000원, S석 50,000원",
      posterUrl: "http://www.kopis.or.kr/upload/poster/000168/240658_m.jpg",
      posterImage: posterBuffer,
      description: "베토벤의 바이올린 소나타를 전곡 연주하는 시리즈.",
      area: "서울특별시",
      genre: "클래식",
      status: "공연예정",
      isOpenRun: "N",
      isVisit: "N",
      isChildFriendly: "N",
      isDaehakro: "N",
      isFestival: "N",
      isMusicalLicense: "N",
      isMusicalCreate: "N",
      updatedAt: "2026-07-01 10:00:00",
      bookingLinks: [
        {
          relatenm: "인터파크",
          relateurl: "https://tickets.interpark.com/example",
        },
      ],
      detailImages: detailImageBuffers,
      scheduleInfo: "화요일 ~ 금요일(20:00)",
    });
  });

  // 시나리오 2: 예매처가 단일 객체로 오는 경우 (KOPIS는 1개일 때 배열이 아닌 객체를 준다)
  it("예매처가 단일 객체면 배열로 정규화한다", () => {
    const rawData = makePerformanceDetail({
      relates: {
        relate: {
          relatenm: "단일예매처",
          relateurl: "https://single.example.com",
        },
      },
    });

    const result = mapExternalToInternal(rawData, null, []);

    expect(result.bookingLinks).toEqual([
      { relatenm: "단일예매처", relateurl: "https://single.example.com" },
    ]);
  });

  // 시나리오 3: 예매처가 배열로 오는 경우 그대로 유지
  it("예매처가 배열이면 항목 순서를 유지한 채 전달한다", () => {
    const rawData = makePerformanceDetail({
      relates: {
        relate: [
          { relatenm: "인터파크", relateurl: "https://interpark.example.com" },
          { relatenm: "예스24", relateurl: "https://yes24.example.com" },
        ],
      },
    });

    const result = mapExternalToInternal(rawData, null, []);

    expect(result.bookingLinks).toEqual([
      { relatenm: "인터파크", relateurl: "https://interpark.example.com" },
      { relatenm: "예스24", relateurl: "https://yes24.example.com" },
    ]);
  });

  // 시나리오 4: 이미지 버퍼는 가공 없이 그대로 전달된다 (정합성 계약: 완전한 형태의 버퍼)
  it("포스터/상세 이미지 버퍼를 참조 동일성까지 보존한다", () => {
    const posterBuffer = Buffer.from("poster-bytes");
    const detailImageBuffers = [Buffer.from("d1"), Buffer.from("d2")];

    const result = mapExternalToInternal(
      makePerformanceDetail(),
      posterBuffer,
      detailImageBuffers,
    );

    expect(result.posterImage).toBe(posterBuffer);
    expect(result.detailImages).toBe(detailImageBuffers);
  });

  // 시나리오 5: 포스터 버퍼가 null인 경우 (다운로드 실패 등)
  it("포스터 버퍼가 null이면 posterImage도 null이다", () => {
    const result = mapExternalToInternal(makePerformanceDetail(), null, []);

    expect(result.posterImage).toBeNull();
  });
});
