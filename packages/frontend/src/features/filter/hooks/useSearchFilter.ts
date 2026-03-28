import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { FieldType, QueryParams } from "../types/filter";

const useSearchFilter = ({ onSearch }: { onSearch: () => void }) => {
  const [searchValue, setSearchValue] = useState<QueryParams>({
    keyword: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    startDate: "",
    endDate: "",
  });

  const [activeField, setActiveField] = useState<FieldType | null>(null);
  const navigate = useNavigate();

  const changeValue = useCallback((value: QueryParams) => {
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
    if (searchValue.location && searchValue.location !== "전체") {
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
