import { useMemo } from "react";
import type { Filter, SortType } from "../types/filter";
import type { DetailPerformance } from "@classic-hub/shared/types/client";

// a와 b에 대한 null 체크를 한 뒤 비교함수의 리턴값을 반환하는 로직을 추상화
const getSortReturn = <T>(
  a: T | null,
  b: T | null,
  compareFn: (nonNullA: T, nonNullB: T) => number,
) => {
  // null인 경우를 뒤로 보낸다.
  if (!a && b) return 1;
  if (a && !b) return -1;
  if (!a && !b) return 0;

  return compareFn(a!, b!);
};

const useSortedPerformances = (
  performances: DetailPerformance[],
  sortBy: SortType | null,
) => {
  const sortedPerformances = useMemo(() => {
    const list = [...performances];

    return list.sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return getSortReturn(a.title, b.title, (ta, tb) =>
            ta.localeCompare(tb),
          );
        case "price-high":
          return getSortReturn(a.maxPrice, b.maxPrice, (ta, tb) => tb - ta);
        case "price-low":
          return getSortReturn(a.minPrice, b.minPrice, (ta, tb) => ta - tb);
        default:
          return getSortReturn(
            a.endDate,
            b.endDate,
            (ta, tb) =>
              Number(ta.replaceAll(".", "")) - Number(tb.replaceAll(".", "")),
          );
      }
    });
  }, [sortBy, performances]);

  return sortedPerformances;
};

const useVenuedPerformances = (
  performances: DetailPerformance[],
  selectedVenues: string[],
) => {
  const result = useMemo(() => {
    const selectedVenueIdSet = new Set(selectedVenues);
    if (selectedVenueIdSet.size === 0) {
      return performances;
    }

    return performances.filter((perf) => selectedVenueIdSet.has(perf.venueId!));
  }, [performances, selectedVenues]);

  return result;
};

const useFilteredPerformances = (allPerformances: DetailPerformance[], filters: Filter) => {
  // 선택된 공연장들에 해당하는 공연 데이터 필터링하기
  const venuedPerformances = useVenuedPerformances(
    allPerformances,
    filters.selectedVenues,
  );

  // 선택된 정렬 방식에 따라 정렬하기
  const filteredPerformances = useSortedPerformances(venuedPerformances, filters.sortBy);

  return filteredPerformances;
};

export default useFilteredPerformances;
