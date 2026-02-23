import "swiper/css";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import HomeSectionLayout from "../shared/HomeSectionLayout";
import calendarIcon from "@shared/assets/icons/calendar-red.svg";
import { BREAKPOINTS } from "@/shared/constants";
import { HomePerformanceAlbumCard } from "@/features/performance/ui/desktop/HomePerformanceAlbumCard";
import { useWeekendPerformances } from "@/features/performance/api/hooks/useWeekendPerformances";
import { AsyncCarousel } from "../shared/AsyncCarousel";
import { MobileList } from "../shared/MobileList";

const WEEKEND_BREAKPOINTS = {
  1280: { slidesPerView: 5 },
};

export const WeekendPerformances = () => {
  const { data, isLoading, isError, refetch } = useWeekendPerformances();
  const isMobile = useBreakpoint(BREAKPOINTS.TABLET);

  return (
    <HomeSectionLayout
      mainTitle="이번 주말에 볼 수 있는 공연"
      subTitle="당신의 주말을 채워줄 공연 리스트"
      headerIcon={calendarIcon}
    >
      {isMobile ? (
        <MobileList
          performances={data}
          isLoading={isLoading}
          isError={isError}
          refetch={refetch}
        />
      ) : (
        <AsyncCarousel
          performances={data}
          isLoading={isLoading}
          isError={isError}
          refetch={refetch}
          breakPoints={WEEKEND_BREAKPOINTS}
          renderItem={(performance) => (
            <HomePerformanceAlbumCard data={performance} />
          )}
        />
      )}
    </HomeSectionLayout>
  );
};
