import useResultPerformance from "@/features/performance/api/hooks/useResultPerformance";
import useQueryParams from "@/shared/hooks/useParams";
import useFilteredPerformances from "./useFilteredPerformances";
import useSortedPerformances from "./useSortedPerformances";

const useResultPerformances = () => {
  const { filters } = useQueryParams();
  const {
    keyword,
    location,
    minPrice,
    maxPrice,
    startDate,
    endDate,
    sortBy,
    selectedVenues,
  } = filters;

  // 1차 필터에 필요한 정보, 2차 필터에 필요한 정보를 따로 나누어 가져온다는 정보만 남기고 추상화하기
  const allPerformances = useResultPerformance({
    keyword,
    location,
    minPrice,
    maxPrice,
    startDate,
    endDate,
  });

  // 선택된 공연장들에 해당하는 공연 데이터 필터링하기
  const firstFiltered = useFilteredPerformances(
    allPerformances,
    selectedVenues,
  );

  // 선택된 정렬 방식에 따라 정렬하기
  const filteredPerformances = useSortedPerformances(firstFiltered, sortBy);

  return { allPerformances, filteredPerformances };
};

export default useResultPerformances;
