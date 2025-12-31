import { BookmarkButton, ShareButton } from "../shared/ActionButton";
import locationIcon from "@shared/assets/icons/location-gray2.svg";
import calendarIcon from "@shared/assets/icons/calendar-gray2.svg";
import clockIcon from "@shared/assets/icons/clock-gray2.svg";
import timerIcon from "@shared/assets/icons/timer-gray2.svg";
import { useDetail } from "../../model/useDetail";
import ProgramInfo from "../shared/ProgramInfo";
import { formatDateRange } from "@/shared/utils/formatDateRange";

const PosterSection = () => {
  const { title, artist, posterUrl } = useDetail();
  return (
    <div className="flex flex-col gap-[0.88rem]">
      <div className="flex flex-col gap-[0.44rem]">
        <h1 className="text-dark text-[1.64rem]/[1.97rem] font-bold">
          {title}
        </h1>
        <p className="text-[#717182] text-[0.98rem]/[1.53rem]">{artist}</p>
      </div>
      <div className="rounded-main aspect-10/14 overflow-hidden">
        <img src={posterUrl} alt="" className="w-full h-full" />
      </div>
      <div className="flex gap-[0.44rem]">
        <BookmarkButton />
        <ShareButton />
      </div>
    </div>
  );
};

interface CategoryItem {
  iconSrc?: string;
  title: string;
  content: string;
}
const Category = ({ iconSrc, title, content }: CategoryItem) => {
  return (
    <div className="flex items-center gap-[0.88rem]">
      <div className="shrink-0 flex items-center gap-[0.44rem] w-30">
        {iconSrc && <img src={iconSrc} alt="" className="" />}
        <p className="text-[#717182] text-[0.88rem]/[1.31rem] font-medium">
          {title}
        </p>
      </div>
      <span className="text-dark text-[0.88rem]/[1.31rem]">
        {content}
      </span>
    </div>
  );
};

const Separator = ({ marginY = "0.66rem" }: { marginY?: string }) => {
  return (
    <div
      className="h-px bg-black/10"
      style={{ marginTop: `${marginY}`, marginBottom: `${marginY}` }}
    ></div>
  );
};

const InfoSection = () => {
  const { venue, date, time, runningTime, age, programInfo } = useDetail();

  const categories: CategoryItem[] = [
    {
      iconSrc: locationIcon,
      title: "장소",
      content: venue,
    },
    {
      iconSrc: calendarIcon,
      title: "공연기간",
      content: formatDateRange(date.start, date.end),
    },
    {
      iconSrc: clockIcon,
      title: "공연시간",
      content: time,
    },
    {
      iconSrc: timerIcon,
      title: "관람시간",
      content: runningTime,
    },
    {
      title: "관람연령",
      content: age,
    },
  ];

  return (
    <div className="self-start flex flex-col rounded-main shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] p-[1.31rem]">
      <div className="flex flex-col">
        {categories.map((item, index) => (
          <div key={item.title}>
            <Category
              iconSrc={item.iconSrc}
              title={item.title}
              content={item.content}
            />
            {index < categories.length - 1 && <Separator />}
          </div>
        ))}
      </div>
      <Separator marginY="0.88rem" />
      <ProgramInfo programInfo={programInfo} />
    </div>
  );
};

const SummaryDesktop = () => {
  return (
    <div className="flex gap-7">
      <div className="flex-9">
        <PosterSection />
      </div>
      <div className="flex-14">
        <InfoSection />
      </div>
    </div>
  );
};

export default SummaryDesktop;
