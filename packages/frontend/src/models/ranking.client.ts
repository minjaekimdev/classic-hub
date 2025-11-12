import type { TextNode, TicketLink } from "./common.client";

export type RankingPeriod = "daily" | "weekly" | "monthly";

export interface RankingItem {
  rnum: TextNode; // 랭킹
  prfnm: TextNode; // 공연명
  prfpd: TextNode; // 공연기간
  prfplcnm: TextNode; // 공연장
  poster: TextNode; // 포스터url
  mt20id: TextNode; // 공연id
  relates: {
    relate: TicketLink | TicketLink[];
  } // 예매처 정보
}
