import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import getPerformance from "@/features/detail/fetchers/getPerformance";
import type { DetailPerformance } from "@classic-hub/shared/types/client";
import { createContext, useContext } from "react";
import Modal from "@/shared/ui/modals/Modal";
import BookingModal from "@/shared/ui/modals/BookingModal";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import DetailMobile from "@/features/detail/components/mobile/DetailMobile";
import DetailDesktop from "@/features/detail/components/desktop/DetailDesktop";
import MainLayout from "@/layout/shared/MainLayout";
import { Toaster } from "sonner";

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

  const performance = await getPerformance(performanceId as unknown as string);

  return performance;
};

export const Detail = () => {
  const performance = useLoaderData() as DetailPerformance;

  const isMobile = useBreakpoint(960);

  return (
    <DetailContext value={performance}>
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
    </DetailContext>
  );
};
