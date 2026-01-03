import { type SetStateAction } from "react";
import type { filterCategoryObjType } from "@/features/filter/model/filter";

interface FilterFieldProps {
  iconSrc: string;
  label: string;
  subtitle: string;
  filterValue: filterCategoryObjType;
  onSelect: React.Dispatch<SetStateAction<string | null>>;
}

const LABEL_TO_KEY: Record<string, keyof filterCategoryObjType> = {
  지역: "location",
  날짜: "date",
  가격대: "price",
};

const FilterFieldMobile = ({
  iconSrc,
  label,
  subtitle,
  filterValue,
  onSelect,
}: FilterFieldProps) => {
  const categoryKey = LABEL_TO_KEY[label];
  return (
    <div
      className="flex gap-[0.66rem] rounded-[0.797rem] bg-[#f9fafb] p-[0.88rem] cursor-pointer"
      onClick={() => onSelect(label)}
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
        {filterValue[categoryKey] && (
          <span className="text-main text-[0.77rem]/[1.09rem]">
            선택됨: {filterValue[categoryKey]}
          </span>
        )}
      </div>
    </div>
  );
};

export default FilterFieldMobile;
