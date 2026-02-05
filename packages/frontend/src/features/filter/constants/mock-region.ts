import type { Region, SortType } from "../types";

export const SORT_MAP: Record<SortType, string> = {
  imminent: "공연임박순",
  "price-low": "낮은가격순",
  "price-high": "높은가격순",
  alphabetical: "가나다순",
};

export const MOCK_REGIONS: Region[] = [
  {
    id: "seoul",
    name: "서울",
    totalCount: 120,
    venues: [
      { id: "sac", name: "예술의전당", count: 45 },
      { id: "lotte", name: "롯데콘서트홀", count: 30 },
      { id: "sejong", name: "세종문화회관", count: 25 },
      { id: "kumho", name: "금호아트홀", count: 20 },
    ],
  },
  {
    id: "gyeonggi",
    name: "경기/인천",
    totalCount: 45,
    venues: [
      { id: "seongnam", name: "성남아트센터", count: 15 },
      { id: "artgy", name: "경기아트센터", count: 30 },
    ],
  },
  {
    id: "busan",
    name: "부산",
    totalCount: 12,
    venues: [{ id: "busan_culture", name: "부산문화회관", count: 12 }],
  },
];