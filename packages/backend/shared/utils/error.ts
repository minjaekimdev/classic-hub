import logger from "./logger";

// 1. Custom Error 클래스 생성
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    // API 응답 원본이나 다른 하위 에러를 통째로 보관
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "APIError";
  }
}

// unknown 타입의 에러에서 메시지를 안전하게 추출
const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

// 2. 중앙화된 에러 핸들러 (경계 계층 전용)
// 순수 로직 함수 내부에서 쓰지 않고, 스크립트/오케스트레이터 등
// "에러 정책"을 담당하는 경계에서만 사용한다.
// - fallback이 있으면: 복구되는 상황이므로 warn 레벨 기록 후 fallback 반환
// - fallback이 없으면: error 레벨 기록 후 에러를 그대로 재던지기 (상위 경계에서 최종 처리)
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  fallback?: any,
  service: string = "default",
): Promise<T> {
  try {
    return await operation();
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    const stack = error instanceof Error ? error.stack : undefined;

    if (fallback !== undefined) {
      logger.warn(`Operation failed (fallback으로 복구): ${message}`, {
        service,
        stack,
      });
      return typeof fallback === "function" ? await fallback() : fallback;
    }

    logger.error(`Operation failed: ${message}`, { service, stack });
    throw error;
  }
}
