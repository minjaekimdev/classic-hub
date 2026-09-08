import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { http, HttpResponse, passthrough } from "msw";
import { setupServer } from "msw/node";
import sharp from "sharp";
import { createSyncPerformanceData } from "./syncPerformances";
import { retry } from "@/application/services/retry";
import { kopisRateLimiter } from "@/application/services/kopisRateLimiter";
import logger from "@/shared/utils/logger";
import { callDatabaseFunction, getColumnData } from "@/infrastructure/supabase/database";
import supabase from "@/infrastructure/supabase/client";
import { kopisService } from "@/infrastructure/kopis/service";
import { imageFetcher } from "@/infrastructure/kopis/utils/image-fetcher";
import { geminiService } from "@/infrastructure/gemini/service";
import { uploadPosterToStorage } from "../scripts/uploadPosterToStorage";
import { createGetPerformanceIdsInPage } from "../1_extract/infra/getPerformanceIdsInPage";
import { createGetDbPerformanceIds } from "../1_extract/infra/getDbPerformanceIds";
import { createGetAllPerformanceIdList } from "../1_extract/flows/getAllPerformanceIdList";
import { createGetPerformanceDetailList } from "../1_extract/flows/getPerformanceDetailList";
import { compareNewOld } from "../1_extract/flows/compareNewOld";
import { createExtractPerformances } from "../1_extract/extractPerformances";
import { createGetProgramText } from "../2_transform/program/getProgramText";
import { createGetProgramJSON } from "../2_transform/program/getProgramJSON";
import { createTransformPerformances } from "../2_transform/transformPerformances";
import { programExtractionSchema } from "shared/types/gemini";

const FIXTURE_ID = "PF_ITEST_001";
const FIXTURE_POSTER_URL = "http://fixture.local/poster.jpg";
const FIXTURE_DETAIL_URL = "http://fixture.local/detail-1.jpg";
const LOCAL_SUPABASE_ORIGIN = "http://127.0.0.1:54321";

const KOPIS_LIST_XML = `<?xml version="1.0" encoding="UTF-8"?>
<dbs>
  <db>
    <mt20id>${FIXTURE_ID}</mt20id>
    <prfnm>통합 테스트 공연</prfnm>
  </db>
</dbs>`;

const KOPIS_EMPTY_XML = `<?xml version="1.0" encoding="UTF-8"?>
<dbs></dbs>`;

const KOPIS_DETAIL_XML = `<?xml version="1.0" encoding="UTF-8"?>
<dbs>
  <db>
    <mt20id>${FIXTURE_ID}</mt20id>
    <mt10id>FC_ITEST_001</mt10id>
    <prfnm>통합 테스트 공연</prfnm>
    <prfpdfrom>2026.09.01</prfpdfrom>
    <prfpdto>2026.09.30</prfpdto>
    <fcltynm>테스트 공연장</fcltynm>
    <prfcast>홍길동</prfcast>
    <prfcrew>김지휘</prfcrew>
    <prfruntime>120분</prfruntime>
    <prfage>8세 이상</prfage>
    <entrpsnmP>테스트 제작사</entrpsnmP>
    <pcseguidance>R석 12,000원</pcseguidance>
    <poster>${FIXTURE_POSTER_URL}</poster>
    <sty>클래식의 밤, 베토벤 교향곡을 만난다.</sty>
    <area>서울</area>
    <genrenm>클래식</genrenm>
    <prfstate>공연예정</prfstate>
    <openrun>N</openrun>
    <visit>N</visit>
    <child>N</child>
    <daehakro>N</daehakro>
    <festival>N</festival>
    <musicallicense>N</musicallicense>
    <musicalcreate>N</musicalcreate>
    <updatedate>2026.09.01</updatedate>
    <dtguidance>화~일 19:30</dtguidance>
    <relates>
      <relate>
        <relatenm>인터파크</relatenm>
        <relateurl>https://ticket.fixture.local</relateurl>
      </relate>
    </relates>
    <styurls>
      <styurl>${FIXTURE_DETAIL_URL}</styurl>
    </styurls>
  </db>
</dbs>`;

const GEMINI_TEXT = JSON.stringify([
  {
    composerKo: "루트비히 판 베토벤",
    composerEn: "Ludwig van Beethoven",
    workTitleKr: ["교향곡 제5번"],
    workTitleEn: ["Symphony No. 5"],
  },
]);

const GEMINI_RESPONSE = {
  candidates: [
    {
      content: { parts: [{ text: GEMINI_TEXT }], role: "model" },
      finishReason: "STOP",
    },
  ],
  usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20, totalTokenCount: 30 },
};

