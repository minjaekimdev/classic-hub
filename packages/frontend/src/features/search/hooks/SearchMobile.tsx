import { createContext, useContext, useState } from "react";
import type { SearchCategory } from "../types";

interface SearchMobileContextType {
  filters: SearchCategory;
  activeCategory: keyof SearchCategory | null;
  updateFilters: (value: SearchCategory) => void;
  changeActiveCategory: (value: keyof SearchCategory) => void;
  reset: () => void;
}

const SearchMobileContext = createContext<SearchMobileContextType | null>(null);

const SearchMobileProvider = ({ children }: { children: React.ReactNode }) => {
  // 검색어는 별도의 상태로 관리
  const [filters, setFilters] = useState<SearchCategory>({
    keyword: "",
    location: "",
    date: "",
    price: "",
  });
  // 현재 어떤 카테고리가 선택되었는지
  const [activeCategory, setActiveCategory] = useState<
    keyof SearchCategory | null
  >(null);

  const reset = () => {
    setFilters({
      keyword: "",
      location: "",
      date: "",
      price: "",
    });
    setActiveCategory(null);
  };

  const updateFilters = (value: SearchCategory) => {
    setFilters(value);
  };

  const changeActiveCategory = (value: keyof SearchCategory) => {
    setActiveCategory(value);
  }

  return (
    <SearchMobileContext.Provider
      value={{ filters, activeCategory, updateFilters, changeActiveCategory, reset }}
    >
      {children}
    </SearchMobileContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSearchMobile = () => {
  const context = useContext(SearchMobileContext);
  if (!context) {
    throw new Error("useSearchMobile should be used within a SearchMobileProvider.")
  }
  return context;
}

const SearchMobile = ({children}: {children: React.ReactNode}) => {
  return (
    <SearchMobileProvider>
      {children}
    </SearchMobileProvider>
  )
}

export default SearchMobile;