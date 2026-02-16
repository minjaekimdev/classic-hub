import logo from "@shared/assets/logos/classichub.svg";
import humanIcon from "@shared/assets/icons/human-black.svg";
import React from "react";
import BottomSheet from "@/shared/ui/bottom-sheet/BottomSheet";

const MOCKUP_DATA = ["지역", "가격", "기간"];

const MainHeaderMobile = () => {
  return (
    <h1 className="flex justify-center items-center px-[0.88rem]">
      <img src={logo} alt="" className="" />
      {/* 양옆 간격을 위한 요소 */}
      <div className="w-[0.66rem]"></div>
      <BottomSheet.Trigger>
        <div className="flex-1 rounded-full px-[0.88rem] py-[0.66rem] bg-[#F3F4F6]">
          <div className="flex flex-col">
            <span className="text-[#101828] text-[0.77rem]/[1.09rem] font-semibold">
              공연 제목
            </span>
            <div className="flex gap-[0.33rem]">
              {MOCKUP_DATA.map((item, index) => (
                <React.Fragment key={item}>
                  <span className="text-[#4a5565] text-[0.66rem]/[0.88rem]">
                    {item}
                  </span>
                  {index < MOCKUP_DATA.length - 1 && (
                    <span className="text-[#4a5565] text-[0.66rem]/[0.88rem]">
                      |
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </BottomSheet.Trigger>
      <div className="w-[0.66rem]"></div>
      <button className="flex items-center justify-center border border-[#d1d5dc] rounded-full w-[2.09rem] h-[2.09rem]">
        <img src={humanIcon} alt="" className="" />
      </button>
    </h1>
  );
};

export default MainHeaderMobile;
