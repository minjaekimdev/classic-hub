// types/database.helper.ts
import type { Database } from "./supabase";

type PublicSchema = Database["public"];

// 테이블 추출기
// 조회 전용
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
// 삽입 전용
// Row로 할 경우 created_at 같은 컬럼을 필요로 하므로 Insert로 지정해줘야 한다.
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type View<T extends keyof PublicSchema["Views"]> =
  PublicSchema["Views"][T]["Row"];

// 공연 데이터
export type DBPerformanceRead = Tables<"performances">;
export type DBPerformanceWrite = InsertTables<"performances">;

// performances 테이블과 JOIN된 랭킹 데이터
export type DBRanking = View<"daily_ranking_with_details">;

// 공연장 데이터
export type DBFacilityRead = Tables<"facilities">;
export type DBFaciltyWrite = InsertTables<"facilities">;

// 세부 공연장 데이터
export type DBHallRead = Tables<"halls">;
export type DBHallWrite = Tables<"halls">;
