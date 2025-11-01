export type TextNode = { _text: string };

export interface RankingItem {
  rnum: TextNode;
  prfnm: TextNode;
  prfpd: TextNode;
  prfplcnm: TextNode;
  poster: TextNode;
  mt20id: TextNode;
}
export type RankingPeriod = "daily" | "weekly" | "monthly";
export type pfIdObject = { mt20id: TextNode };

// sty, styurls 프로퍼티 참조를 위해 타입을 지정
export type PerformanceDetailType = {
  sty?: string;
  styurls?: {
    styurl: string;
  };
  program?: object;
} | null;
