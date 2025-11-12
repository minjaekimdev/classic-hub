import 'jsr:@std/dotenv/load'

const API_URL = "http://www.kopis.or.kr/openApi/restful";
const CLASSIC = "CCCA";

const SERVICE_KEY = Deno.env.get("KOPIS_SERVICE_KEY");
if (!SERVICE_KEY) {
  throw new Error("환경변수 KOPIS_SERVICE_KEY가 설정되어 있지 않습니다!");
}

export { API_URL, CLASSIC, SERVICE_KEY };
