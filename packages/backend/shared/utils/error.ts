// Custom Error 클래스
// API 응답 원본이나 다른 하위 에러를 통째로 보관할 수 있다.
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "APIError";
  }
}
