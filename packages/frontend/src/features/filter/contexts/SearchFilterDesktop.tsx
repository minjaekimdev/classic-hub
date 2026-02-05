import { useCallback, useState, type ReactNode } from "react";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

export type FieldType = "검색어" | "지역" | "가격" | "날짜";
export type SearchValue = Record<FieldType, string>;
const INITIAL_Search_VALUE: SearchValue = {
  검색어: "",
  지역: "",
  가격: "",
  날짜: "",
};

export interface SearchFilterDesktopContextType {
  searchValue: SearchValue;
  activeField: FieldType | null;
  changeValue: (value: Partial<SearchValue>) => void;
  reset: () => void;
  search: () => void;
  openField: (field: FieldType) => void;
  closeField: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const SearchFilterDesktopContext = createContext<SearchFilterDesktopContextType | null>(null);

interface SearchFilterDesktopProviderProps {
  children: ReactNode;
}

const SearchFilterDesktopProvider = ({ children }: SearchFilterDesktopProviderProps) => {
  const [searchValue, setSearchValue] =
    useState<SearchValue>(INITIAL_Search_VALUE);
  const [activeField, setActiveField] = useState<FieldType | null>(null);
  const navigate = useNavigate();

  const changeValue = useCallback((value: Partial<SearchValue>) => {
    setSearchValue((prev) => ({ ...prev, ...value }));
    // value의 프로퍼티 키가 검색어라면, setActiveField(지역) ...
  }, []);

  const reset = () => {
    setSearchValue(INITIAL_Search_VALUE);
  };

  const search = () => {
    const getUrlDate = (raw: string) => {
      return raw.replaceAll("/", "-");
    };
    const getUrlPrice = (raw: string) => {
      return String(parseFloat(raw.replace("만", "")) * 10000);
    };
    const params = new URLSearchParams();

    if (searchValue.검색어) {
      params.append("keyword", searchValue.검색어);
    }
    if (searchValue.지역) {
      params.append("location", searchValue.지역);
    }
    if (searchValue.가격) {
      const [minPrice, maxPrice] = searchValue.가격.split(" - ");

      params.append("min_price", getUrlPrice(minPrice));
      
      // 가격 상한을 선택하지 않아 maxPrice가 "50만+"인 경우
      if (!maxPrice.includes("+")) {
        params.append("max_price", maxPrice);
      }
    }
    if (searchValue.날짜) {
      const [startDate, endDate] = searchValue.날짜
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