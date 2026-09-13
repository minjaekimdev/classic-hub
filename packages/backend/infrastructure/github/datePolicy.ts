// updatePerformances 크론의 날짜 값. 모든 숫자는 이 파일에서만 관리한다.

// 정책값. 비즈니스 판단에 따라 자유롭게 바꿀 수 있으며, 테스트는 이 값을 참조해 검증하므로
// 정책 변경 시 테스트 수정이 필요 없다.
export interface DatePolicy {
  rankingWindowDays: number; // 월간 랭킹 집계 윈도
  futureWindowDays: number; // 향후 예매 일정 윈도
}

export const DATE_POLICY: DatePolicy = {
  rankingWindowDays: 31,
  futureWindowDays: 90,
};

// KOPIS 수정분 조회 범위(일). 크론이 매일 도는 전제에서 어제로 고정되는 계약값이므로
// 정책 객체(DATE_POLICY)에 두지 않는다.
// 과거 이 값이 32일이 되어 하루 ~1,000건의 유료 API 과금 사고가 발생한 이력이 있으며,
// 변경은 정책 변경이 아니라 계약 변경이므로 syncDateRange.test.ts의 리터럴 테스트가 감시한다.
export const UPDATE_LOOKBACK_DAYS = 1;
