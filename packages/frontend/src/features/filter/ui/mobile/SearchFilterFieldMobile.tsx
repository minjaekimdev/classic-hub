import { useSearchMobile } from "../../contexts/search-context.mobile";
import {
  FILTER_STRATEGY,
  type FieldTypeKo,
} from "../../utils/search-filter-strategy.mobile";

interface SearchFilterFieldMobileProps {
  iconSrc: string;
  label: FieldTypeKo;
  subtitle: string;
}

const SearchFilterFieldMobile = ({
  iconSrc,
  label,
  subtitle,
}: SearchFilterFieldMobileProps) => {
  const { searchValue, openField } = useSearchMobile();
  const strategy = FILTER_STRATEGY[label];

  return (
    <div
      className="flex gap-[0.66rem] rounded-[0.797rem] bg-[#f9fafb] p-[0.88rem] cursor-pointer"
      onClick={() => openField(FILTER_STRATEGY[label].key)}
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
        {strategy.isSelected(searchValue) && (
          <span className="text-main text-[0.77rem]/[1.09rem]">
            선택됨: {strategy.format(searchValue)}
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchFilterFieldMobile;
