import { useSearchFilterMobile } from "../../contexts/search-mobile-context";

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
  return (
    <div
      className="flex gap-[0.66rem] rounded-[0.797rem] bg-[#f9fafb] p-[0.88rem] cursor-pointer"
      onClick={() => changeActiveCategory(label)}
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
        {filters[label] && (
          <span className="text-main text-[0.77rem]/[1.09rem]">
            선택됨: {filters[label]}
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchFilterFieldMobile;
