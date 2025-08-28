import 'jsr:@std/dotenv/load'

const apiURL = "http://www.kopis.or.kr/openApi/restful";
const classic = "CCCA";

const serviceKey = Deno.env.get("KOPIS_SERVICE_KEY");
if (!serviceKey) {
  throw new Error("환경변수 KOPIS_SERVICE_KEY가 설정되어 있지 않습니다!");
}

export { apiURL, classic, serviceKey };
