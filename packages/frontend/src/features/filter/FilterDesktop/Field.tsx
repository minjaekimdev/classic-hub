import React from "react";
import dropdownIcon from "@shared/assets/icons/bottom-arrow-gray.svg";

interface FieldProps {
  icon: string;
  label: string;
}

// const locationArray = ["서울", "인천", "대전", "대구", "광주", "부산"];

const Field = ({ icon, label }: FieldProps) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex place-content-between items-center w-35 h-[1.97rem] p-[0 0.66rem]">
        <div className="flex items-center gap-[0.44rem]">
          <img className="w-3.5 h-3.5" src={icon} alt="" />
          <span className="text-[#867e7c] text-[0.77rem]/[1.09rem]">
            {label}
          </span>
        </div>
        <img className="w-3.5 h-3.5 mb-1" src={dropdownIcon} alt="" />
      </div>
    </div>
  );
};

export default Field;
