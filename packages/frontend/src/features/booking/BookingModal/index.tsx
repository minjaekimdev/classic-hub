import "@app/styles/main.scss";
import React from "react";
import styles from "./BookingModal.module.scss";
import Modal from "@/shared/ui/Modal";
import ModalHeader from "@/shared/ui/ModalHeader";
import type { TicketVendorInfoType } from "@root-shared/model/booking";
import ModalTicketVendor from "../ModalTicketVendor";

interface BookingModalProps {
  ticketVendorArray: TicketVendorInfoType[];
}

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

const BookingModal: React.FC<BookingModalProps> = ({ ticketVendorArray }) => {
  return (
    <Modal>
      <div className={styles.bookingModal}>
        <ModalHeader main="예매처 선택" sub="원하시는 예매처를 선택해주세요" />
        <div className={styles.bookingModal__vendorWrapper}>
          {ticketVendorArray.map((item, index) => {
            const theme = iconArr[index % iconArr.length];
            return (
              <ModalTicketVendor
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
    </Modal>
  );
};

export default BookingModal;
