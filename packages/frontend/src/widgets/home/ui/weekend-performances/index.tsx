import "swiper/css";
import MobileList from "../../shared/MobileList";
import useWeekendPerformance from "@/features/performance/hooks/useWeekendPerformance";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import HomeSectionLayout from "../../shared/HomeSectionLayout";
import BaseCarousel from "../../shared/DesktopCarousel";
import HomePerformanceAlbumCard from "@/features/performance/components/HomePerformanceAlbumCard";

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
