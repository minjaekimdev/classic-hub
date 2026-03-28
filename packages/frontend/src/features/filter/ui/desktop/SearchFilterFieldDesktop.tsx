import bottomArrow from "@shared/assets/icons/bottom-arrow-gray.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/shadcn/dropdown-menu";
import formatPriceToKo from "../../../../shared/utils/formatPriceToKo";
import formatDateQueryToFilter from "../../utils/formatDateQueryToFilter";
import type { FieldType } from "../../types/filter";
import { useSearch } from "../../contexts/search-context.desktop";

const FIELD_MAP: Record<FieldType, string> = {
  keyword: "검색어",
  location: "지역",
  price: "가격",
  period: "기간",
};

interface FilterFieldProps {
  iconSrc: string;
  field: Exclude<FieldType, "keyword">;
  children: React.ReactNode;
}
const SearchFilterField = ({ iconSrc, field, children }: FilterFieldProps) => {
  const { searchValue, activeField, openField, closeField } = useSearch();
  const isOpen = field === activeField;

  const valueMap: Record<Exclude<FieldType, "keyword">, string | null> = {
    location: searchValue.location || null,
    price: searchValue.minPrice
      ? formatPriceToKo(searchValue.minPrice, searchValue.maxPrice)
      : null,
    period: searchValue.startDate
      ? formatDateQueryToFilter(searchValue.startDate, searchValue.endDate!)
      : null,
  };

  return (
    <DropdownMenu
      modal={false}
      open={isOpen}
      // isOpenNow에는 앞으로 변할 상태가 들어감(현재 닫힘 -> isOpenNow = true)
      // 클릭과 같은 토글 이벤트가 발생할 때마다 실행됨
      onOpenChange={(isOpenNow: boolean) => {
        if (isOpenNow) {
          openField(field);
        } else {
          closeField();
        }
      }}
    >
      <DropdownMenuTrigger>
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-[1.97rem] w-full place-content-between items-center p-[0_0.66rem]">
            <div className="flex items-center gap-[0.44rem]">
              <img className="h-3.5 w-3.5" src={iconSrc} alt="" />
              <span className={`text-[0.77rem]/[1.09rem]`}>
                {valueMap[field] || (
                  <span className="text-gray-400">{FIELD_MAP[field]}</span>
                )}
              </span>
            </div>
            <img className="mb-1 h-3.5 w-3.5" src={bottomArrow} alt="" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-(--z-header-dropdown)">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SearchFilterField;
