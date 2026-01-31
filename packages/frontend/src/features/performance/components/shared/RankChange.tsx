import rankingDownIcon from "@shared/assets/icons/ranking-down-arrow.svg";
import rankingUpIcon from "@shared/assets/icons/ranking-up-arrow.svg";

const Component = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="shrink-0 flex flex-col items-center gap-[0.22rem]">
      {children}
      <span className="text-[#717182] text-[0.66rem]/[0.88rem] font-normal">
        순위 변동
      </span>
    </div>
  );
};

interface RankChangeProps {
  currentRank: number;
  lastRank: number | null;
}

const RankChange = ({ currentRank, lastRank }: RankChangeProps) => {
  const renderRankChange = () => {
    if (lastRank === null) {
      return (
        <div className="flex justify-center items-center h-5.25 rounded-[0.22rem] bg-[#06f] pl-2 pr-[0.46rem] text-[0.77rem]/[1.31rem] text-white">
          NEW
        </div>
      );
    }
    if (currentRank === lastRank) {
      return (
        <Component>
          <span className="text-[#717182] font-semibold text-[1.13rem]/[1.31rem]">
            -
          </span>
        </Component>
      );
    }

    const isUp = currentRank < lastRank;
    const diff = Math.abs(currentRank - lastRank);

    return (
      <Component>
        <div className="flex items-center gap-[0.22rem]">
          <img
            src={isUp ? rankingUpIcon : rankingDownIcon}
            alt={isUp ? "랭킹 상승" : "랭킹 하락"}
          />
          <span
            className={`text-[0.88rem]/[1.31rem] ${isUp ? "text-[#096]" : "text-main"}  font-semibold`}
          >
            {diff}
          </span>
        </div>
      </Component>
    );
  };
  return <>{renderRankChange()}</>;
};

export default RankChange;