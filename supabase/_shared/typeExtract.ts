// types/database.helper.ts
import type { Database } from "./types.ts";

type PublicSchema = Database["public"];

// 테이블 추출기
// 조회 전용
export type Tables<T extends keyof PublicSchema["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
// 삽입 전용
// Row로 할 경우 created_at 같은 컬럼을 필요로 하므로 Insert로 지정해줘야 한다.
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type Queue = Tables<"task_queue">;