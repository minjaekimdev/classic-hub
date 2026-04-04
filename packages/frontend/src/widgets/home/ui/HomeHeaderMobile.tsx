import { useBottomSheet } from "@/app/providers/bottom-sheet/useBottomSheet";
import Logo from "@/shared/ui/logos/Logo";
import searchIcon from "@shared/assets/icons/search-gray.svg";
// import feedbackIcon from "@shared/assets/icons/feedback.svg";
import { useModal } from "@/app/providers/modal/useModal";
import feedbackIcon from "@shared/assets/icons/comment-red.svg";

const Header = () => {
  const { openModal } = useModal();
  return (
    <div className="flex w-full items-center justify-between">
      <Logo />
      <img
        src={feedbackIcon}
        alt="의견 제안"
        className="h-5 w-5 cursor-pointer"
        onClick={() => openModal("FEEDBACK", {})}
      />
    </div>
  );
};

const HomeHeaderMobile = ({ isScrollZero }: { isScrollZero: boolean }) => {
  const { openBottomSheet } = useBottomSheet();
  return (
    <header className="fixed top-0 z-20 flex w-full flex-col justify-center bg-[linear-gradient(180deg,#FFF_39.9%,#F8F8F8_100%)] px-[1.09rem] py-6">
      <div className="flex flex-col items-center gap-4">
        {isScrollZero && <Header />}
        <div className="w-full">
          <div
            className="rounded-first-filter flex h-[2.88rem] w-full cursor-pointer items-center justify-center border border-gray-200 bg-white shadow-xl"
            onClick={() => openBottomSheet("SEARCH", {})}
          >
            <div className="flex gap-[0.28rem]">
              <img
                src={searchIcon}
                alt=""
                className="h-[1.09rem] w-[1.09rem] translate-y-0.5"
              />
              <span className="text-[0.88rem]/[1.31rem] text-[#6a7282]">
                원하는 클래식 공연을 찾아보세요
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeaderMobile;
