import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import type { DetailPerformance } from "@classic-hub/shared/types/client";
import { createContext, useContext } from "react";
import Modal from "@/shared/ui/modal/Modal";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import DetailMobile from "@/widgets/detail/mobile";
import DetailDesktop from "@/widgets/detail/desktop";
import MainLayout from "@/layout/shared/MainLayout";
import { Toaster } from "sonner";
import getPerformanceDetail from "@/entities/performance/api/fetchers/get-performance-detail";
import BookingModal from "@/features/booking/BookingModal";
import { BREAKPOINTS } from "@/shared/constants";

const DetailContext = createContext<DetailPerformance | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useDetail = () => {
  const context = useContext(DetailContext);

  if (!context) {
    throw new Error("useDetail must be used within a DetailContext.Provider");
  }

  return context;
};

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

  const isMobile = useBreakpoint(BREAKPOINTS.TABLET);

  return (
    <DetailContext.Provider value={performance}>
      <Toaster />
      <Modal>
        <BookingModal />
        {isMobile ? (
          <DetailMobile />
        ) : (
          <MainLayout>
            <Toaster />
            <DetailDesktop />
          </MainLayout>
        )}
      </Modal>
    </DetailContext.Provider>
  );
};
