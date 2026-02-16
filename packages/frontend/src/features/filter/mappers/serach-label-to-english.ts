import type { SearchCategory } from "../types/filter";

export const SEARCH_LABEL_TO_KEY: Record<string, keyof SearchCategory> = {
  검색어: "keyword",
  지역: "location",
  날짜: "date",
  가격대: "price",
};