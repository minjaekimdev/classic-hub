import BottomSheet from "@/shared/ui/bottom-sheet/BottomSheet";
import Logo from "@/shared/ui/logos/Logo";
import searchIcon from "@shared/assets/icons/search-gray.svg";
import useHomeLayoutMobile from "../hooks/useHomeLayoutMobile";

const HomeHeaderMobile = () => {
  const { isScrollZero } = useHomeLayoutMobile();
  return (
    <header className="fixed top-0 z-20 flex flex-col justify-center w-full px-[1.09rem] py-6 bg-[#f3f3f3]">
      <div className="flex flex-col gap-4 items-center">
        {isScrollZero && <Logo />}
        <div className="w-full">
          <BottomSheet.Trigger>
            <div className="flex justify-center items-center border border-[2px_solid_#e5e7eb] bg-white rounded-full w-full h-[2.88rem] cursor-pointer">
              <div className="flex gap-[0.28rem]">
                <img
                  src={searchIcon}
                  alt=""
                  className="w-[1.09rem] h-[1.09rem] translate-y-0.5"
                />
                <span className="text-[#6a7282] text-[0.88rem]/[1.31rem]">
                  원하는 클래식 공연을 찾아보세요
                </span>
              </div>
            </div>
          </BottomSheet.Trigger>
        </div>
      </div>
    </header>
  );
};

export default HomeHeaderMobile;
