import TicketVendor from "./TicketVendor";
import Modal, { useModal } from "@/shared/ui/modals/Modal";
import type { BookingLink } from "@classic-hub/shared/types/common";
import ModalHeader from "./ModalHeader";

const iconArr = [
  {
    icon: "🎫",
    background: "#2B7FFF",
  },
  {
    icon: "🎭",
    background: "#00C950",
  },
  {
    icon: "🎵",
    background: "#00BC7D",
  },
  {
    icon: "🎪",
    background: "#AD46FF",
  },
  {
    icon: "️🏛️",
    background: "#615FFF",
  },
  {
    icon: "🎨",
    background: "#FF2056",
  },
];

const BookingModal = () => {
  const { isOpen, modalData } = useModal();
  const bookingLinkArray = (modalData as BookingLink[]) || [];

  return (
    <>
      {isOpen && (
        <Modal.Wrapper>
          <div
            className="rounded-main border border-[rgba(0,0,0,0.1)] shadodw-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] bg-white p-[1.38rem] max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-7">
              <ModalHeader
                main="예매처 선택"
                sub="원하시는 예매처를 선택해주세요"
              />
              <div className="grid grid-cols-[repeat(2,minmax(6rem,13.9rem))] gap-[0.66rem]">
                {bookingLinkArray.map((item, index) => {
                  const theme = iconArr[index % iconArr.length];
                  return (
                    <TicketVendor
                      key={item.name}
                      icon={theme.icon}
                      background={theme.background}
                      name={item.name}
                      url={item.url}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </Modal.Wrapper>
      )}
    </>
  );
};

export default BookingModal;
