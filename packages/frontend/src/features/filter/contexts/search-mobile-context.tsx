import { createContext, useContext, useState } from "react";
import type { SearchCategory } from "../types/filter";

interface SearchFilterMobileContextType {
  filters: SearchCategory;
  activeCategory: keyof SearchCategory | null;
  updateFilters: (value: SearchCategory) => void;
  changeActiveCategory: (value: keyof SearchCategory) => void;
  reset: () => void;
}

const SearchFilterMobileContext = createContext<SearchFilterMobileContextType | null>(null);

const SearchFilterMobileProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<Record<keyof SearchCategory, string>>({
    keyword: "",
    location: "",
    period: "",
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
      period: "",
      price: "",
    });
    setActiveCategory(null);
  };

  const updateFilters = (value: SearchCategory) => {
    setFilters(value);
  };

  const changeActiveCategory = (value: keyof SearchCategory) => {
    setActiveCategory(value);
  };

  return (
    <SearchFilterMobileContext.Provider
      value={{
        filters,
        activeCategory,
        updateFilters,
        changeActiveCategory,
        reset,
      }}
    >
      {children}
    </SearchFilterMobileContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSearchFilterMobile = () => {
  const context = useContext(SearchFilterMobileContext);
  if (!context) {
    throw new Error(
      "useSearchFilterMobile should be used within a SearchFilterMobileProvider.",
    );
  }
  return context;
};

const SearchMobile = ({ children }: { children: React.ReactNode }) => {
  return <SearchFilterMobileProvider>{children}</SearchFilterMobileProvider>;
};

export default SearchMobile;
