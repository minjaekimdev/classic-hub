import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { createGetRanking } from "./getRanking";
import { kopisService } from "@/infrastructure/kopis/service";

const BOXOFFICE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<boxofs>
  <boxof>
    <rnum>1</rnum>
    <prfnm>베토벤과 슈베르트</prfnm>
    <prfpd>2026.09.01~2026.09.30</prfpd>
    <prfplcnm>예술의전당</prfplcnm>
    <seatcnt>5000</seatcnt>
    <prfdtcnt>10</prfdtcnt>
    <area>서울</area>
    <poster>/upload/pfmPoster/PF286762.jpg</poster>
    <mt20id>PF286762</mt20id>
  </boxof>
  <boxof>
    <rnum>2</rnum>
    <prfnm>바로크의 밤</prfnm>
    <prfpd>2026.09.10~2026.09.11</prfpd>
    <prfplcnm>아트센터 인천</prfplcnm>
    <seatcnt>800</seatcnt>
    <prfdtcnt>2</prfdtcnt>
    <area>인천</area>
    <poster>/upload/pfmPoster/PF299795.jpg</poster>
    <mt20id>PF299795</mt20id>
  </boxof>
</boxofs>`;

const EMPTY_XML = `<?xml version="1.0" encoding="UTF-8"?>
<boxofs></boxofs>`;

const server = setupServer(
  http.get(/kopis\.or\.kr\/openApi\/restful\/boxoffice/, ({ request }) => {
    const stdate = new URL(request.url).searchParams.get("stdate");
    // stdate가 2099로 시작하면 빈 응답을 내려준다 (데이터 없음 시나리오).
    return HttpResponse.xml(stdate?.startsWith("2099") ? EMPTY_XML : BOXOFFICE_XML);
  }),
);

describe("getRanking (KOPIS boxoffice 파싱)", () => {
  beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
  afterAll(() => server.close());

  it("boxoffice XML에서 _text 래퍼를 제거한 Ranking 배열을 반환한다", async () => {
    const getRanking = createGetRanking(kopisService);

    const result = await getRanking("20260901", "20260907");

    expect(result).toHaveLength(2);
    // removeTextProperty가 { _text: "..." }를 언래핑했는지 확인한다.
    expect(result?.[0]).toMatchObject({
      rnum: "1",
      prfnm: "베토벤과 슈베르트",
      mt20id: "PF286762",
    });
    expect(result?.[1].mt20id).toBe("PF299795");
  });

  it("데이터가 없는 응답이면 null로 반환되어 상위의 FETCH_FAIL 정책을 트리거한다", async () => {
    const getRanking = createGetRanking(kopisService);

    const result = await getRanking("20990101", "20990107");

    expect(result ?? null).toBeNull();
  });
});
