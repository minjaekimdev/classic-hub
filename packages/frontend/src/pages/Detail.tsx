import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import type { DetailPerformance } from "@classic-hub/shared/types/client";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import DetailMobile from "@/widgets/detail/mobile";
import DetailDesktop from "@/widgets/detail/desktop";
import { Toaster } from "sonner";
import getPerformanceDetail from "@/features/performance/api/fetchers/get-performance-detail";
import { BREAKPOINTS } from "@/shared/constants";
import LayoutDesktop from "@/layout/desktop/LayoutDesktop";
import { DetailContext } from "@/features/performance/contexts/detail-context";
import { ModalProvider } from "@/app/providers/modal/ModalProvider";
import { useEffect } from "react";
import { usePostHog } from "@posthog/react";

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { performanceId } = params;

  const performance = await getPerformanceDetail(
    performanceId as unknown as string,
  );

  return performance;
};

export const Detail = () => {
  const performance = useLoaderData() as DetailPerformance;
  const posthog = usePostHog();

  const isMobile = useBreakpoint(BREAKPOINTS.TABLET);

  useEffect(() => {
    posthog.capture("performance_detail_viewed", {
      performance_id: performance.id,
      performance_title: performance.title,
      performance_artist: performance.artist,
      performance_venue: performance.venue,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [performance.id]);

  return (
    <DetailContext.Provider value={performance}>
      <ModalProvider>
        <Toaster />
        {isMobile ? (
          <DetailMobile />
        ) : (
          <LayoutDesktop variant="main">
            <LayoutDesktop.Wrapper hasPaddingTop={true}>
              <DetailDesktop />
            </LayoutDesktop.Wrapper>
          </LayoutDesktop>
        )}
      </ModalProvider>
    </DetailContext.Provider>
  );
};
