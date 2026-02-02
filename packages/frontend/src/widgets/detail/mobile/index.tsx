import HeaderMobile from "./HeaderMobile";
import MainDetailMobile from "./MainDetailMobile";
import Modal, { useModal } from "@/shared/ui/modal/Modal";
import { useDetail } from "@/pages/Detail";
import PosterMobile from "@/entities/performance/ui/mobile/DetailPosterMobile";
import SummaryMobile from "@/entities/performance/ui/mobile/DetailSummaryMobile";

const DetailMobile = () => {
  const { bookingLinks } = useDetail();
  const { sendData } = useModal();

  return (
    <div className="flex flex-col">
      <HeaderMobile />
      <PosterMobile />
      <SummaryMobile />
      <MainDetailMobile />
      <Modal.Trigger>
        <div className="fixed bottom-0 border-t border-[rgba(0,0,0,0.1)] bg-white px-[0.72rem] py-[0.88rem] w-full">
          <button
            className="flex justify-center items-center rounded-main bg-main w-full h-[2.63rem] text-white text-[0.77rem]/[1.09rem]"
            onClick={() => sendData(bookingLinks)}
          >
            예매하기
          </button>
        </div>
      </Modal.Trigger>
    </div>
  );
};

export default DetailMobile;
