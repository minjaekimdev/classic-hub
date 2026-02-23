import { HomePerformanceAlbumCardSkeleton } from "@/features/performance/ui/desktop/HomePerformanceAlbumCardSkeleton";
import { DesktopCarousel } from "./DesktopCarousel";
import { ErrorMessageWithRefetch } from "@/shared/ui/fallback/ErrorMessage";
import type { QueryObserverResult } from "@tanstack/react-query";

export interface BaseItem {
  id: string;
}

interface AsyncCarousel<T> {
  performances: T[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<QueryObserverResult>;
  breakPoints: Record<number, { slidesPerView: number }>;
  renderItem: (item: T) => React.ReactNode;
}
export const AsyncCarousel = <T extends BaseItem>({
  performances,
  isLoading,
  isError,
  refetch,
  breakPoints,
  renderItem,
}: AsyncCarousel<T>) => {
  const skeletonItems = Array.from({ length: 5 }, (_, index) => ({
    id: `skeleton-${index}`,
  }));

  if (isLoading) {
    return (
      <DesktopCarousel
        items={skeletonItems}
        slidesPerView={2.2} // 랭킹은 모바일에서 2.2개
        breakpoints={breakPoints}
        renderItem={() => <HomePerformanceAlbumCardSkeleton />}
      />
    );
  }
  if (isError) return <ErrorMessageWithRefetch refetch={refetch} />;

  return (
    <DesktopCarousel
      items={performances as T[]}
      slidesPerView={2.2}
      breakpoints={breakPoints}
      renderItem={renderItem}
    />
  );
};
