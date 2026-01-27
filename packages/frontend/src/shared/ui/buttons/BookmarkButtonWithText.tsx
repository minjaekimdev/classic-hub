import { useState } from "react";
import { toast } from "sonner";
import heartInActive from "@shared/assets/icons/heart-black.svg";
import heartActive from "@shared/assets/icons/heart-red.svg";
import ActionButton from "./ButtonWithText";

export const BookmarkButtonWithText = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handler = () => {
    if (isBookmarked) {
      setIsBookmarked(false);
      toast("찜한 공연에서 삭제되었습니다.");
    } else {
      setIsBookmarked(true);
      toast("찜한 공연에 추가되었습니다.");
    }
  };

  return (
    <ActionButton handler={handler}>
      {!isBookmarked ? (
        <>
          <img src={heartInActive} alt="찜하기" className="w-3.5 h-3.5" />
          찜하기
        </>
      ) : (
        <>
          <img src={heartActive} alt="찜하기 취소" className="w-3.5 h-3.5" />
          찜하기 취소
        </>
      )}
    </ActionButton>
  );
};

export default BookmarkButtonWithText;
