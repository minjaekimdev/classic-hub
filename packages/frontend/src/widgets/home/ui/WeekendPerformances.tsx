import "swiper/css";
import MobileList from "../shared/MobileList";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import HomeSectionLayout from "../shared/HomeSectionLayout";
import calendarIcon from "@shared/assets/icons/calendar-red.svg";
import useWeekendPerformance from "@/features/performance/api/hooks/use-weekend-performance";
import { BREAKPOINTS } from "@/shared/constants";
import { DesktopCarousel } from "../shared/DesktopCarousel";
import { HomePerformanceAlbumCard } from "@/features/performance/ui/desktop/HomePerformanceAlbumCard";

const WEEKEND_BREAKPOINTS = {
  1280: { slidesPerView: 5 },
};

export const WeekendPerformances = () => {
  const performanceArray = useWeekendPerformance();
  const isMobile = useBreakpoint(BREAKPOINTS.TABLET);

  return (
    <HomeSectionLayout
      mainTitle="이번 주말에 볼 수 있는 공연"
      subTitle="당신의 주말을 채워줄 공연 리스트"
      headerIcon={calendarIcon}
    >
      {isMobile ? (
        <MobileList performanceArray={performanceArray} />
      ) : (
        <DesktopCarousel
          items={performanceArray}
          slidesPerView={4}
          breakpoints={WEEKEND_BREAKPOINTS}
          renderItem={(performance) => (
            <HomePerformanceAlbumCard data={performance} />
          )}
        />
      )}
    </HomeSectionLayout>
  );
};
