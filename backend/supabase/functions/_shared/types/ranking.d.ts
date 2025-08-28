import type { TextNode, TicketLink} from "./common.d.ts";

export interface RankingItem {
  rnum: TextNode;
  prfnm: TextNode;
  prfpd: TextNode;
  prfplcnm: TextNode;
  poster: TextNode;
  mt20id: TextNode;
  relates: {
    relate: TicketLink | TicketLink[];
  }
}

export type RankingPeriod = "daily" | "weekly" | "monthly";

export type pfIdObject = { mt20id: TextNode };
