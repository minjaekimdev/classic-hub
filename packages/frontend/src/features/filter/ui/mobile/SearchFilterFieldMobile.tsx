import { useSearchFilterMobile } from "../../contexts/search-mobile-context";
import { SEARCH_LABEL_TO_KEY } from "../../mappers/serach-label-to-english";

interface SearchFilterFieldMobileProps {
  iconSrc: string;
  label: string;
  subtitle: string;
}

const SearchFilterFieldMobile = ({
  iconSrc,
  label,
  subtitle,
}: SearchFilterFieldMobileProps) => {
  const { filters, changeActiveCategory } = useSearchFilterMobile();
  const categoryKey = SEARCH_LABEL_TO_KEY[label];
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

export default SearchFilterFieldMobile;
