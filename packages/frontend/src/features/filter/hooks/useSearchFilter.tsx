import { createContext, useContext } from "react";

export type FieldType = "검색어" | "지역" | "가격" | "날짜";

export type FilterValue = Record<FieldType, string>

export interface FilterContextType {
  filterValue: FilterValue;
  activeField: FieldType | null;
  changeValue: (value: Partial<FilterValue>) => void;
  reset: () => void;
  search: () => void;
  openField: (field: FieldType) => void;
  closeField: () => void;
}

export const FilterContext = createContext<FilterContextType | null>(null);

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within FilterProvider");
  }
  return context;
};
