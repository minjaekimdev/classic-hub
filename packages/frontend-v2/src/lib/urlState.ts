/**
 * specs/home.md 구현 정책
 * - exception-02: URL이 SSOT — 유효하지 않은 기간/페이지/상태/정렬 파라미터를 기본값으로 정규화
 */
import { createParser, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";
import type { SortBy, StatusFilter } from "@/types/concert";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** YYYY-MM-DD 형식만 통과시키는 파서 (나머지는 기본값으로 정규화) */
const parseAsDateOnly = createParser<string>({
  parse: (value) => (ISO_DATE_PATTERN.test(value) ? value : null),
  serialize: (value) => value,
});

/** URL이 SSOT — 모든 파서가 유효하지 않은 입력을 기본값으로 정규화한다 */
export const homePageUrlParsers = {
  q: parseAsString.withDefault(""),
  status: parseAsStringEnum<StatusFilter>(["all", "ongoing", "upcoming"]).withDefault("all"),
  from: parseAsDateOnly.withDefault(""),
  to: parseAsDateOnly.withDefault(""),
  sort: parseAsStringEnum<SortBy>(["imminent", "price_asc", "price_desc"]).withDefault("imminent"),
  page: parseAsInteger.withDefault(1),
};
