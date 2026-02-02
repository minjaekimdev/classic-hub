import { useEffect, useRef } from "react";
import searchIcon from "@shared/assets/icons/search-gray.svg";
import { useFilter } from "./SearchFilter";

const SearchFilterInput = () => {
  const { filterValue, activeField, changeValue, openField } = useFilter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeValue({ ...filterValue, 검색어: e.target.value });
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeField === "검색어") {
      inputRef.current?.focus();
    }
  }, [activeField]);

  return (
    <div className="flex items-center gap-[0.66rem] p-[0.22rem_0.66rem]">
      <img src={searchIcon} alt="" />
      <input
        ref={inputRef}
        className="w-full text-[0.77rem] placeholder:text-[0.77rem] focus-visible:outline-none"
        type="text"
        placeholder="공연명, 아티스트명 등으로 검색해보세요!"
        value={filterValue.검색어}
        onFocus={() => openField("검색어")}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchFilterInput;
