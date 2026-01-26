import HeaderMobile from "./HeaderMobile";
import PosterMobile from "./PosterMobile";
import SummaryMobile from "./SummaryMobile";
import MainDetailMobile from "./MainDetailMobile";
import Modal, { useModal } from "@/shared/ui/modals/Modal";
import { useDetail } from "@/pages/Detail";

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
        <div className="sticky bottom-0 border-t border-[rgba(0,0,0,0.1)] bg-white px-[0.72rem] py-[0.88rem]">
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
