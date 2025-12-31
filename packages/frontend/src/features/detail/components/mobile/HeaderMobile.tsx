import { useDetail } from "@features/detail/model/useDetail";
import arrowIcon from "@shared/assets/icons/left-arrowhead-black.svg";

const HeaderMobile = () => {
  const performance = useDetail();

  return (
    <div className="flex justify-between items-center px-[0.44rem] h-14">
      <div className="flex-1 flex justify-start">
        <img src={arrowIcon} alt="뒤로가기" className="" />
      </div>
      <span className="flex-none text-dark text-[0.88rem]/[1.31rem] font-semibold">
        {performance.title}
      </span>
      <div className="flex-1"></div>
    </div>
  );
};

export default HeaderMobile;
