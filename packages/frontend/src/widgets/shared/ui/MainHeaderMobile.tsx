import logo from "@shared/assets/logos/classichub.svg";
import filterIcon from "@shared/assets/icons/filter-dark.svg";
import { Link } from "react-router-dom";
import { useBottomSheet } from "@/shared/ui/bottom-sheet/BottomSheet";
import SearchFilterMobile from "@/features/filter/ui/mobile/SearchFilterMobile";
import FilterMobile from "@/features/filter/ui/mobile/FilterMobile";
import useMainHeaderMobileText from "../../../layout/hooks/useMainHeaderMobileText";
import searchIcon from "@shared/assets/icons/search-black.svg";

const MainHeaderMobile = () => {
  const headerText = useMainHeaderMobileText();
  const { open } = useBottomSheet();

  return (
    <h1 className="sticky z-(--z-header) top-0 flex justify-center items-center px-[0.88rem] py-[0.49rem] bg-white">
      <Link to="/">
        <img src={logo} alt="로고" />
      </Link>
      <div className="w-[0.66rem]"></div>
      <div className="flex-1">
        <div
          className="flex items-center justify-between rounded-full px-[0.88rem] h-10 bg-[#F3F4F6] cursor-pointer"
          onClick={() => open(<SearchFilterMobile />)}
        >
          <div className="flex flex-col text-[#101828] text-[0.77rem]/[1.09rem] font-semibold">
            {headerText}
          </div>
          <img src={searchIcon} alt="" />
        </div>
      </div>
      <div className="w-[0.66rem]"></div>
      <button
        className="flex items-center justify-center border border-[#d1d5dc] rounded-full w-[2.09rem] h-[2.09rem]"
        onClick={() => open(<FilterMobile />)}
      >
        <img src={filterIcon} alt="필터" />
      </button>
    </h1>
  );
};

export default MainHeaderMobile;
