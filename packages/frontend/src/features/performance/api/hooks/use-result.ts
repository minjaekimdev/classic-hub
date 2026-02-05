import useQueryParams from "@/shared/hooks/useParams";

const useResult = () => {
  // URL 파라미터로부터 조건 추출하기
  const {filters} = useQueryParams();

  // 추출된 조건을 바탕으로 DB에 데이터 요청하기
  

  // 반환하기
}

export default useResult;