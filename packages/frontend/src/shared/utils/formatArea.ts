import { REGION_LIST } from "@classic-hub/shared/constants/region-list";

// REGION_LIST로부터 Union 타입 추출 (이전 답변 참고)
export type Region = typeof REGION_LIST[number];

const AREA_MAP: Record<string, Region> = {
  "서울특별시": "서울",
  "경기도": "경기",
  "인천광역시": "인천",
  "부산광역시": "부산",
  "대구광역시": "대구",
  "광주광역시": "광주",
  "대전광역시": "대전",
  "울산광역시": "울산",
  "세종특별자치시": "세종",
  "강원특별자치도": "강원",
  "충청북도": "충북",
  "충청남도": "충남",
  "전라북도": "전북",
  "전북특별자치도": "전북",
  "전라남도": "전남",
  "경상북도": "경북",
  "경상남도": "경남",
  "제주특별자치도": "제주",
};

const formatArea = (raw: string): Region | null => {
  return AREA_MAP[raw] || null;
};

export default formatArea;