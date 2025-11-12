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

export type PerformanceDetailType = {
  styurls?: {
    styurl: string;
  };
  program?: object;
} | null;
