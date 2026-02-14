import { type ReactNode } from "react";
import { createContext, useContext } from "react";
import type { SearchFilterContextType } from "../types/filter";
import useSearchFilter from "../hooks/useSearchFilter";

// eslint-disable-next-line react-refresh/only-export-components
export const SearchFilterMobileContext =
  createContext<SearchFilterContextType | null>(null);

const SearchFilterMobileProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    searchValue,
    activeField,
    changeValue,
    reset,
    search,
    openField,
    closeField,
  } = useSearchFilter({onSearch: () => {}});

  // activeField가 null이 아니면 특정 field가 클릭(활성화)되었다는 의미
  return (
    <SearchFilterMobileContext
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
    </SearchFilterMobileContext>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSearchMobile = () => {
  const context = useContext(SearchFilterMobileContext);
  if (!context) {
    throw new Error("useSearchMobile must be used within SearchProvider");
  }
  return context;
};

const SearchFilterReset = ({ children }: { children: ReactNode }) => {
  const { reset } = useSearchMobile();
  return <button onClick={reset}>{children}</button>;
};

const SearchFilterApply = ({ children }: { children: ReactNode }) => {
  const { search } = useSearchMobile();
  return <div onClick={search}>{children}</div>;
};

interface SearchFilterMobileRootProps {
  children: ReactNode;
}
const SearchRoot = ({ children }: SearchFilterMobileRootProps) => {
  return <SearchFilterMobileProvider>{children}</SearchFilterMobileProvider>;
};

const SearchMobile = Object.assign(SearchRoot, {
  Reset: SearchFilterReset,
  Apply: SearchFilterApply,
});

export default SearchMobile;
