import "swiper/css";
import HomeSectionLayout from "../shared/HomeSectionLayout";
import rankingIcon from "@shared/assets/icons/ranking-red.svg";
import { useHomeRankingPerformances } from "@/features/performance/api/hooks/useHomeRankingPerformances";
import { AsyncCarousel } from "../shared/AsyncCarousel";
import { HomePerformanceRankingCard } from "@/features/performance/ui/desktop/HomePerformanceRankingCard";
import { useNavigate } from "react-router-dom";

const RANKING_BREAKPOINTS = {
  320: { slidesPerView: 2.2, slidesPerGroup: 1, spaceBetween: 20 },
  600: { slidesPerView: 3.2, slidesPerGroup: 1, spaceBetween: 20 },
  960: { slidesPerView: 4, slidesPerGroup: 1, spaceBetween: 20 },
  1280: { slidesPerView: 5, slidesPerGroup: 1, spaceBetween: 20 },
};

export const RankingPerformances = () => {
  const { data, isLoading, isError, refetch } = useHomeRankingPerformances(10);
  const navigate = useNavigate();

  const onFullShowClick = () => {
    navigate("/ranking");
  }

  return (
    <HomeSectionLayout
      mainTitle="오늘의 공연 랭킹"
      subTitle="티켓판매액 기준 인기 공연"
      headerIcon={rankingIcon}
      onFullShowClick={onFullShowClick}
    >
      <AsyncCarousel
        performances={data}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        breakPoints={RANKING_BREAKPOINTS}
        renderItem={(item) => <HomePerformanceRankingCard data={item} />}
      />
    </HomeSectionLayout>
  );
};
