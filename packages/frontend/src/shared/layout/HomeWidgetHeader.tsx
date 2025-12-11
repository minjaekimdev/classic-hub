import React from "react";
import rightArrow from "@shared/assets/icons/right-arrow-red.svg";

interface HomeWidgetHeaderProps {
  icon: string;
  mainTitle: string;
  subTitle: string;
}

const HomeWidgetHeader: React.FC<HomeWidgetHeaderProps> = ({
  icon,
  mainTitle,
  subTitle,
}) => {
  return (
    <div className="flex justify-between items-center w-[calc(100%-3.5rem)]">
      <div className="flex items-center gap-[0.66rem]">
        <img className="w-[1.31rem] h-[1.31rem]" src={icon} alt="" />
        <div className="flex flex-col">
          <h1 className="text-[#101828] text-[1.09rem]/[1.53rem] font-bold">{mainTitle}</h1>
          <span className="text-[#4a5565] text-[0.77rem]/[1.09rem]">{subTitle}</span>
        </div>
      </div>
      <div className="flex gap-[0.43rem] items-center p-[0.47rem_0.66rem_0.38rem] text-main text-[0.76rem]/[1.1rem] font-medium cursor-pointer">
        전체보기
        <img src={rightArrow} alt="" />
      </div>
    </div>
  );
};

export default HomeWidgetHeader;
