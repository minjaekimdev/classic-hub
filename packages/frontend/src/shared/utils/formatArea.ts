// ex) "전북특별자치도" -> "전북"의 형태로 가공

const formatArea = (raw: string) => {
  if (raw === "서울특별시") {
    return "서울";
  }
  if (raw === "경기도") {
    return "경기";
  }
  if (raw === "인천광역시") {
    return "인천";
  }
  if (raw === "부산광역시") {
    return "부산";
  }
  if (raw == "대구광역시") {
    return "대구";
  }
  if (raw === "광주광역시") {
    return "광주";
  }
  if (raw === "대전광역시") {
    return "대전";
  }
  if (raw === "울산광역시") {
    return "울산";
  }
  if (raw === "세종특별자치시") {
    return "세종";
  }
  if (raw === "강원특별자치도") {
    return "강원";
  }
  if (raw === "충청북도") {
    return "충북";
  }
  if (raw === "충청남도") {
    return "충남";
  }
  if (raw === "전라북도" || raw === "전북특별자치도") {
    return "전북";
  }
  if (raw === "전라남도") {
    return "전남";
  }
  if (raw === "경상북도") {
    return "경북";
  }
  if (raw === "경상남도") {
    return "경남";
  }
  if (raw === "제주특별자치도") {
    return "제주";
  }
  return raw;
};

export default formatArea;
