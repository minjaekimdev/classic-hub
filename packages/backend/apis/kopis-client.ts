import 'dotenv/config'

const API_URL = "http://www.kopis.or.kr/openApi/restful";
const CLASSIC = "CCCA";

if (!process.env.KOPIS_SERVICE_KEY) {
  throw new Error("환경변수 KOPIS_SERVICE_KEY가 설정되어 있지 않습니다!");
}

const SERVICE_KEY = process.env.KOPIS_SERVICE_KEY;

export { API_URL, CLASSIC, SERVICE_KEY };