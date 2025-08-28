import type { TextNode } from "./common.client";
import type { TicketLink } from "./common.client";

export type pfDetail = {
  prfnm: TextNode; // 공연명
  prfpdfrom: TextNode; // 공연시작일
  prfpdto: TextNode; // 공연종료일
  fcltynm: TextNode; // 공연장
  poster: TextNode; // 포스터url
  prfstate: TextNode; // 공연상태(공연중/공연예정/공연완료)
  prfruntime: TextNode; // 러닝타임
  prfage: TextNode; // 나이 등급
  pcseguidance: TextNode; // 좌석 정보
  mt10id: TextNode; // 공연장 id
  dtguidance: TextNode; // 공연 시간 
  styurls: { // 공연 상세 이미지url
    styurl: TextNode | TextNode[];
  }
  relates: { // 예매처 정보
    relate: TicketLink | TicketLink[];
  }
};
