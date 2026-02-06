import React from "react";
import alertIcon from "@shared/assets/icons/alert.svg";
import ButtonGroup from "@/shared/ui/buttons/CancelConfirmButtons";
import Modal from "@/shared/ui/modal/Modal";

interface BookmarkDeleteModalProps {
  title: string;
}

const BookmarkDeleteModal: React.FC<BookmarkDeleteModalProps> = ({ title }) => {
  return (
    <Modal>
      <div className="flex flex-col">
        <div className="flex items-center gap-[0.66rem]">
          <img
            className="flex justify-center items-center rounded-full p-[0.66rem] bg-[#ffe2e2]"
            src={alertIcon}
            alt=""
          />
          <h3 className="text-dark text-[1.09rem]/[1.53rem] font-semibold">
            찜 목록에서 삭제하시겠습니까?
          </h3>
        </div>
        <p className="mt-[1.32rem] min-h-[2.62rem]">
          <span className="text-dark text-[0.88rem]/[1.31rem] font-medium">
            "{title}"
          </span>
          <span className="text-[#717182] text-[0.88rem]/[1.31rem]">
            을(를) 찜한 공연 목록에서 삭제합니다.
          </span>
        </p>
        <ButtonGroup mainText="삭제" />
      </div>
    </Modal>
  );
};

export default BookmarkDeleteModal;
