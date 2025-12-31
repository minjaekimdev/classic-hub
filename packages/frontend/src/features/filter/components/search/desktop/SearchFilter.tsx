import {
  useCallback,
  useImperativeHandle,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import {
  type FieldType,
  type FilterValue,
  FilterContext,
  useFilter
} from "../../../hooks/useSearchFilter";
import searchIcon from "@shared/assets/icons/search-gray.svg";
import bottomArrow from "@shared/assets/icons/bottom-arrow-gray.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@shared/ui/shadcn/dropdown-menu";

const INITIAL_FILTER_VALUE = {
  searchText: "",
  location: "",
  priceRange: "",
  dateRange: "",
};

// 외부에서 ref로 사용할 메서드 타입 정의
export interface FilterHandle {
  changeValue: (value: Partial<FilterValue>) => void;
}

interface FilterProviderProps {
  ref: Ref<FilterHandle>;
  children: ReactNode;
}
const FilterProvider = ({ ref, children }: FilterProviderProps) => {
  const [filterValue, setFilterValue] =
    useState<FilterValue>(INITIAL_FILTER_VALUE);
  const [activeField, setActiveField] = useState<FieldType | null>(null);

  const changeValue = useCallback((value: Partial<FilterValue>) => {
    setFilterValue((prev) => ({ ...prev, ...value }));
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

  useImperativeHandle(
    ref,
    () => ({
      changeValue,
    }),
    [changeValue]
  );

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

const FilterSearchInput = () => {
  const { filterValue, changeValue } = useFilter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeValue({ ...filterValue, searchText: e.target.value });
  };
  return (
    <div className="flex items-center gap-[0.66rem] p-[0.22rem_0.66rem] h-[2.63rem]">
      <img src={searchIcon} alt="" />
      <input
        className="w-full text-[0.77rem] placeholder:text-[0.77rem] focus-visible:outline-none"
        type="text"
        placeholder="공연명, 아티스트명, 작품명 등으로 검색해보세요!"
        value={filterValue.searchText}
        onChange={handleChange}
      />
    </div>
  );
};

interface FilterFieldProps {
  iconSrc: string;
  title: FieldType;
  children: ReactNode;
}
const FilterField = ({ iconSrc, title, children }: FilterFieldProps) => {
  const { activeField, openField, closeField } = useFilter();
  const isOpen = title === activeField;
  return (
    <DropdownMenu
      modal={false}
      open={isOpen}
      // isOpenNow에는 앞으로 변할 상태가 들어감(현재 닫힘 -> isOpenNow = true)
      onOpenChange={(isOpenNow: boolean) => {
        if (isOpenNow) {
          openField(title);
        } else {
          closeField();
        }
      }}
    >
      <DropdownMenuTrigger>
        <div className="w-full h-full flex justify-center items-center">
          <div className="flex place-content-between items-center w-full h-[1.97rem] p-[0_0.66rem]">
            <div className="flex items-center gap-[0.44rem]">
              <img className="w-3.5 h-3.5" src={iconSrc} alt="" />
              <span className="text-[0.77rem]/[1.09rem]">{title}</span>
            </div>
            <img className="w-3.5 h-3.5 mb-1" src={bottomArrow} alt="" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
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
  ref: Ref<FilterHandle>;
  children: ReactNode;
}
const FilterRoot = ({ ref, children }: FilterRootProps) => {
  return <FilterProvider ref={ref}>{children}</FilterProvider>;
};

export const SearchFilter = Object.assign(FilterRoot, {
  Input: FilterSearchInput,
  Field: FilterField,
  Reset: FilterReset,
  Search: FilterSearch,
});
