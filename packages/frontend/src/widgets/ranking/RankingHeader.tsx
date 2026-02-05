import rankingIcon from "@shared/assets/icons/ranking-white.svg";
import type { Period } from "@classic-hub/shared/types/client";
import { PERIOD_LABEL } from "@/features/performance/constants/ranking-period-label";

interface ToggleButtonProps {
  text: Period;
  selected: Period;
  onClick: (period: Period) => void;
}

const ToggleButton = ({ text, selected, onClick }: ToggleButtonProps) => {
  return (
    <button
      className={`px-[0.44rem] py-[0.22rem] rounded-full ${
        selected === text ? "bg-main text-white" : "bg-transparent text-dark"
      }`}
      onClick={() => onClick(text)}
    >
      <span className="text-[0.77rem]/[1.09rem] font-medium">
        {PERIOD_LABEL[text]}
      </span>
    </button>
  );
};

interface RankingHeaderProps {
  period: Period;
  onToggle: (period: Period) => void;
}

const RankingHeader = ({ period, onToggle }: RankingHeaderProps) => {
  return (
    <div className="flex flex-col tablet:flex-row items-center gap-[0.66rem]">
      <div className="flex justify-center items-center bg-main rounded-main w-[3.06rem] h-[3.06rem]">
        <img src={rankingIcon} alt="" />
      </div>
      <div className="grow flex flex-col items-center tablet:items-start">
        <h1 className="text-[#101828] text-[1.64rem]/[1.97rem] font-bold">
          클래식 공연 랭킹
        </h1>
        <span className="text-[#717182] text-[0.88rem]/[1.31rem]">
          티켓판매액을 기반으로 한 공연 순위 (Top 50)
        </span>
      </div>
      <div className="flex bg-[#ececf0] p-[0.22rem] rounded-[0.8rem]">
        <ToggleButton text="daily" selected={period} onClick={onToggle} />
        <ToggleButton text="weekly" selected={period} onClick={onToggle} />
        <ToggleButton text="monthly" selected={period} onClick={onToggle} />
      </div>
    </div>
  );
};

export default RankingHeader;
