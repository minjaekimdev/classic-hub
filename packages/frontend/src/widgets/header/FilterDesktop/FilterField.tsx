import React from "react";
import dropdownIcon from "@shared/assets/icons/bottom-arrow-gray.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@shared/ui/shadcn/dropdown-menu";

interface FieldProps {
  icon: string;
  label: string;
  children: React.ReactNode;
}

const FilterField = ({ icon, label, children }: FieldProps) => {
  const textStyle =
    label === "지역" || label === "가격" || label === "날짜"
      ? "#867e7c"
      : "#000";
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <div className="w-full h-full flex justify-center items-center">
          <div className="flex place-content-between items-center w-full h-[1.97rem] p-[0_0.66rem]">
            <div className="flex items-center gap-[0.44rem]">
              <img className="w-3.5 h-3.5" src={icon} alt="" />
              <span className="text-[0.77rem]/[1.09rem]" style={{color: textStyle}}>
                {label}
              </span>
            </div>
            <img className="w-3.5 h-3.5 mb-1" src={dropdownIcon} alt="" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-[600px]:hidden">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterField;