const server = setupServer(
  // passthrough: msw가 가짜 데이터를 돌려주지 않고, 실제 로컬 컴퓨터에서 떠 있는
  // Supabase 포트(54322)로 요청을 그대로 전달한다.
  http.all(/127\.0\.0\.1:54321\//, () => passthrough()),
  http.get("http://www.kopis.or.kr/openApi/restful/pblprfr", ({ request }) => {
    const page = new URL(request.url).searchParams.get("cpage");
    return HttpResponse.xml(page === "1" ? KOPIS_LIST_XML : KOPIS_EMPTY_XML);
  }),
  http.get(
    `http://www.kopis.or.kr/openApi/restful/pblprfr/${FIXTURE_ID}`,
    () => HttpResponse.xml(KOPIS_DETAIL_XML),
  ),
  http.post(/generativelanguage\.googleapis\.com\/v1beta\/models\/.*:generateContent/, () =>
    HttpResponse.json(GEMINI_RESPONSE),
  ),
);

beforeAll(async () => {
  server.listen({ onUnhandledRequest: "error" });

  const poster = await sharp({
    create: {
      width: 60,
      height: 90,
      channels: 3,
      background: { r: 200, g: 30, b: 30 },
    },
  })
    .jpeg()
    .toBuffer();
  const detail = await sharp({
    create: {
      width: 600,
      height: 800,
      channels: 3,
      background: { r: 250, g: 250, b: 250 },
    },
  })
    .jpeg()
    .toBuffer();

  server.use(
    http.get(FIXTURE_POSTER_URL, () =>
      new HttpResponse(poster, {
        headers: { "Content-Type": "image/jpeg" },
      }),
    ),
    http.get(FIXTURE_DETAIL_URL, () =>
      new HttpResponse(detail, {
        headers: { "Content-Type": "image/jpeg" },
      }),
    ),
  );

  await supabase.from("performances").delete().eq("performance_id", FIXTURE_ID);
});

afterAll(async () => {
  server.close();
  await supabase.from("performances").delete().eq("performance_id", FIXTURE_ID);
  await supabase.storage.from("performances").remove([`${FIXTURE_ID}/poster.webp`]);
});

describe("syncPerformances 통합 테스트 (KOPIS/Gemini = msw, Supabase = 로컬 진짜)", () => {
  it("Gemini 픽스처 응답은 programExtractionSchema 계약을 통과한다", () => {
    const parsed = programExtractionSchema.safeParse(JSON.parse(GEMINI_TEXT));

    expect(parsed.success).toBe(true);
  });

  it("픽스처 공연 1건이 파이프라인을 통과해 로컬 DB에 완성된 행으로 적재된다", async () => {
    const fetchPage = createGetPerformanceIdsInPage(kopisService);
    const getAllPerformanceIdList = createGetAllPerformanceIdList({
      fetchPage,
      rateLimiter: kopisRateLimiter,
      notify: async () => {},
      log: logger,
      sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    });
    const getDbPerformanceIds = createGetDbPerformanceIds({ getColumnData });
    const getPerformanceDetailList = createGetPerformanceDetailList({
      getPerformanceDetail: (id) => kopisService.getPerformanceDetail(id),
      rateLimiter: kopisRateLimiter,
      sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
      log: logger,
    });
    const extractPerformances = createExtractPerformances({
      getDbPerformanceIds,
      compareNewOld,
      getAllPerformanceIdList,
      getPerformanceDetailList,
      log: logger,
    });

    const getProgramText = createGetProgramText({
      detectText: async () => "교향곡 제5번 루트비히 판 베토벤",
    });
    const getProgramJSON = createGetProgramJSON({
      generateContent: (params) => geminiService.generateContent(params),
      log: logger,
    });
    const transformPerformances = createTransformPerformances({
      imageFetcher,
      getProgramText,
      getProgramJSON,
      uploadPosterToStorage,
      log: logger,
    });

    const syncPerformanceData = createSyncPerformanceData({
      extractPerformances,
      transformPerformances,
      retry,
      insertPerformancesBulk: (payload) =>
        callDatabaseFunction("upsert_performances_bulk", { payload }),
      notify: async () => {},
      saveFailuresToArtifact: () => {},
      failedRecordsFilename: "failed_records.json",
      log: logger,
    });

    await syncPerformanceData("20260101", "20261231", "20250101", "20261231", 1);

    const { data: row, error } = await supabase
      .from("performances")
      .select("*")
      .eq("performance_id", FIXTURE_ID)
      .single();
    expect(error).toBeNull();
    expect(row).not.toBeNull();

    expect(row!.performance_name).toBe("통합 테스트 공연");
    expect(row!.venue_name).toBe("테스트 공연장");
    expect(row!.venue_id).toBe("FC_ITEST_001");
    expect(row!.area).toBe("서울");
    expect(row!.cast).toBe("홍길동");
    expect(row!.runtime).toBe("120분");
    expect(row!.age).toBe("8세 이상");
    expect(row!.period_from).toBe("2026.09.01");
    expect(row!.period_to).toBe("2026.09.30");
    expect(row!.state).toBe("공연예정");
    expect(row!.time).toBe("화~일 19:30");
    expect(row!.price).toEqual([{ seatType: "R석", price: 12000 }]);
    expect(row!.min_price).toBe(12000);
    expect(row!.max_price).toBe(12000);
    expect(row!.booking_links).toEqual([
      { name: "인터파크", url: "https://ticket.fixture.local" },
    ]);
    expect(row!.detail_image).toEqual([FIXTURE_DETAIL_URL]);
    expect(row!.poster).toContain(
      `/storage/v1/object/public/performances/${FIXTURE_ID}/poster.webp`,
    );

    const storageResponse = await fetch(row!.poster);
    expect(storageResponse.ok).toBe(true);
    const posterBytes = Buffer.from(await storageResponse.arrayBuffer());
    expect(posterBytes.length).toBeGreaterThan(0);

    expect(row!.raw_data).toMatchObject({ genrenm: "클래식" });

    // program 키는 performances 컬럼이 아니라 RPC가 payload에서 찢어 적재하는
    // programs 테이블의 원천이다. 이 키를 제거하면 파이프라인은 성공처럼 보이지만
    // 프로그램 데이터가 조용히 유실되므로, programs 테이블까지 반드시 단언한다.
    const { data: programs, error: programsError } = await supabase
      .from("programs")
      .select("composer_ko, composer_en, title_ko, title_en")
      .eq("performance_id", FIXTURE_ID);
    expect(programsError).toBeNull();
    expect(programs).toEqual([
      {
        composer_ko: "루트비히 판 베토벤",
        composer_en: "Ludwig van Beethoven",
        title_ko: "교향곡 제5번",
        title_en: "Symphony No. 5",
      },
    ]);
  }, 30000);
});
