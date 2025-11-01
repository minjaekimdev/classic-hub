export type TextNode = { _text: string };

export type RankingPeriod = "daily" | "weekly" | "monthly";

// 기간별 공연 데이터, 특정 날짜 이후 등록 및 수정된 공연 데이터 객체의 구조
export interface PerformanceItemType {
  mt20id: TextNode; // 공연 id
  prfnm: TextNode; // 공연명
  prfpdfrom: TextNode; // 공연시작일
  prfpdto: TextNode; // 공연종료일
  fcltynm: TextNode; // 공연장명
  poster: TextNode; // 포스터 URL
  area: TextNode; // 지역
  genrenm: TextNode; // 장르
  openrun: TextNode; // 오픈런여부
  prfstate: TextNode; // 공연상태
}

// 공연 상세 데이터 객체의 구조
// 상세 데이터의 프로퍼티가 많으므로 모두 명시하지는 x
// all-performance.ts > getPerformanceDetail 함수에서 상세 데이터의 sty, styurls 프로퍼티 참조를 위해 타입을 지정
export type PerformanceDetailType = {
  sty?: string;
  styurls?: {
    styurl: string;
  };
  program?: object;
} | null;
