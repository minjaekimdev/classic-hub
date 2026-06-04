import { http, HttpResponse } from "msw";
import { mockKopisXmlResponse } from "./kopisFetcher.fixture";

// KOPIS API의 베이스 URL (쿼리 스트링을 제외한 메인 주소)
const KOPIS_BASE_URL = "https://www.kopis.or.kr/openApi/restful/pblprfr";

export const handlers = [
  /**
   * KOPIS 공연 목록 조회 API 모킹
   */
  http.get(KOPIS_BASE_URL, ({ request }) => {
    const url = new URL(request.url);

    // 💡 팁: 테스트 코드에서 주소 뒤에 ?error=true 처럼 쿼리를 붙여서
    // 의도적으로 에러를 발생시키는 가짜 설정을 만들면 매우 편리합니다.
    const shouldFail = url.searchParams.get("error") === "true";

    if (shouldFail) {
      // 1. 에러 발생 케이스: 500 Internal Server Error 뱉기
      return new HttpResponse(null, {
        status: 500,
        statusText: "Internal Server Error",
      });
    }

    // 2. 정상 케이스: 200 OK와 함께 fixture에 둔 XML 데이터 돌려주기
    return new HttpResponse(mockKopisXmlResponse, {
      status: 200,
      headers: {
        // ⭐️ 중요: XML 파싱을 테스트해야 하므로 Content-Type을 반드시 명시합니다.
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  }),
];
