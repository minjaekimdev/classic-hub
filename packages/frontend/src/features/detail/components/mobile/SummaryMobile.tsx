import { useDetail } from "@/pages/Detail";
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
  const { title, artist, venue, period, time, runningTime } = useDetail();
  return (
    <div className="flex flex-col gap-[0.81rem] p-[1.09rem]">
      <div className="flex flex-col gap-[0.22rem]">
        <h1 className="text-dark text-[1.09rem]/[1.53rem] font-semibold">
          {title}
        </h1>
        <p className="text-[#4a5565] text-[0.77rem]/[1.09rem]">{artist}</p>
      </div>
      <ul className="flex flex-col gap-[0.41rem]">
        <InfoRow label="장소" description={venue} />
        <InfoRow label="기간" description={period} />
        <InfoRow label="공연시간" description={time} />
        <InfoRow label="관람시간" description={runningTime} />
      </ul>
      <div className="flex gap-[0.66rem]">
        <BookmarkButton />
        <ShareButton />
      </div>
    </div>
  );
};

export default SummaryMobile;
