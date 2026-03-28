import filterIcon from "@shared/assets/icons/filter-dark.svg";
import closeIcon from "@shared/assets/icons/close-white.svg";
import { useFilter } from "@/features/filter/contexts/filter-context";

const ResultHeader = () => {
  const { isOpen, open, close, filteredPerformances } = useFilter();

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
    <div className="top-desktop-header-shrinked sticky z-70 border-b border-black/10">
      <div className="mx-auto flex h-[3.56rem] max-w-7xl items-center justify-between bg-white px-7">
        <span className="text-dark text-[0.88rem]/[1.31rem] font-semibold">
          {filteredPerformances.length}개의 클래식 공연
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
            className={`${buttonStyle} text-dark border border-black/10 bg-white`}
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
