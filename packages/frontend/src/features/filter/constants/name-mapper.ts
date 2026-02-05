import type { SortType } from "../types/filter";

export const SORT_MAP: Record<SortType, string> = {
  imminent: "공연임박순",
  "price-low": "낮은가격순",
  "price-high": "높은가격순",
  alphabetical: "가나다순",
};