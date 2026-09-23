import { deleteData } from "@/infrastructure/supabase/database";

// deps 패턴 — 실패 시 에러를 상위로 던져 오케스트레이터가 artifact 기록과 요약 알림을 처리한다.
// 참고: performances의 자식 행(programs 등)은 DB FK/CASCADE 정책에 따라 정리된다.
export const deletePerformances = async (ids: string[]) => {
  await deleteData("performances", "performance_id", ids);
};
