import {
  useCallback,
  useState,
  type ReactNode,
} from "react";

import { createContext, useContext } from "react";

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

  const changeValue = useCallback((value: Partial<FilterValue>) => {
    setFilterValue((prev) => ({ ...prev, ...value }));
    // value의 프로퍼티 키가 검색어라면, setActiveField(지역) ...
  }, []);
  const reset = () => {
    setFilterValue(INITIAL_FILTER_VALUE);
  };
  const search = () => {
    // 추후 내용 추가하기(실제 검색 로직)
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
