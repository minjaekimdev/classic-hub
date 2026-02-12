import searchIcon from "@shared/assets/icons/search-white.svg";
import {
  useSearchFilterDesktop,
  type FieldType,
} from "../../contexts/search-desktop-context";
import formatPriceQueryToFilter from "../../utils/formatPriceQueryToFilter";
import formatDateQueryToFilter from "../../utils/formatDateQueryToFilter";
import useQueryParams from "@/shared/hooks/useParams";
import { FIELD_MAP } from "../../constants/name-mapper";

interface FieldProps {
  field: FieldType;
  value: string | null;
  onFilterClick: (isFilterActive: boolean) => void;
}
const Field = ({ field, value, onFilterClick }: FieldProps) => {
  const { openField } = useSearchFilterDesktop();

  return (
    <div
      className="flex-1 text-xs cursor-pointer m-auto px-4 w-full h-full text-center"
      onClick={(e) => {
        e.stopPropagation();
        openField(field);
        onFilterClick(true);
      }}
    >
      {value ? (
        value
      ) : (
        <span className="text-gray-400">{FIELD_MAP[field]}</span>
      )}
    </div>
  );
};

interface SearchFilterSmallProps {
  onFilterClick: (isFilterActive: boolean) => void;
}
const SearchFilterSmall = ({ onFilterClick }: SearchFilterSmallProps) => {
  const { openField } = useSearchFilterDesktop();
  const { filters } = useQueryParams();
  const { location, minPrice, maxPrice, startDate, endDate } = filters;

  const categoryArr: [FieldType, string | null][] = [
    ["location", location],
    ["price", minPrice ? formatPriceQueryToFilter(minPrice, maxPrice) : null],
    [
      "period",
      startDate ? formatDateQueryToFilter(startDate, endDate as string) : null,
    ],
  ];

  return (
    <div
      className="flex items-center rounded-[0.875rem] border border-gray-200 my-auto bg-white p-2 px-2 min-w-80
    "
    >
      <div
        className="grow-2 shrink-0 flex justify-center items-center ml-2 pl-2 pr-4 h-full text-xs cursor-pointer"
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
        <div key={label} className="grow flex">
          <div className="flex-none w-px h-5 bg-[#E5E7EB]"></div>
          <Field field={label} value={value} onFilterClick={onFilterClick} />
        </div>
      ))}
      <button className="shrink-0 p-[0.69rem_0.56rem] rounded-main bg-main text-white text-[0.77rem] transition-transform duration-200 hover:scale-105">
        <div className="flex items-center gap-[0.44rem] w-fit">
          <img className="" src={searchIcon} alt="" />
        </div>
      </button>
    </div>
  );
};

export default SearchFilterSmall;
