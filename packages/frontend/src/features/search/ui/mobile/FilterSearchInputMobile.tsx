import searchIcon from "@shared/assets/icons/search-gray.svg";
import { useSearchMobile } from "../../hooks/SearchMobile";

const FilterSearchInputMobile = () => {
  const { filters, updateFilters } = useSearchMobile();
  return (
    <div className="flex items-center gap-2 rounded-full border border-[#d1d5dc] bg-[#f3f3f5] p-[0.22rem_0.66rem] h-10 cursor-pointer">
      <img src={searchIcon} alt="" className="w-3.5 h-3.5" />
      <input
        type="text"
        className="w-full placeholder:text-[#717182] text-[0.88rem] cursor-pointer"
        placeholder="공연명, 아티스트명, 작품명 등"
        value={filters.keyword}
        onChange={(e) => updateFilters({ ...filters, keyword: e.target.value })}
      />
    </div>
  );
};

export default FilterSearchInputMobile;
