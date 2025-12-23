import HomeWidgetHeader from "@/shared/layout/HomeWidgetHeader";
import calendarIcon from "@shared/assets/icons/calendar-red.svg";
import HomePerformanceAlbumItem from "@/features/performance/components/AlbumItem";
import ListItem from "./ListItem";
import type { HomePerformance } from "@classic-hub/shared/types/performance";
import rightArrow from "@shared/assets/icons/right-arrow-black.svg";

interface WeekendPerformancesProps {
  performanceArray: HomePerformance[];
}

const WeekendPerformances = ({
  performanceArray,
}: WeekendPerformancesProps) => {
  return (
    <div className="mt-14 w-full">
      <div className="flex flex-col items-center gap-[1.31rem] mx-auto max-w-7xl">
        <HomeWidgetHeader
          icon={calendarIcon}
          mainTitle="이번 주말에 볼 수 있는 공연"
          subTitle="당신의 주말을 채워줄 공연 리스트"
        />
        <ul className="relative hidden desktop:grid grid-cols-4 large-desktop:grid-cols-5 gap-[1.31rem] w-full">
          {performanceArray.map((performance) => (
            <HomePerformanceAlbumItem
              key={performance.title}
              data={performance}
            />
          ))}
          <button className="absolute z-10 top-[50%] right-0 w-13 h-13 flex justify-center items-center border border-[rgba(0,0,0,0.1)] rounded-full bg-[rgba(255,255,255,0.9)] shadow-[0_0_8px_0_rgba(0, 0, 0, 0.13)] translate-y-[-50%] translate-x-[50%]">
            <img src={rightArrow} alt="" />
          </button>
        </ul>
        <ul className="flex desktop:hidden flex-col gap-[0.88rem] w-full">
          {performanceArray.map((performance) => (
            <ListItem key={performance.title} data={performance} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WeekendPerformances;
