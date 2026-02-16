import { useLayoutDesktop } from "@/layout/desktop/LayoutDesktop";
import { useCallback, useState, type ReactNode } from "react";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useQueryParams from "@/shared/hooks/useParams";

export type FieldType =
  | "keyword"
  | "location"
  | "price"
  | "period";

interface SearchValue {
  keyword: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  startDate: string;
  endDate: string;
}

export interface SearchFilterDesktopContextType {
  searchValue: SearchValue;
  activeField: FieldType | null; // 현재 활성화된 카테고리 드롭다운 상태 저장
  changeValue: (value: SearchValue) => void;
  reset: () => void;
  search: () => void;
  openField: (field: FieldType) => void;
  closeField: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const SearchFilterDesktopContext =
  createContext<SearchFilterDesktopContextType | null>(null);

interface SearchFilterDesktopProviderProps {
  children: ReactNode;
}

const SearchFilterDesktopProvider = ({
  children,
}: SearchFilterDesktopProviderProps) => {
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
  const { shrink } = useLayoutDesktop();
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
    if (searchValue.location) {
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
    shrink();
    navigate(queryString ? `/result?${queryString}` : "/result");
  };

  const openField = (field: FieldType) => {
    setActiveField(field);
  };

  const closeField = () => {
    setActiveField(null);
  };

  // activeField가 null이 아니면 특정 field가 클릭(활성화)되었다는 의미
  return (
    <SearchFilterDesktopContext
      value={{
        searchValue,
        activeField,
        changeValue,
        reset,
        search,
        openField,
        closeField,
      }}
    >
      {children}
    </SearchFilterDesktopContext>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSearchFilterDesktop = () => {
  const context = useContext(SearchFilterDesktopContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
};

const SearchFilterReset = ({ children }: { children: ReactNode }) => {
  const { reset } = useSearchFilterDesktop();
  return <button onClick={reset}>{children}</button>;
};

const SearchFilterApply = ({ children }: { children: ReactNode }) => {
  const { search } = useSearchFilterDesktop();
  return <button onClick={search}>{children}</button>;
};

interface SearchFilterRootProps {
  children: ReactNode;
}
const SearchRoot = ({ children }: SearchFilterRootProps) => {
  return <SearchFilterDesktopProvider>{children}</SearchFilterDesktopProvider>;
};

const SearchDesktop = Object.assign(SearchRoot, {
  Reset: SearchFilterReset,
  Apply: SearchFilterApply,
});

export default SearchDesktop;
