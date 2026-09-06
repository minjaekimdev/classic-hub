import { describe, it, expect } from "vitest";
import { toDbPerformance } from "./toDbPerformance";
import { PerformanceDetail } from "@/shared/types/kopis";
import { ProgramExtractionResponse } from "@/shared/types/gemini";

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
      { relatenm: "예스24", relateurl: "https://ticket.yes24.com/example" },
    ],
  },
  styurls: { styurl: "http://www.kopis.or.kr/upload/detail/1.jpg" },
  dtguidance: "화요일 ~ 금요일(20:00)",
  ...overrides,
});

// Gemini 프로그램 추출 응답 샘플 (programExtractionSchema와 동일한 구조)
const programJSON: ProgramExtractionResponse = [
  {
    composerKo: "루드비히 반 베토벤",
    composerEn: "Ludwig van Beethoven",
    workTitleKr: ["바이올린 소나타 제5번 '봄'"],
    workTitleEn: ["Violin Sonata No. 5 'Spring'"],
  },
];

describe("toDbPerformance", () => {
  // 시나리오 1: 입력 샘플 → 기대되는 DB 행 전체 기록
  // 이 객체의 키 목록이 upsert_performances_bulk RPC의 payload 계약이다.
  it("KOPIS 상세 + 프로그램 JSON을 DB 행 형태로 매핑한다", () => {
    const storagePosterUrl =
      "https://example.supabase.co/storage/v1/object/public/posters/PF240658.webp";
    const detailUrlArray = [
      "http://www.kopis.or.kr/upload/detail/1.jpg",
      "http://www.kopis.or.kr/upload/detail/2.jpg",
    ];

    const result = toDbPerformance(
      makePerformanceDetail(),
      programJSON,
      storagePosterUrl,
      detailUrlArray,
    );

    expect(result).toEqual({
      performance_id: "PF240658",
      venue_id: "FC001431",
      performance_name: "베토벤 바이올린 소나타 전곡 시리즈",
      area: "서울특별시",
      period_from: "2026.08.01",
      period_to: "2026.08.31",
      venue_name: "세종문화회관 M씨어터",
      cast: "김출연, 이출연",
      runtime: "2시간",
      age: "만 8세 이상",
      price: [
        { seatType: "R석", price: 80000 },
        { seatType: "S석", price: 50000 },
      ],
      min_price: 50000,
      max_price: 80000,
      poster: storagePosterUrl,
      detail_image: detailUrlArray,
      state: "공연예정",
      booking_links: [
        { name: "인터파크", url: "https://tickets.interpark.com/example" },
        { name: "예스24", url: "https://ticket.yes24.com/example" },
      ],
      time: "화요일 ~ 금요일(20:00)",
      raw_data: {
        prfcrew: "박제작",
        entrpsnmP: "클래식제작사",
        entrpsnmA: "클래식기획사",
        entrpsnmH: "세종문화회관",
        entrpsnmS: "클래식주관사",
        sty: "베토벤의 바이올린 소나타를 전곡 연주하는 시리즈.",
        genrenm: "클래식",
        openrun: "N",
        visit: "N",
        child: "N",
        daehakro: "N",
        festival: "N",
        musicallicense: "N",
        musicalcreate: "N",
        updatedate: "2026-07-01 10:00:00",
      },
      program: programJSON,
    });
  });

  // 시나리오 2: 포스터는 KOPIS 원본 URL이 아니라 storage URL을 저장한다 (계약)
  // 원본 이미지는 storage에 이미 업로드된 상태이며, DB는 업로드된 결과만 참조한다.
  it("poster 컬럼에는 storage URL을 저장하고 KOPIS 원본 URL은 버린다", () => {
    const result = toDbPerformance(
      makePerformanceDetail(),
      programJSON,
      "https://example.supabase.co/storage/v1/object/public/posters/PF240658.webp",
      [],
    );

    expect(result.poster).toBe(
      "https://example.supabase.co/storage/v1/object/public/posters/PF240658.webp",
    );
  });

  // 시나리오 3: 가격 정보 없는 공연 - min/max는 null이고 price는 빈 배열
  // (KOPIS가 가격 안내를 빈 값으로 줄 수 있으며, DB의 min_price/max_price는 nullable)
  it("가격 정보가 null이면 price는 빈 배열, min/max 가격은 null이다", () => {
    const result = toDbPerformance(
      makePerformanceDetail({
        pcseguidance: null as unknown as string,
      }),
      programJSON,
      "poster.webp",
      [],
    );

    expect(result.price).toEqual([]);
    expect(result.min_price).toBeNull();
    expect(result.max_price).toBeNull();
  });

  // 시나리오 4: 무료 공연 - 전석무료는 price 0으로 기록된다
  it("『전석무료』 공연은 min/max 가격이 0이다", () => {
    const result = toDbPerformance(
      makePerformanceDetail({ pcseguidance: "전석무료" }),
      programJSON,
      "poster.webp",
      [],
    );

    expect(result.price).toEqual([{ seatType: "전석", price: 0 }]);
    expect(result.min_price).toBe(0);
    expect(result.max_price).toBe(0);
  });

  // 시나리오 5: raw_data에는 명시적으로 매핑되지 않은 나머지 원본 필드가 보존된다
  // (매핑 누락 방어용 원본 백업 역할. 분해 대상에서 뺀 필드가 정확히 남는지 기록)
  it("raw_data에 매핑되지 않은 원본 필드가 보존된다", () => {
    const result = toDbPerformance(
      makePerformanceDetail(),
      programJSON,
      "poster.webp",
      [],
    );

    expect(result.raw_data).toEqual({
      prfcrew: "박제작",
      entrpsnmP: "클래식제작사",
      entrpsnmA: "클래식기획사",
      entrpsnmH: "세종문화회관",
      entrpsnmS: "클래식주관사",
      sty: "베토벤의 바이올린 소나타를 전곡 연주하는 시리즈.",
      genrenm: "클래식",
      openrun: "N",
      visit: "N",
      child: "N",
      daehakro: "N",
      festival: "N",
      musicallicense: "N",
      musicalcreate: "N",
      updatedate: "2026-07-01 10:00:00",
    });
  });

  // 시나리오 6: 프로그램 JSON은 변형 없이 그대로 저장된다
  it("program 컬럼에 Gemini 추출 결과를 그대로 저장한다", () => {
    const result = toDbPerformance(
      makePerformanceDetail(),
      programJSON,
      "poster.webp",
      [],
    );

    expect(result.program).toEqual(programJSON);
  });
});
