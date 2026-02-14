import { FIELD_KO_TO_EN } from "../../constants/name-mapper";
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
  console.log(`label: ${label}`);
  console.log(`map: ${FIELD_KO_TO_EN[label]}`);
  return (
    <div
      className="flex gap-[0.66rem] rounded-[0.797rem] bg-[#f9fafb] p-[0.88rem] cursor-pointer"
      onClick={() => changeActiveCategory(FIELD_KO_TO_EN[label])}
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
        {filters[FIELD_KO_TO_EN[label]] && (
          <span className="text-main text-[0.77rem]/[1.09rem]">
            선택됨: {filters[FIELD_KO_TO_EN[label]]}
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchFilterFieldMobile;
