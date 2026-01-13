/**
 * 작곡가 정보
 */
interface Composer {
  firstName: string | null;
  lastName: string | null;
}

/**
 * 개별 작품 정보
 */
interface Work {
  title: string | null;
  catalogNumber: string | null;
}

/**
 * 작곡가별 프로그램 그룹화 단위
 * (동일 작곡가의 연속된 작품들을 포함)
 */
interface ProgramGroup {
  composer: Composer;
  works: Work[];
}

/**
 * 특정 공연일의 데이터 구조
 */
interface PerformanceDay {
  date: string | null; // 공연 회차 또는 일자 (예: "1", "2")
  programs: ProgramGroup[];
}

/**
 * Gemini API 최상위 응답 구조
 */
export interface ProgramExtractionResponse {
  en: PerformanceDay[];
  kr: PerformanceDay[];
}