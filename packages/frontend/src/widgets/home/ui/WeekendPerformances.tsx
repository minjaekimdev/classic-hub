import "swiper/css";
import MobileList from "../shared/MobileList";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import HomeSectionLayout from "../shared/HomeSectionLayout";
import BaseCarousel from "../shared/DesktopCarousel";
import HomePerformanceAlbumCard from "@/features/performance/components/desktop/HomePerformanceAlbumCard";
import useWeekendPerformance from "@/features/performance/api/hooks/use-weekend-performance";
import calendarIcon from "@shared/assets/icons/calendar-red.svg";

const WeekendPerformances = () => {
  const performanceArray = useWeekendPerformance();
  const isMobile = useBreakpoint(960);

  const breakpoints = {
    1280: { slidesPerView: 5 },
  };

  return (
    <HomeSectionLayout
      mainTitle="이번 주말에 볼 수 있는 공연"
      subTitle="당신의 주말을 채워줄 공연 리스트"
      headerIcon={calendarIcon}
    >
      {isMobile ? (
        <MobileList performanceArray={performanceArray} />
      ) : (
        <BaseCarousel
          items={performanceArray}
          slidesPerView={4}
          breakpoints={breakpoints}
          renderItem={(performance) => (
            <HomePerformanceAlbumCard data={performance} />
          )}
        />
      )}
    </HomeSectionLayout>
  );
};

export default WeekendPerformances;
