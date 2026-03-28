import DetailImages from "@/features/performance/ui/shared/DetailImages";
import SummaryDesktop from "./DetailTopSectionDesktop";
import PriceInfo from "@/features/performance/ui/shared/DetailPriceInfo";

const DetailDesktop = () => {
  return (
    <div className="flex p-7">
      <div className="flex flex-2 flex-col gap-[1.31rem]">
        <SummaryDesktop />
        <div className="rounded-main bg-white p-7 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <DetailImages />
        </div>
      </div>
      <div className="flex-1 pl-7">
        <PriceInfo />
      </div>
    </div>
  );
};

export default DetailDesktop;
