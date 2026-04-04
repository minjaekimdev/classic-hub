import logo from "@shared/assets/logos/classichub.svg";
import filterIcon from "@shared/assets/icons/filter-dark.svg";
import { Link } from "react-router-dom";
import useMainHeaderMobileText from "../../../layout/hooks/useMainHeaderMobileText";
import searchIcon from "@shared/assets/icons/search-black.svg";
import { useBottomSheet } from "@/app/providers/bottom-sheet/useBottomSheet";

const MainHeaderMobile = () => {
  const headerText = useMainHeaderMobileText();
  const { openBottomSheet } = useBottomSheet();

  return (
    <h1 className="px-088 sticky top-0 z-(--z-header) flex items-center justify-center bg-white py-[0.49rem]">
      <Link to="/">
        <img src={logo} alt="로고" />
      </Link>
      <div className="w-066"></div>
      <div className="flex-1">
        <div
          className="px-088 flex h-10 cursor-pointer items-center justify-between rounded-full bg-[#F3F4F6]"
          onClick={() => openBottomSheet("SEARCH", {})}
        >
          <div className="flex flex-col text-[0.77rem]/[1.09rem] font-semibold text-[#101828]">
            {headerText}
          </div>
          <img src={searchIcon} alt="" />
        </div>
      </div>
      <div className="w-066"></div>
      <button
        className="flex h-[2.09rem] w-[2.09rem] items-center justify-center rounded-full border border-[#d1d5dc]"
        onClick={() => openBottomSheet("RESULT", {})}
      >
        <img src={filterIcon} alt="필터" />
      </button>
    </h1>
  );
};

export default MainHeaderMobile;
