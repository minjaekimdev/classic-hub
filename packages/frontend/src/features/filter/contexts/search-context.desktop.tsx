import { type ReactNode } from "react";
import { createContext, useContext } from "react";
import type { SearchFilterContextType } from "../types/filter";
import useSearchFilter from "../hooks/useSearchFilter";
import { useLayoutDesktop } from "@/layout/desktop/LayoutDesktop";

// eslint-disable-next-line react-refresh/only-export-components
export const SearchFilterContext =
  createContext<SearchFilterContextType | null>(null);

const SearchFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const { shrink } = useLayoutDesktop();
  const {
    searchValue,
    activeField,
    changeValue,
    reset,
    search,
    openField,
    closeField,
  } = useSearchFilter({ onSearch: shrink });

  // activeField가 null이 아니면 특정 field가 클릭(활성화)되었다는 의미
  return (
    <SearchFilterContext
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
    </SearchFilterContext>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSearch = () => {
  const context = useContext(SearchFilterContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
};

const SearchFilterReset = ({ children }: { children: ReactNode }) => {
  const { reset } = useSearch();
  return <button onClick={reset}>{children}</button>;
};

const SearchFilterApply = ({ children }: { children: ReactNode }) => {
  const { search } = useSearch();
  return <button onClick={search}>{children}</button>;
};

interface SearchFilterRootProps {
  children: ReactNode;
}
const SearchRoot = ({ children }: SearchFilterRootProps) => {
  return <SearchFilterProvider>{children}</SearchFilterProvider>;
};

const SearchDesktop = Object.assign(SearchRoot, {
  Reset: SearchFilterReset,
  Apply: SearchFilterApply,
});

export default SearchDesktop;
