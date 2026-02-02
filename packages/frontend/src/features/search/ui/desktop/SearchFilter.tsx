import { useCallback, useState, type ReactNode } from "react";

import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

export type FieldType = "검색어" | "지역" | "가격" | "날짜";
export type FilterValue = Record<FieldType, string>;
const INITIAL_FILTER_VALUE: FilterValue = {
  검색어: "",
  지역: "",
  가격: "",
  날짜: "",
};

export interface FilterContextType {
  filterValue: FilterValue;
  activeField: FieldType | null;
  changeValue: (value: Partial<FilterValue>) => void;
  reset: () => void;
  search: () => void;
  openField: (field: FieldType) => void;
  closeField: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const FilterContext = createContext<FilterContextType | null>(null);

interface FilterProviderProps {
  children: ReactNode;
}

const FilterProvider = ({ children }: FilterProviderProps) => {
  const [filterValue, setFilterValue] =
    useState<FilterValue>(INITIAL_FILTER_VALUE);
  const [activeField, setActiveField] = useState<FieldType | null>(null);
  const navigate = useNavigate();

  const changeValue = useCallback((value: Partial<FilterValue>) => {
    setFilterValue((prev) => ({ ...prev, ...value }));
    // value의 프로퍼티 키가 검색어라면, setActiveField(지역) ...
  }, []);

  const reset = () => {
    setFilterValue(INITIAL_FILTER_VALUE);
  };

  const search = () => {
    const getUrlDate = (raw: string) => {
      return raw.replaceAll("/", "-");
    };
    const getUrlPrice = (raw: string) => {
      return String(parseFloat(raw.replace("만", "")) * 10000);
    };
    const params = new URLSearchParams();

    if (filterValue.검색어) {
      params.append("keyword", filterValue.검색어);
    }
    if (filterValue.지역) {
      params.append("location", filterValue.지역);
    }
    if (filterValue.가격) {
      const [minPrice, maxPrice] = filterValue.가격.split(" - ");

      params.append("min_price", getUrlPrice(minPrice));
      
      // 가격 상한을 선택하지 않아 maxPrice가 "50만+"인 경우
      if (!maxPrice.includes("+")) {
        params.append("max_price", maxPrice);
      }
    }
    if (filterValue.날짜) {
      const [startDate, endDate] = filterValue.날짜
        .split(" - ")
        .map(getUrlDate);
      params.append("start_date", startDate);
      params.append("end_date", endDate);
    }

    const queryString = params.toString();
    navigate(queryString ? `/results?${queryString}` : "/results");
  };

  const openField = (field: FieldType) => {
    setActiveField(field);
  };

  const closeField = () => {
    setActiveField(null);
  };

  // activeField가 null이 아니면 특정 field가 클릭(활성화)되었다는 의미
  return (
    <FilterContext
      value={{
        filterValue,
        activeField,
        changeValue,
        reset,
        search,
        openField,
        closeField,
      }}
    >
      {children}
    </FilterContext>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within FilterProvider");
  }
  return context;
};

const FilterReset = ({ children }: { children: ReactNode }) => {
  const { reset } = useFilter();
  return <button onClick={reset}>{children}</button>;
};

const FilterSearch = ({ children }: { children: ReactNode }) => {
  const { search } = useFilter();
  return <button onClick={search}>{children}</button>;
};

interface FilterRootProps {
  children: ReactNode;
}
const FilterRoot = ({ children }: FilterRootProps) => {
  return <FilterProvider>{children}</FilterProvider>;
};

export const SearchFilter = Object.assign(FilterRoot, {
  Reset: FilterReset,
  Search: FilterSearch,
});
