import "swiper/css";
import HomeSectionLayout from "../shared/HomeSectionLayout";
import rankingIcon from "@shared/assets/icons/ranking-red.svg";
import { useHomeRankingPerformances } from "@/features/performance/api/hooks/useHomeRankingPerformances";
import { DesktopCarousel } from "../shared/DesktopCarousel";
import { HomePerformanceAlbumCardSkeleton } from "@/features/performance/ui/desktop/HomePerformanceAlbumCardSkeleton";
import { HomePerformanceAlbumCard } from "@/features/performance/ui/desktop/HomePerformanceAlbumCard";
import type { PerformanceSummary } from "@classic-hub/shared/types/client";

const RANKING_BREAKPOINTS = {
  600: { slidesPerView: 3.2 },
  960: { slidesPerView: 4 },
  1280: { slidesPerView: 5 },
};

export const RankingPerformances = () => {
  const {
    data: performances,
    isLoading,
    isError,
  } = useHomeRankingPerformances(10);

  const skeletonItems = Array.from({length: 10}, (_, index) => ({
    id: `skeleton-${index}`,
  }));

  return (
    <HomeSectionLayout
      mainTitle="오늘의 공연 랭킹"
      subTitle="티켓판매액 기준 인기 공연"
      headerIcon={rankingIcon}
    >
      {isLoading ? (
        <DesktopCarousel
          items={skeletonItems as unknown as PerformanceSummary[]}
          slidesPerView={2.2} // 랭킹은 모바일에서 2.2개
          breakpoints={RANKING_BREAKPOINTS}
          renderItem={() => <HomePerformanceAlbumCardSkeleton />}
        />
      ) : isError ? (
        <div className="w-full h-40 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
          랭킹 정보를 불러오지 못했습니다.
        </div>
      ) : (
        <DesktopCarousel
          items={performances ?? []}
          slidesPerView={2.2}
          breakpoints={RANKING_BREAKPOINTS}
          renderItem={(performance) => (
            <HomePerformanceAlbumCard data={performance} />
          )}
        />
      )}
    </HomeSectionLayout>
  );
};
