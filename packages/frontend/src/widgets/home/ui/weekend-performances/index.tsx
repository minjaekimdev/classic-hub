import "swiper/css";
import DesktopCarousel from "../../shared/DesktopCarousel";
import MobileList from "../../shared/MobileList";
import useWeekendPerformance from "@/features/performance/hooks/useWeekendPerformance";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import HomeSectionLayout from "../../shared/HomeSectionLayout";

const WeekendPerformances = () => {
  const performanceArray = useWeekendPerformance();
  const isMobile = useBreakpoint(960);

  return (
    <HomeSectionLayout
      mainTitle="이번 주말에 볼 수 있는 공연"
      subTitle="당신의 주말을 채워줄 공연 리스트"
    >
      {isMobile ? (
        <MobileList performanceArray={performanceArray} />
      ) : (
        <DesktopCarousel performanceArray={performanceArray} />
      )}
    </HomeSectionLayout>
  );
};

export default WeekendPerformances;
