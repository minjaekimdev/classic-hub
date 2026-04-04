import "swiper/css";
import HomeSectionLayout from "../shared/HomeSectionLayout";
import calendarIcon from "@shared/assets/icons/calendar-red.svg";
import { HomePerformanceAlbumCard } from "@/features/performance/ui/desktop/HomePerformanceAlbumCard";
import { useWeekendPerformances } from "@/features/performance/api/hooks/useWeekendPerformances";
import { AsyncCarousel } from "../shared/AsyncCarousel";
import { useNavigate } from "react-router-dom";
import getWeekendDate from "@/shared/utils/getWeekendDate";

const WEEKEND_BREAKPOINTS = {
  320: { slidesPerView: 2.2, slidesPerGroup: 2, spaceBetween: 20 },
  600: { slidesPerView: 3.2, slidesPerGroup: 3, spaceBetween: 20 },
  960: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 20 },
  1280: { slidesPerView: 5, slidesPerGroup: 5, spaceBetween: 20 },
};

export const WeekendPerformances = () => {
  const { data, isLoading, isError, refetch } = useWeekendPerformances();
  const navigate = useNavigate();

  const onFullShowClick = () => {
    const { startDate, endDate } = getWeekendDate();
    navigate(
      `/result/?startDate=${startDate.format("YYYYMMDD")}&endDate=${endDate.format("YYYYMMDD")}`,
    );
  };

  return (
    <HomeSectionLayout
      mainTitle="이번 주말에 볼 수 있는 공연"
      subTitle="당신의 주말을 채워줄 공연 리스트"
      headerIcon={calendarIcon}
      onFullShowClick={onFullShowClick}
    >
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
    </HomeSectionLayout>
  );
};
