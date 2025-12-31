import { useDetail } from "@features/detail/model/useDetail";
import { BookmarkButton, ShareButton } from "../shared/ActionButton";

interface InfoRowProps {
  label: string;
  description: string;
}
const InfoRow = ({ label, description }: InfoRowProps) => {
  return (
    <li className="flex items-center gap-[1.19rem]">
      <span className="text-[#4a5565] text-[0.77rem]/[1.09rem]">{label}</span>
      <span className="text-dark text-[0.77rem]/[1.09rem]">{description}</span>
    </li>
  );
};

const SummaryMobile = () => {
  const performance = useDetail();
  if (!performance) {
    throw new Error("useDetailContext must be used within a DetailProvider");
  }
  return (
    <div className="flex flex-col gap-[0.81rem] p-[1.09rem]">
      <div className="flex flex-col gap-[0.22rem]">
        <h1 className="text-dark text-[1.09rem]/[1.53rem] font-semibold">
          {performance.title}
        </h1>
        <p className="text-[#4a5565] text-[0.77rem]/[1.09rem]">
          {performance.artist}
        </p>
      </div>
      <ul className="flex flex-col gap-[0.41rem]">
        <InfoRow label="장소" description={performance.venue} />
        <InfoRow
          label="기간"
          description={`${performance.date.start} ~ ${performance.date.end}`}
        />
        <InfoRow label="공연시간" description={performance.time} />
        <InfoRow label="관람시간" description={performance.runningTime} />
      </ul>
      <div className="flex gap-[0.66rem]">
        <BookmarkButton />
        <ShareButton />
      </div>
    </div>
  );
};

export default SummaryMobile;
