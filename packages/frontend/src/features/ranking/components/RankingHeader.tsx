import React, { useState, type SetStateAction } from "react";
import rankingIcon from "@shared/assets/icons/ranking-white.svg";

interface ToggleButtonProps {
  text: string;
  selected: string;
  onClick: React.Dispatch<SetStateAction<string>>;
}

const ToggleButton = ({ text, selected, onClick }: ToggleButtonProps) => {
  return (
    <button
      className={`px-[0.44rem] py-[0.22rem] rounded-full ${
        selected === text ? "bg-main text-white" : "bg-transparent text-[#0a0a0a]"
      }`}
      onClick={() => onClick(text)}
    >
      <span className="text-[0.77rem]/[1.09rem] font-medium">{text}</span>
    </button>
  );
};

const PeriodToggle = () => {
  const [selected, setSelected] = useState("일간");
  return (
    <div className="flex bg-[#ececf0] p-[0.22rem] rounded-[0.8rem]">
      <ToggleButton text="일간" selected={selected} onClick={setSelected} />
      <ToggleButton text="주간" selected={selected} onClick={setSelected} />
      <ToggleButton text="월간" selected={selected} onClick={setSelected} />
    </div>
  );
};

const RankingHeader = () => {
  return (
    <div className="flex items-center gap-[0.66rem]">
      <div className="flex justify-center items-center bg-main rounded-[0.55rem] w-[3.06rem] h-[3.06rem]">
        <img src={rankingIcon} alt="" />
      </div>
      <div className="grow flex flex-col">
        <h1 className="text-[#101828] text-[1.64rem]/[1.97rem] font-bold">
          클래식 공연 랭킹
        </h1>
        <span className="text-[#717182] text-[0.88rem]/[1.31rem]">
          티켓판매액을 기반으로 한 공연 순위 (Top 50)
        </span>
      </div>
      <PeriodToggle />
    </div>
  );
};

export default RankingHeader;
