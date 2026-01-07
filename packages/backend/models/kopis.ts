// KOPIS에서 받아오는 Original DTO를 정의(전처리 이후)

// 예매처 정보 인터페이스
export interface BookingLink {
  relatenm: string;
  relateurl: string;
}

// 공연목록(기간별) 조회 인터페이스
export interface PerformanceSummary {
  mt20id: string; // 공연 ID (예: PF178134)
  prfnm: string; // 공연명
  genrenm: string; // 공연 장르명
  prfstate: string; // 공연상태 (예: 공연중)
  prfpdfrom: string; // 공연시작일 (예: 2021.08.21)
  prfpdto: string; // 공연종료일 (예: 2024.09.29)
  poster: string; // 공연포스터경로
  fcltynm: string; // 공연시설명(공연장명)
  openrun: "Y" | "N"; // 오픈런 여부
  area: string; // 공연지역 (예: 경상남도)
}

// 예매상황판(랭킹) 조회 인터페이스
export interface Ranking {
  rnum: string; // 랭킹
  prfnm: string; // 공연명
  prfpd: string; // 공연기간 (예: 2026.01.13~2026.01.15)
  prfplcnm: string; // 공연장
  seatcnt: string; // 좌석수
  prfdtcnt: string; // 상연횟수
  area: string; // 지역 (예: 울산)
  poster: string; // 포스터 URL
  mt20id: string; // 공연 ID (예: PF178134)
}

// 공연 상세 조회 인터페이스
interface PerformanceDetail {
  mt20id: string; // 공연 ID (예: PF178134)
  mt10id: string; // 공연시설 ID (예: FC001431)
  prfnm: string; // 공연명 (예: 우리연애할까)
  prfpdfrom: string; // 공연시작일 (예: 2016.05.12)
  prfpdto: string; // 공연종료일 (예: 2016.07.31)
  fcltynm: string; // 공연시설명(공연장명)
  prfcast: string; // 공연출연진 (예: 김부연, 임정균 등)
  prfcrew: string; // 공연제작진 (예: 천정민)
  prfruntime: string; // 공연 런타임 (예: 1시간 30분)
  prfage: string; // 공연 관람 연령 (예: 만 12세 이상)
  entrpsnmP: string; // 제작사 (예: 극단 피에로)
  entrpsnmA: string; // 기획사
  entrpsnmH: string; // 주최
  entrpsnmS: string; // 주관
  pcseguidance: string; // 티켓가격 (예: 전석 30,000 원)
  poster: string; // 포스터이미지경로
  sty: string; // 줄거리
  genrenm: string; // 공연장르명 (예: 연극)
  prfstate: string; // 공연상태 (예: 공연중)
  openrun: "Y" | "N"; // 오픈런 여부
  visit: "Y" | "N"; // 내한 여부
  child: "Y" | "N"; // 아동 공연 여부
  daehakro: "Y" | "N"; // 대학로 여부
  festival: "Y" | "N"; // 축제 여부
  musicallicense: "Y" | "N"; // 뮤지컬 라이센스 여부
  musicalcreate: "Y" | "N"; // 뮤지컬 창작 여부
  updatedate: string; // 최종수정일 (예: 2019-07-25 10:03:14)
  styurls: {
    styurl: string | string[]; // 소개이미지 목록 (1~4개)
  };
  dtguidance: string; // 공연시간 (예: 화요일 ~ 금요일(20:00) 등) [cite: 23]
}

// 개별 공연장 인터페이스
export interface Facility {
  prfplcnm: string; // 공연장명 (예: KSPO DOME(체조경기장))
  mt13id: string; // 공연장 고유식별 ID (예: FC-001247-01)
  // ※ 명세상 seatscale이 중복 정의되어 있으며, 여기서는 개별 공연장의 좌석 규모를 의미함
  seatscale: string;
  // 무대 시설 정보
  stageorchat: "Y" | "N"; // 무대시설-오케스트라피트 여부
  stagepracat: "Y" | "N"; // 무대시설-연습실 여부
  stagedresat: "Y" | "N"; // 무대시설-분장실 여부
  stageoutdrat: "Y" | "N"; // 무대시설-야외공연장 여부

  // 장애인 전용 시설 상세
  disabledseatscale: string; // 장애인시설 관객석 수 (예: 20)
  stagearea: string; // 장애인시설 무대 넓이 (예: 15.8X13.3X8.7)
}

// 공연시설 상세 조회 인터페이스
export interface FacilityDetail {
  // 기본 시설 정보
  mt10id: string; // 공연시설 ID (예: FC001247)
  fcltynm: string; // 공연시설명 (예: 올림픽공원)
  opende: string; // 개관연도 (예: 1986)
  fcltychartr: string; // 시설특성 (예: 기타(공공))
  seatscale: string; // 총 객석 수 (예: 32349)
  mt13cnt: string; // 시설 내 공연장 수 (예: 9)
  telno: string; // 전화번호 (예: 02-410-1114)
  relateurl: string; // 홈페이지 (예: http://www.olympicpark.co.kr/)
  adres: string; // 주소
  la: string; // 위도 (예: 37.52112)
  lo: string; // 경도 (예: 127.12836360000005)

  // 서비스 및 편의 시설 여부 ('Y' 또는 'N')
  restaurant: "Y" | "N"; // 레스토랑
  cafe: "Y" | "N"; // 카페
  store: "Y" | "N"; // 편의점
  nolibang: "Y" | "N"; // 놀이방
  suyu: "Y" | "N"; // 수유실
  parkinglot: "Y" | "N"; // 주차시설

  // 장애인 편의 시설 여부 ('Y' 또는 'N')
  parkbarrier: "Y" | "N"; // 장애시설-주차장
  restbarrier: "Y" | "N"; // 장애시설-화장실
  runwbarrier: "Y" | "N"; // 장애시설-경사로
  elevbarrier: "Y" | "N"; // 장애시설-엘리베이터

  mt13s: Facility[];
}
