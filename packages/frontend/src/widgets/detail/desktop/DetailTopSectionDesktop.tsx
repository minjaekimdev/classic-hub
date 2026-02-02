import DetailMainInfo from "@/entities/performance/ui/desktop/DetailMainInfoDesktop";
import DetailPoster from "@/entities/performance/ui/desktop/DetailPosterDesktop";

const SummaryDesktop = () => {
  return (
    <div className="flex gap-7">
      <div className="flex-9">
        <DetailPoster />
      </div>
      <div className="flex-14">
        <DetailMainInfo />
      </div>
    </div>
  );
};

export default SummaryDesktop;
