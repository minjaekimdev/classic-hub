interface TicketLink {
  relatenm: string; // 예매처명
  relateurl: string; // 예매처url
}

// 공연 상세 타입
export interface PerformacneDetailType {
  mt20id: string; // 공연id
  prfnm: string; // 공연명
  prfpdfrom: string; // 공연시작일
  prfpdto: string; // 공연종료일
  fcltynm: string; // 공연장
  poster: string; // 포스터url
  prfstate: string; // 공연상태(공연중/공연예정/공연완료)
  prfcast: {} | string; // 공연출연진
  prfruntime: string; // 러닝타임
  prfage: string; // 나이 등급
  entrpsnm: {} | string;
  pcseguidance: string; // 좌석 정보
  mt10id: string; // 공연장id
  dtguidance: string; // 공연시간 정보
  styurls: {
    // 공연 상세 이미지 url
    styurl: string | string[];
  };
  relates: {
    relate: TicketLink | TicketLink[];
  };
}

// 공연 랭킹 타입
export interface PerformanceRankingType {
  rnum: string; // 순위
  prfnm: string; // 공연명
  prfpd: string; // 공연기간
  prfplcnm: string; // 공연장
  poster: string; // 포스터이미지 url
  mt20id: string; // 공연id
}