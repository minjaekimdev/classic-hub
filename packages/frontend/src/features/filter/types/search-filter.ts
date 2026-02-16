export interface SearchCategory {
  keyword: string;
  location: string;
  price: string;
  date: string;
}

export const LABEL_TO_KEY: Record<string, keyof SearchCategory> = {
  검색어: "keyword",
  지역: "location",
  날짜: "date",
  가격대: "price",
};