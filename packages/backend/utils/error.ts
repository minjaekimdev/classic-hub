import logger from "./logger";

// 1. Custom Error 클래스 생성
class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    // API 응답 원본이나 다른 하위 에러를 통째로 보관
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

const apiError = new APIError('API call failed');
console.log(apiError);

// 2. 중앙화된 에러 핸들러
async function withErrorHandling<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    logger.error('Operation failed', { error, stack: error.stack });

    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
}

export default withErrorHandling;
