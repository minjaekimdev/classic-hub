// 필터의 열고닫힘 상태만 전역적으로 관리
import { createContext, useContext, useState } from "react";

interface FilterUIContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const FilterUIContext = createContext<FilterUIContextType | null>(null);

export const FilterUIProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false); // 기본값은 닫힘 추천

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <FilterUIContext.Provider value={{ isOpen, open, close }}>
      {children}
    </FilterUIContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFilterUI = () => {
  const context = useContext(FilterUIContext);
  if (!context)
    throw new Error("useFilterUI must be used within FilterUIProvider");
  return context;
};
