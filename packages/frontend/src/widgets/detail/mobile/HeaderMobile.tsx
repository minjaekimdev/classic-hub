import { useDetail } from "@/features/performance/contexts/detail-context";
import arrowIcon from "@shared/assets/icons/left-arrowhead-black.svg";
import { useNavigate } from "react-router-dom";

const HeaderMobile = () => {
  const { title } = useDetail();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex h-14 items-center justify-between bg-white px-4">
      {/* 1. 뒤로가기 버튼 영역: 고정 너비를 주어 중앙 제목이 밀리지 않게 함 */}
      <div className="flex w-10 shrink-0 justify-start">
        <button
          onClick={handleBack}
          className="-ml-1 p-1 transition-opacity active:opacity-50"
          aria-label="뒤로가기"
        >
          <img src={arrowIcon} alt="" className="h-6 w-6" />
        </button>
      </div>

      {/* 2. 제목 영역: flex-1과 min-w-0을 주어 말줄임표가 작동하게 함 */}
      <div className="min-w-0 flex-1 text-center">
        <h1 className="text-dark truncate text-[0.88rem] font-semibold">
          {title}
        </h1>
      </div>

      {/* 3. 우측 여백 영역: 왼쪽 버튼 영역과 동일한 너비를 주어 제목을 정중앙에 배치 */}
      <div className="w-10 shrink-0"></div>
    </div>
  );
};
export default HeaderMobile;
