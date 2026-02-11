import filterIcon from "@shared/assets/icons/filter-dark.svg";
import closeIcon from "@shared/assets/icons/close-white.svg";
import { useFilter } from "@/features/filter/contexts/filter-context";
import { useResult } from "@/features/performance/contexts/result-context";

const ResultHeader = () => {
  const { isOpen, open, close } = useFilter();
  const { sortedPerformances } = useResult();

  const handleClick = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  const buttonStyle =
    "flex justify-center items-center gap-[0.44rem] rounded-button w-[5.26rem] h-[1.75rem] text-[0.77rem]/[1.09rem]";

  return (
    <div className="sticky z-70 top-desktop-header-shrinked border-b border-black/10">
      <div className="bg-white flex justify-between items-center max-w-7xl mx-auto h-[3.56rem] px-7">
        <span className="text-dark text-[0.88rem]/[1.31rem] font-semibold">
          {sortedPerformances.length}개의 클래식 공연
        </span>
        {isOpen ? (
          <button
            className={`${buttonStyle} bg-main text-white`}
            onClick={handleClick}
          >
            <img src={closeIcon} alt="닫기 아이콘" />
            필터 닫기
          </button>
        ) : (
          <button
            className={`${buttonStyle} border border-black/10 bg-white text-dark`}
            onClick={handleClick}
          >
            <img src={filterIcon} alt="필터 아이콘" />
            필터 보기
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultHeader;
