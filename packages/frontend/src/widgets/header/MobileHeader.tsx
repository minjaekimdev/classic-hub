import searchIcon from "@shared/assets/icons/search-gray.svg";
import logoIcon from "@shared/assets/logos/classichub.svg";

const MobileHeader = () => {
  return (
    <div className="fixed z-20 bg-[#ebebeb] w-full">
      <div className="flex justify-center items-center px-6 h-[11.7rem]">
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex justify-center gap-[0.28rem]">
            <img className="w-7 h-7" src={logoIcon} alt="" />
            <h1 className="mt-auto text-[#101828] text-[1.31rem]/[1.31rem] font-logo font-bold ">
              ClassicHub
            </h1>
          </div>
          <div className="flex justify-center items-center rounded-full w-full h-[2.88rem] border-2 border-solid border-[#e5e7eb] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] cursor-pointer">
            <div className="flex shrink-0 gap-[0.6rem]">
              <img src={searchIcon} alt="" />
              <span className="text-[#6a7282] text-[0.88rem]/[1.31rem]">
                원하는 클래식 공연을 검색해보세요
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MobileHeader;
