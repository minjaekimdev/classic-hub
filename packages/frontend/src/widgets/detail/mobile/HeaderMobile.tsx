import { useDetail } from "@/features/performance/contexts/detail-context";
import arrowIcon from "@shared/assets/icons/left-arrowhead-black.svg";
import { useNavigate } from "react-router-dom";

const HeaderMobile = () => {
  const { title } = useDetail();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 뒤로 가기 실행 
  };

  return (
    <div className="flex h-14 items-center justify-between px-[0.44rem]">
      <div className="flex flex-1 justify-start" onClick={handleBack}>
        <img src={arrowIcon} alt="뒤로가기" className="" />
      </div>
      <span className="text-dark flex-none text-[0.88rem]/[1.31rem] font-semibold">
        {title}
      </span>
      <div className="flex-1"></div>
    </div>
  );
};

export default HeaderMobile;
