import searchIcon from "@shared/assets/icons/search-white.svg";
import formatPriceToKo from "../../../../shared/utils/formatPriceToKo";
import formatDateQueryToFilter from "../../utils/formatDateQueryToFilter";
import { FIELD_EN_TO_KO } from "../../constants/name-mapper";
import type { FieldType } from "../../types/filter";
import { useSearch } from "../../contexts/search-context.desktop";
import useFilterParams from "@/shared/hooks/useFilterParams";

interface FieldProps {
  field: FieldType;
  value: string | null;
  onFilterClick: (isFilterActive: boolean) => void;
}
const Field = ({ field, value, onFilterClick }: FieldProps) => {
  const { openField } = useSearch();

  return (
    <div
      className="m-auto h-full w-full flex-1 cursor-pointer px-4 text-center text-xs"
      onClick={(e) => {
        e.stopPropagation();
        openField(field);
        onFilterClick(true);
      }}
    >
      {value ? (
        value
      ) : (
        <span className="text-gray-400">{FIELD_EN_TO_KO[field]}</span>
      )}
    </div>
  );
};

interface SearchFilterSmallProps {
  onFilterClick: (isFilterActive: boolean) => void;
}
const SearchFilterShrinked = ({ onFilterClick }: SearchFilterSmallProps) => {
  const { openField } = useSearch();
  const filters = useFilterParams();
  const { location, minPrice, maxPrice, startDate, endDate } = filters;

  const categoryArr: [FieldType, string | null][] = [
    ["location", location],
    ["price", minPrice ? formatPriceToKo(minPrice, maxPrice) : null],
    [
      "period",
      startDate ? formatDateQueryToFilter(startDate, endDate as string) : null,
    ],
  ];

  return (
    <div className="my-auto flex min-w-80 items-center rounded-[0.875rem] border border-gray-200 bg-white p-2 px-2">
      <div
        className="ml-2 flex h-full shrink-0 grow-2 cursor-pointer items-center justify-center pr-4 pl-2 text-xs"
        onClick={(e) => {
          e.stopPropagation();
          openField("keyword");
          onFilterClick(true);
        }}
      >
        {filters.keyword ? (
          filters.keyword
        ) : (
          <span className="text-gray-400">검색어</span>
        )}
      </div>
      {categoryArr.map(([label, value]) => (
        <div key={label} className="flex grow">
          <div className="h-5 w-px flex-none bg-[#E5E7EB]"></div>
          <Field field={label} value={value} onFilterClick={onFilterClick} />
        </div>
      ))}
      <button className="rounded-main bg-main shrink-0 p-[0.69rem_0.56rem] text-[0.77rem] text-white transition-transform duration-200 hover:scale-105">
        <div className="flex w-fit items-center gap-[0.44rem]">
          <img className="" src={searchIcon} alt="" />
        </div>
      </button>
    </div>
  );
};

export default SearchFilterShrinked;
