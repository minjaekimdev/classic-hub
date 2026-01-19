import winston from "winston";

// 1. 서비스별 색상 정의 (ANSI Escape Codes)
const colors: Record<string, string> = {
  reset: "\x1b[0m",
  gemini: "\x1b[36m", // Cyan (AI 느낌)
  supabase: "\x1b[32m", // Green (성공/DB 느낌)
  kopis: "\x1b[35m", // Magenta (예술/공연 느낌)
  default: "\x1b[33m", // Yellow (기본값)
};

// 2. 서비스별로 색상을 입혀주는 포맷 함수
const colorizedServiceFormat = winston.format.printf((info) => {
  const { level, message, timestamp, service, ...meta } = info;

  // service가 문자열인지 확인 (TypeScript 타입 가드)
  const isStringService = typeof service === "string";

  // 1. 색상 선택을 위한 키값 (소문자 처리)
  const colorKey = isStringService ? service.toLowerCase() : "default";
  const serviceColor = colors[colorKey] || colors.default;

  // 2. 태그 생성 (문자열일 때만 toUpperCase 호출)
  const serviceTag = isStringService
    ? `[${service.toUpperCase()}]`
    : "[GENERAL]";

  // 3. 나머지 메타데이터 처리
  const metaString = Object.keys(meta).length
    ? `\n${JSON.stringify(meta, null, 2)}`
    : "";

  return `${timestamp} ${serviceColor}${serviceTag}${colors.reset} ${level}: ${message}${metaString}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  // 파일 저장용 포맷 (색상 코드 없이 깔끔한 JSON)
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      // 콘솔 출력용 포맷 (색상 적용)
      format: winston.format.combine(
        winston.format.colorize(), // level(error, info)에 색상 입히기
        colorizedServiceFormat, // 서비스별 색상 입히기
      ),
    }),
  ],
});

export default logger;
