import HeaderMobile from "./HeaderMobile";
import MainDetailMobile from "./MainDetailMobile";
import PosterMobile from "@/features/performance/ui/mobile/DetailPosterMobile";
import SummaryMobile from "@/features/performance/ui/mobile/DetailSummaryMobile";
import { useDetail } from "@/features/performance/contexts/detail-context";
import { ModalProvider } from "@/app/providers/modal/ModalProvider";
import { useModal } from "@/app/providers/modal/useModal";

const DetailMobile = () => {
  const { bookingLinks } = useDetail();
  const { openModal } = useModal();

  return (
    <ModalProvider>
      <div className="flex flex-col pb-20">
        <HeaderMobile />
        <PosterMobile />
        <SummaryMobile />
        <MainDetailMobile />
        <div className="py-088 fixed bottom-0 w-full border-t border-[rgba(0,0,0,0.1)] bg-white px-[0.72rem]">
          <button
            className="rounded-main bg-main flex h-[2.63rem] w-full items-center justify-center text-[0.77rem]/[1.09rem] text-white"
            onClick={() => openModal("BOOKING", { bookingLinks })}
          >
            예매하기
          </button>
        </div>
      </div>
    </ModalProvider>
  );
};

export default DetailMobile;
