import 'dotenv/config'

const apiURL = "http://www.kopis.or.kr/openApi/restful";
const classic = "CCCA";

if (!process.env.KOPIS_SERVICE_KEY) {
  throw new Error("환경변수 KOPIS_SERVICE_KEY가 설정되어 있지 않습니다!");
}

const serviceKey = process.env.KOPIS_SERVICE_KEY;

export { apiURL, classic, serviceKey };