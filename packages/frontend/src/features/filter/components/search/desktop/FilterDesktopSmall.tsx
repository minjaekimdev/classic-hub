import searchIcon from "@shared/assets/icons/search-white.svg";
import { useFilter, type FieldType } from "../../../hooks/useSearchFilter";

const field: FieldType[] = ["지역", "가격", "날짜"];

interface FieldProps {
  field: FieldType;
  onFilterFieldClick: (isFilterActive: boolean) => void;
}
const Field = ({ field, onFilterFieldClick }: FieldProps) => {
  const { filterValue, openField } = useFilter();

  return (
    <div
      className="flex-1 text-xs cursor-pointer m-auto px-4 w-full h-full text-center"
      onClick={(e) => {
        e.stopPropagation();
        openField(field);
        onFilterFieldClick(true);
      }}
    >
      {filterValue[field] ? filterValue[field] : field}
    </div>
  );
};

interface FilterDesktopSmallProps {
  onFilterFieldClick: (isFilterActive: boolean) => void;
}
const FilterDesktopSmall = ({
  onFilterFieldClick,
}: FilterDesktopSmallProps) => {
  const { openField, filterValue } = useFilter();

  return (
    <div
      className="flex items-center rounded-[0.875rem] border border-gray-200 my-auto bg-white p-2 px-2 min-w-80
    "
    >
      <div
        className="grow-2 shrink-0 flex justify-center items-center ml-2 pl-2 pr-4 h-full text-xs cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          openField("검색어");
          onFilterFieldClick(true);
        }}
      >
        {filterValue.검색어 ? filterValue.검색어 : "검색어"}
      </div>
      {field.map((item) => (
        <div key={item} className="grow flex">
          <div className="flex-none w-px h-5 bg-[#E5E7EB]"></div>
          <Field field={item} onFilterFieldClick={onFilterFieldClick} />
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

export default FilterDesktopSmall;
