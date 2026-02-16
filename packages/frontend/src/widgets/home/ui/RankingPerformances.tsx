import "swiper/css";
import HomeSectionLayout from "../shared/HomeSectionLayout";
import BaseCarousel from "../shared/DesktopCarousel";
import rankingIcon from "@shared/assets/icons/ranking-red.svg";
import HomePerformanceAlbumCard from "@/features/performance/ui/desktop/HomePerformanceAlbumCard";
import { useHomeRankingPerformances } from "@/features/performance/api/hooks/useHomeRankingPerformances";
import { Suspense } from "react";
import { HomePerformanceAlbumCardSkeleton } from "@/features/performance/ui/desktop/HomePerformanceAlbumCardSkeleton";

// const RankingPerformances = () => {
//   const { data: performances } = useHomeRankingPerformances(10);

//   const rankingBreakpoints = {
//     600: { slidesPerView: 3.2 },
//     960: { slidesPerView: 4 },
//     1280: { slidesPerView: 5 },
//   };

//   return (
//     <HomeSectionLayout
//       mainTitle="오늘의 공연 랭킹"
//       subTitle="티켓판매액 기준 인기 공연"
//       headerIcon={rankingIcon}
//     >
//       <BaseCarousel
//         items={performances}
//         slidesPerView={2.2} // 랭킹은 모바일에서 2.2개
//         breakpoints={rankingBreakpoints}
//         renderItem={(performance) => (
//           <HomePerformanceAlbumCard data={performance} />
//         )}
//       />
//     </HomeSectionLayout>
//   );
// };

const RankingContent = ({ limit }: { limit: number }) => {
  const { data: performances } = useHomeRankingPerformances(limit);

  const rankingBreakpoints = {
    600: { slidesPerView: 3.2 },
    960: { slidesPerView: 4 },
    1280: { slidesPerView: 5 },
  };

  return (
    <BaseCarousel
      items={performances}
      slidesPerView={2.2}
      breakpoints={rankingBreakpoints}
      renderItem={(performance) => (
        <HomePerformanceAlbumCard data={performance} />
      )}
    />
  );
};

// 2. 로딩 중에 보여줄 스켈레톤 (Fallback)
const RankingFallback = ({ limit }: { limit: number }) => {
  // 캐러셀 형태를 유지하면서 내부만 스켈레톤으로 채움
  const items = Array.from({ length: limit }, (_, i) => i);
  
  return (
    <BaseCarousel
      items={items}
      slidesPerView={2.2}
      breakpoints={{
        600: { slidesPerView: 3.2 },
        960: { slidesPerView: 4 },
        1280: { slidesPerView: 5 },
      }}
      renderItem={() => <HomePerformanceAlbumCardSkeleton />}
    />
  );
};

export const RankingPerformances = () => {
  const LIMIT = 10;

  return (
    <HomeSectionLayout
      mainTitle="오늘의 공연 랭킹"
      subTitle="티켓판매액 기준 인기 공연"
      headerIcon={rankingIcon}
    >
      {/* 데이터 로딩 전까지 Fallback(스켈레톤)을 보여줌 */}
      <Suspense fallback={<RankingFallback limit={LIMIT} />}>
        <RankingContent limit={LIMIT} />
      </Suspense>
    </HomeSectionLayout>
  );
};

export default RankingPerformances;
