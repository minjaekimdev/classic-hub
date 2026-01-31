import crownIcon from "@shared/assets/icons/crown-gold.svg";
import medalIcon from "@shared/assets/icons/medal-silver.svg";
import badgeIcon from "@shared/assets/icons/badge-bronze.svg";

export const First = () => {
  return (
    <div className="shrink-0 w-[2.19rem] h-[2.19rem] flex justify-center items-center rounded-full bg-[linear-gradient(135deg,#FDC700_0%,#F0B100_50%,#D08700_100%)] shadow-[0_0_0_2px_rgba(253,199,0,0.30),0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]">
      <img src={crownIcon} alt="1위" />
    </div>
  );
};

export const Second = () => {
  return (
    <div className="shrink-0 w-[2.19rem] h-[2.19rem] flex justify-center items-center rounded-full bg-[linear-gradient(135deg,#CAD5E2_0%,#90A1B9_50%,#62748E_100%)] shadow-[0_0_0_2px_rgba(202,213,226,0.30),0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]">
      <img src={medalIcon} alt="2위" />
    </div>
  );
};

export const Third = () => {
  return (
    <div className="shrink-0 w-[2.19rem] h-[2.19rem] flex justify-center items-center rounded-full bg-[linear-gradient(135deg,#FE9A00_0%,#E17100_50%,#BB4D00_100%)] shadow-[0_0_0_2px_rgba(254,154,0,0.30),0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]">
      <img src={badgeIcon} alt="3위" />
    </div>
  );
};

export const Other = ({ rank }: { rank: number }) => {
  return (
    <div className="shrink-0 w-[2.19rem] h-[2.19rem] flex justify-center items-center rounded-full bg-[linear-gradient(135deg,#f1f5f9_0%,#e2e8f0_100%)] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <span className="text-[#717182] text-[0.98rem]/[1.53rem] font-semibold">
        {rank}
      </span>
    </div>
  );
};
