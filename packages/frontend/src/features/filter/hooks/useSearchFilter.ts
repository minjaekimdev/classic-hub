import useQueryParams from "@/shared/hooks/useParams";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { FieldType, SearchValue } from "../types/filter";

const useSearchFilter = ({ onSearch }: { onSearch: () => void }) => {
  // URL 파라미터 가져온 뒤 검색 필터의 초기값으로 사용
  const { filters } = useQueryParams();
  const { keyword, location, minPrice, maxPrice, startDate, endDate } = filters;

  // 확장 필터의 상태를 관리(초기값만 URL 파라미터와 동일)
  const [searchValue, setSearchValue] = useState<SearchValue>({
    keyword: keyword ? keyword : "",
    location: location ? location : "",
    minPrice: minPrice ? minPrice : "",
    maxPrice: maxPrice ? maxPrice : "",
    startDate: startDate ? startDate : "",
    endDate: endDate ? endDate : "",
  });

  const [activeField, setActiveField] = useState<FieldType | null>(null);
  const navigate = useNavigate();

  const changeValue = useCallback((value: SearchValue) => {
    setSearchValue(value);
  }, []);

  const reset = () => {
    setSearchValue({
      keyword: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      startDate: "",
      endDate: "",
    });
  };

  const search = () => {
    const params = new URLSearchParams();

    if (searchValue.keyword) {
      params.append("keyword", searchValue.keyword);
    }
    if (
      searchValue.location &&
      searchValue.location !== "전체"
    ) {
      params.append("location", searchValue.location);
    }
    if (searchValue.minPrice) {
      params.append("minPrice", String(searchValue.minPrice));
    }
    if (searchValue.maxPrice) {
      params.append("maxPrice", String(searchValue.maxPrice));
    }
    if (searchValue.startDate) {
      params.append("startDate", searchValue.startDate);
    }
    if (searchValue.endDate) {
      params.append("endDate", searchValue.endDate);
    }

    const queryString = params.toString();
    console.log(`queryString: ${queryString}`);
    onSearch?.();
    navigate(queryString ? `/result?${queryString}` : "/result");
  };

  const openField = (field: FieldType) => {
    setActiveField(field);
  };

  const closeField = () => {
    setActiveField(null);
  };

  return {
    searchValue,
    activeField,
    changeValue,
    reset,
    search,
    openField,
    closeField,
  };
};

export default useSearchFilter;
