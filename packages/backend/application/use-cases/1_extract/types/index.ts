export interface InternalPerformance {
  performanceId: string; // 공연 ID (mt20id)
  venueId: string; // 공연시설 ID (mt10id)
  title: string; // 공연명 (prfnm)
  startDate: string; // 공연시작일 (prfpdfrom)
  endDate: string; // 공연종료일 (prfpdto)
  venueName: string; // 공연시설명 (fcltynm)
  cast: string; // 출연진 (prfcast)
  crew: string; // 제작진 (prfcrew)
  runtime: string; // 런타임 (prfruntime)
  ageLimit: string; // 관람연령 (prfage)
  productionCompany: string; // 제작사 (entrpsnmP)
  agencyCompany: string; // 기획사 (entrpsnmA)
  hostCompany: string; // 주최 (entrpsnmH)
  organizerCompany: string; // 주관 (entrpsnmS)
  priceInfo: string; // 티켓가격 (pcseguidance)
  posterUrl: string; // 포스터 이미지 경로
  posterImage: Buffer; // 포스터 이미지 데이터 (Buffer)
  description: string; // 줄거리 (sty)
  area: string; // 지역 (area)
  genre: string; // 장르 (genrenm)
  status: string; // 공연상태 (prfstate)

  // 상태값 (Y/N을 boolean으로 변환한다고 가정)
  isOpenRun: string; // 오픈런 여부
  isVisit: string; // 내한 여부
  isChildFriendly: string; // 아동 공연 여부
  isDaehakro: string; // 대학로 여부
  isFestival: string; // 축제 여부
  isMusicalLicense: string; // 뮤지컬 라이선스 여부
  isMusicalCreate: string; // 뮤지컬 창작 여부

  updatedAt: string; // 최종수정일 (updatedate)
  bookingLinks: BookingLink[]; // 예매처 목록 (배열로 정규화)
  detailImages: Buffer[]; // 상세 이미지 데이터 배열
  scheduleInfo: string; // 공연 시간 안내 (dtguidance)
}

// 예매처 정보 타입 (함께 정의 필요)
export interface BookingLink {
  relatenm: string; // 예매처 명칭
  relateurl: string; // 예매처 URL
}
