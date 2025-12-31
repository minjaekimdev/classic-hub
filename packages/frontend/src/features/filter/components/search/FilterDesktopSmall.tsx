import searchIcon from "@shared/assets/icons/search-white.svg";
import type { filterCategoryObjType } from "@/features/filter/model/filter";

interface FilterDesktopSmallProps {
  filterValue: filterCategoryObjType;
  onFilterClick: () => void;
}

const FilterDesktopSmall = ({
  filterValue,
  onFilterClick,
}: FilterDesktopSmallProps) => {
  return (
    <div
      className="flex items-center gap-2 rounded-[0.875rem] border border-gray-200 my-auto bg-white p-2 px-2 min-w-80
    "
      onClick={(e) => {
        e.stopPropagation();
        onFilterClick();
      }}
    >
      <div className="grow-2 shrink-0 flex justify-center items-center ml-2 text-xs">
        {filterValue.searchText === "" ? "검색어" : filterValue.searchText}
      </div>
      <div className="w-px h-5 bg-[#E5E7EB]"></div>
      <div className="grow shrink-0 flex justify-center items-center text-xs">
        {filterValue.location}
      </div>
      <div className="w-px h-5 bg-[#E5E7EB]"></div>
      <div className="grow shrink-0 flex justify-center items-center text-xs">
        {filterValue.price}
      </div>
      <div className="w-px h-5 bg-[#E5E7EB]"></div>
      <div className="grow shrink-0 flex justify-center items-center text-xs">
        {filterValue.date}
      </div>
      <button className="shrink-0 p-[0.69rem_0.56rem] rounded-main bg-main text-white text-[0.77rem] transition-transform duration-200 hover:scale-105">
        <div className="flex items-center gap-[0.44rem] w-fit">
          <img className="" src={searchIcon} alt="" />
        </div>
      </button>
    </div>
  );
};

export default FilterDesktopSmall;
