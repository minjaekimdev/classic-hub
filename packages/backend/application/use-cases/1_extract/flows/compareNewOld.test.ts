import { describe, it, expect } from "vitest";
import { compareNewOld } from "./compareNewOld";

describe("compareNewOld 비즈니스 로직 테스트", () => {
  // 시나리오 1: 정상 흐름 - 교집합/차집합 분리
  it("DB에만 있는 id는 idsToDelete, 새 데이터에만 있는 id는 idsToInsert로 분류해야 한다", () => {
    const newIds = ["ID_1", "ID_2", "ID_3"];
    const dbIds = ["ID_2", "ID_3", "ID_4"];

    const { idsToDelete, idsToInsert } = compareNewOld(newIds, dbIds);

    expect(idsToDelete).toEqual(["ID_4"]); // DB에만 존재
    expect(idsToInsert).toEqual(["ID_1"]); // 새 데이터에만 존재
  });

  // 시나리오 2: 완전히 새로운 데이터 (DB 비어있음)
  it("DB가 비어있으면 모든 새 id가 idsToInsert, idsToDelete는 빈 배열이어야 한다", () => {
    const { idsToDelete, idsToInsert } = compareNewOld(["ID_1", "ID_2"], []);

    expect(idsToDelete).toEqual([]);
    expect(idsToInsert).toEqual(["ID_1", "ID_2"]);
  });

  // 시나리오 3: DB에만 존재 (새 데이터 비어있음)
  it("새 데이터가 비어있으면 모든 DB id가 idsToDelete, idsToInsert는 빈 배열이어야 한다", () => {
    const { idsToDelete, idsToInsert } = compareNewOld([], ["ID_1", "ID_2"]);

    expect(idsToDelete).toEqual(["ID_1", "ID_2"]);
    expect(idsToInsert).toEqual([]);
  });

  // 시나리오 4: 양쪽 모두 비어있음
  it("양쪽 모두 빈 배열이면 idsToDelete/idsToInsert 모두 빈 배열이어야 한다", () => {
    const { idsToDelete, idsToInsert } = compareNewOld([], []);

    expect(idsToDelete).toEqual([]);
    expect(idsToInsert).toEqual([]);
  });

  // 시나리오 5: 완전히 동일
  it("두 배열이 완전히 동일하면 삭제/삽입 대상 모두 없어야 한다", () => {
    const { idsToDelete, idsToInsert } = compareNewOld(
      ["ID_1", "ID_2"],
      ["ID_1", "ID_2"],
    );

    expect(idsToDelete).toEqual([]);
    expect(idsToInsert).toEqual([]);
  });

  // 시나리오 6: 새 데이터 내 중복 id
  it("새 데이터에 중복 id가 있어도 idsToInsert에는 중복해서 들어갈 수 있다", () => {
    const { idsToInsert } = compareNewOld(["ID_1", "ID_1"], ["ID_2"]);

    // filter 기반이므로 중복이 그대로 유지된다
    expect(idsToInsert).toEqual(["ID_1", "ID_1"]);
  });
});
