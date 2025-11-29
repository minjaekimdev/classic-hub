import searchIcon from "@shared/assets/icons/search-gray.svg";
import type { SetStateAction } from "react";
import type { filterCategoryObjType } from "@/shared/model/filter";

interface SearchInputMobileProps {
  filterValue: filterCategoryObjType;
  onChange: React.Dispatch<SetStateAction<filterCategoryObjType>>;
}

const SearchInputMobile = ({
  filterValue,
  onChange,
}: SearchInputMobileProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filterValue, searchText: e.target.value });
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

export default SearchInputMobile;
