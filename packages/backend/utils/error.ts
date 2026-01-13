import logger from "./logger";

// 1. Custom Error 클래스 생성
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    // API 응답 원본이나 다른 하위 에러를 통째로 보관
    public originalError?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

// 2. 중앙화된 에러 핸들러
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  fallback?: T,
  service: string = "default",
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    logger.error("Operation failed", { error, stack: error.stack, service });

    if (fallback !== undefined) {
      return typeof fallback === "function" ? fallback() : fallback;
    }
    throw error;
  }
}
