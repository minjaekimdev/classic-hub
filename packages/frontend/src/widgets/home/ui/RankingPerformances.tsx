import "swiper/css";
import useRankingPerformance from "../../../features/performance/api/hooks/use-home-ranking-performance";
import HomeSectionLayout from "../shared/HomeSectionLayout";
import BaseCarousel from "../shared/DesktopCarousel";
import HomePerformanceAlbumCard from "@/features/performance/components/desktop/HomePerformanceAlbumCard";
import rankingIcon from "@shared/assets/icons/ranking-red.svg";

const RankingPerformances = () => {
  const performanceArray = useRankingPerformance(10);

  const rankingBreakpoints = {
    600: { slidesPerView: 3.2 },
    960: { slidesPerView: 4 },
    1280: { slidesPerView: 5 },
  };

  return (
    <HomeSectionLayout
      mainTitle="오늘의 공연 랭킹"
      subTitle="티켓판매액 기준 인기 공연"
      headerIcon={rankingIcon}
    >
      <BaseCarousel
        items={performanceArray}
        slidesPerView={2.2} // 랭킹은 모바일에서 2.2개
        breakpoints={rankingBreakpoints}
        renderItem={(performance) => (
          <HomePerformanceAlbumCard data={performance} />
        )}
      />
    </HomeSectionLayout>
  );
};

export default RankingPerformances;
