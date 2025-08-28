import type { TextNode } from "./common-server";
import type { TicketLink } from "./common-server";

export type pfDetail = {
  mt20id: TextNode; // 공연 id
  prfnm: TextNode; // 공연명
  prfpdfrom: TextNode; // 공연시작일
  prfpdto: TextNode; // 공연종료일
  fcltynm: TextNode; // 공연장
  poster: TextNode; // 포스터url
  prfstate: TextNode; // 공연상태(공연중/공연예정/공연완료)
  prfcast: {} | TextNode; // 공연출연진
  prfruntime: TextNode; // 러닝타임
  prfage: TextNode; // 나이 등급
  entrpsnm: {} | TextNode;
  pcseguidance: TextNode; // 좌석 정보
  mt10id: TextNode;
  dtguidance: TextNode; // 공연시간 정보
  styurls: { // 공연 상세 이미지 url
    styurl: TextNode | TextNode[]; 
  }
  relates: { // 예매처 링크 
    relate: TicketLink | TicketLink[];
  }
};
