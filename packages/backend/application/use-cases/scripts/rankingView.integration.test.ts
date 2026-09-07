import { afterAll, beforeAll, describe, expect, it } from "vitest";
import supabase from "@/infrastructure/supabase/client";
import { toDbPerformance } from "../3_load/mappers/toDbPerformance";
import { PerformanceDetail } from "@/shared/types/kopis";
import { ProgramExtractionResponse } from "@/shared/types/gemini";

// daily_ranking_with_details 뷰는 SQL이므로 조인이 깨져도 조용히 깨진다.
// 외부 환경 없이 시드 데이터로 뷰의 조인 결과를 결정적으로 검증한다.
// 뷰가 참조하는 세 테이블(performances/programs/daily_ranking)에 데이터를 넣고
// 뷰 조회 결과가 enrichment(포스터·가격·작곡가 집계)까지 포함하는지 확인한다.

// 뷰 검증 전용 시드 공연. syncPerformances.integration이 PF286762를 쓰므로
// 병렬 실행 시 서로의 행을 덮어쓰는 경합을 피하려고 별도 ID를 쓴다.
const SEED_ID = "PF_VIEW_001";

const performanceDetail = {
  mt20id: SEED_ID,
  mt10id: "FC_VIEW_001",
  prfnm: "뷰 검증용 정기연주회",
  prfpdfrom: "2026.09.30",
  prfpdto: "2026.09.30",
  fcltynm: "뷰 검증 콘서트홀",
  prfcast: "뷰 검증 출연진",
  prfcrew: "뷰 검증 지휘자",
  prfruntime: "1시간 50분",
  prfage: "만 7세 이상",
  entrpsnmP: null,
  entrpsnmA: "뷰 검증 기획사",
  entrpsnmH: null,
  entrpsnmS: null,
  pcseguidance: "R석 70,000원, S석 50,000원, A석 30,000원",
  poster: "http://www.kopis.or.kr/upload/pfmPoster/PF_VIEW_001.jpg",
  sty: "[프로그램] 뷰 검증용 줄거리",
  area: "서울특별시",
  genrenm: "서양음악(클래식)",
  prfstate: "공연예정",
  openrun: "N",
  visit: "N",
  child: "N",
  daehakro: "N",
  festival: "N",
  musicallicense: "N",
  musicalcreate: "N",
  updatedate: "2026-09-07 10:00:00",
  relates: {
    relate: {
      relatenm: "뷰검증 예매처",
      relateurl: "https://ticket.example.com/view",
    },
  },
  styurls: { styurl: "http://www.kopis.or.kr/upload/pfmIntroImage/view-1.jpg" },
  dtguidance: "수요일(19:30)",
} as unknown as PerformanceDetail;

// Vision OCR + Gemini가 내려줄 것으로 기대되는 프로그램 산출물 (결정적 시드)
const programJSON: ProgramExtractionResponse = [
  {
    composerKo: "루트비히 판 베토벤",
    composerEn: "Ludwig van Beethoven",
    workTitleKr: ["교향곡 제5번"],
    workTitleEn: ["Symphony No. 5"],
  },
  {
    composerKo: "프란츠 슈베르트",
    composerEn: "Franz Schubert",
    workTitleKr: ["미사 D장조"],
    workTitleEn: ["Mass in E-flat major"],
  },
];

const cleanup = async () => {
  // FK 참조 역순으로 정리한다.
  await supabase.from("daily_ranking").delete().eq("performance_id", SEED_ID);
  await supabase.from("programs").delete().eq("performance_id", SEED_ID);
  await supabase.from("performances").delete().eq("performance_id", SEED_ID);
};

describe("daily_ranking_with_details 뷰 (시드 기반 통합 검증)", () => {
  beforeAll(async () => {
    await cleanup(); // 이전 실행 잔재 제거

    // 1. performances 시드 — 실제 매퍼로 행을 만든다.
    //    toDbPerformance 결과에는 더 이상 존재하지 않는 program 키가 남아 있어 제거한다.
    //    (RPC는 필요한 키만 꺼내 쓰므로 문제없었지만, 직접 insert는 키 전체를 전송한다)
    const { program: _program, ...performanceRow } = toDbPerformance(
      performanceDetail,
      programJSON,
      "http://127.0.0.1:54321/storage/v1/object/public/posters/view-test.webp",
      ["http://www.kopis.or.kr/upload/pfmIntroImage/view-1.jpg"],
    );

    const { error: performanceError } = await supabase
      .from("performances")
      .upsert(performanceRow, { onConflict: "performance_id" });
    if (performanceError)
      throw new Error(`performances 시드 실패: ${performanceError.message}`);

    // 2. programs 시드 — 작곡가별 1곡씩.
    const programRows = programJSON.map((p) => ({
      performance_id: SEED_ID,
      composer_ko: p.composerKo,
      composer_en: p.composerEn,
      title_ko: p.workTitleKr[0] ?? null,
      title_en: p.workTitleEn[0] ?? null,
    }));
    const { error: programsError } = await supabase
      .from("programs")
      .insert(programRows);
    if (programsError)
      throw new Error(`programs 시드 실패: ${programsError.message}`);

    // 3. daily_ranking 시드 — bulk_update_concert_ranks RPC가 만드는 것과 동일한 형태.
    const { error: rankingError } = await supabase
      .from("daily_ranking")
      .upsert(
        {
          performance_id: SEED_ID,
          current_rank: 1,
          performance_name: performanceDetail.prfnm,
          period_from: performanceDetail.prfpdfrom,
          period_to: performanceDetail.prfpdto,
          area: performanceDetail.area,
          venue_name: performanceDetail.fcltynm,
        },
        { onConflict: "performance_id" },
      );
    if (rankingError)
      throw new Error(`daily_ranking 시드 실패: ${rankingError.message}`);
  });

  afterAll(async () => {
    await cleanup();
  });

  it("랭킹 행에 performances/programs 조인 결과(포스터·가격·작곡가)가 채워져 반환된다", async () => {
    const { data, error } = await supabase
      .from("daily_ranking_with_details")
      .select("*")
      .eq("performance_id", SEED_ID)
      .single();

    expect(error).toBeNull();
    expect(data).not.toBeNull();

    // daily_ranking 기본 데이터
    expect(data!.current_rank).toBe(1);
    expect(data!.performance_name).toBe(performanceDetail.prfnm);
    expect(data!.venue_name).toBe(performanceDetail.fcltynm);

    // performances LEFT JOIN (enrichment)
    expect(data!.poster).toContain("posters/view-test.webp");
    expect(data!.cast).toBe(performanceDetail.prfcast);
    expect(Array.isArray(data!.price)).toBe(true);

    // programs 집계 (composers_ko)
    expect(data!.composers_ko).toEqual(
      expect.arrayContaining(["루트비히 판 베토벤", "프란츠 슈베르트"]),
    );
  });
});
