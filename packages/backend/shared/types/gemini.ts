/**
 * 작곡가별로 그룹화된 프로그램 추출 결과 인터페이스
 */
export interface ProgramItem {
  /** 작곡가(또는 편곡자)의 한글 이름 (First Name) */
  firstNameKo: string;
  
  /** 작곡가(또는 편곡자)의 영문 이름 (First Name) */
  firstNameEn: string;
  
  /** 작곡가(또는 편곡자)의 한글 성 (Last Name) */
  lastNameKo: string;
  
  /** 작곡가(또는 편곡자)의 영문 성 (Last Name) */
  lastNameEn: string;
  
  /** 해당 작곡가의 메인 작품명 리스트 (한글, 악장 제외) */
  workTitleKr: string[];
  
  /** 해당 작곡가의 메인 작품명 리스트 (영문, 악장 제외) */
  workTitleEn: string[];
}

/**
 * 최종 응답 형식: 작곡가 객체들의 배열
 */
export type ProgramExtractionResponse = ProgramItem[];