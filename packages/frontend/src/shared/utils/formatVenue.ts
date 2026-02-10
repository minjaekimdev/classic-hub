// DB 공연장 데이터 맨 뒤의 괄호 그룹(세부 공연장 내용)을 없애는 함수

const formatVenue = (raw: string) => {
  return raw.replace(/\s*\(([^()]*|\([^()]*\))*\)\s*$/, '');
}

export default formatVenue;