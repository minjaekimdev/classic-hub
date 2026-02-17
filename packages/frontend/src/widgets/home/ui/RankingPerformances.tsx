import "swiper/css";
import HomeSectionLayout from "../shared/HomeSectionLayout";
import rankingIcon from "@shared/assets/icons/ranking-red.svg";
import { useHomeRankingPerformances } from "@/features/performance/api/hooks/useHomeRankingPerformances";
import { AsyncCarousel } from "../shared/AsyncCarousel";
import { HomePerformanceRankingCard } from "@/features/performance/ui/desktop/HomePerformanceRankingCard";

const RANKING_BREAKPOINTS = {
  600: { slidesPerView: 3.2 },
  960: { slidesPerView: 4 },
  1280: { slidesPerView: 5 },
};

export const RankingPerformances = () => {
  const { data, isLoading, isError } = useHomeRankingPerformances(10);

  return (
    <HomeSectionLayout
      mainTitle="오늘의 공연 랭킹"
      subTitle="티켓판매액 기준 인기 공연"
      headerIcon={rankingIcon}
    >
      <AsyncCarousel
        performances={data}
        isLoading={isLoading}
        isError={isError}
        breakPoints={RANKING_BREAKPOINTS}
        renderItem={(item) => <HomePerformanceRankingCard data={item} />}
      />
    </HomeSectionLayout>
  );
};
