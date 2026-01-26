import Logo from "@/shared/ui/logos/Logo";
import { useModal } from "@/shared/ui/modals/Modal";
import searchIcon from "@shared/assets/icons/search-gray.svg";

const HomeHeaderMobile = ({ isExpand }: { isExpand: boolean }) => {
  const { open } = useModal();
  return (
    <header className="fixed top-0 z-20 flex flex-col justify-center w-full px-[1.09rem] py-6 bg-[#f3f3f3]">
      <div className="flex flex-col gap-4 items-center">
        {isExpand && <Logo />}
        <div
          className="flex justify-center items-center border border-[2px_solid_#e5e7eb] bg-white rounded-full w-full h-[2.88rem] cursor-pointer"
          onClick={open}
        >
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
      </div>
    </header>
  );
};

export default HomeHeaderMobile;
