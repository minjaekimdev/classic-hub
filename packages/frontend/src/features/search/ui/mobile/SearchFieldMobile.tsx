import type { SearchCategory } from "../../types";
import { useSearchMobile } from "../../hooks/SearchMobile";

interface FilterFieldProps {
  iconSrc: string;
  label: string;
  subtitle: string;
}

const LABEL_TO_KEY: Record<string, keyof SearchCategory> = {
  검색어: "keyword",
  지역: "location",
  날짜: "date",
  가격대: "price",
};

const SearchFieldMobile = ({
  iconSrc,
  label,
  subtitle,
}: FilterFieldProps) => {
  const {filters, changeActiveCategory} = useSearchMobile();
  const categoryKey = LABEL_TO_KEY[label];
  return (
    <div
      className="flex gap-[0.66rem] rounded-[0.797rem] bg-[#f9fafb] p-[0.88rem] cursor-pointer"
      onClick={() => changeActiveCategory(categoryKey)}
    >
      <div className="flex justify-center items-center w-[1.97rem] h-[1.97rem]">
        <img src={iconSrc} alt="" />
      </div>
      <div className="flex flex-col">
        <span className="text-[#101828] text-[0.88rem]/[1.31rem] font-medium">
          {label} 선택
        </span>
        <span className="text-[#4a5565] text-[0.77rem]/[1.09rem]">
          {subtitle}
        </span>
        {filters[categoryKey] && (
          <span className="text-main text-[0.77rem]/[1.09rem]">
            선택됨: {filters[categoryKey]}
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchFieldMobile;
