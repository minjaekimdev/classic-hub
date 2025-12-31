import heartEmpty from "@shared/assets/icons/heart-black.svg";
import heartFull from "@shared/assets/icons/heart-red.svg";
import shareIcon from "@shared/assets/icons/share-black.svg";
import { useState } from "react";

interface ButtonProps {
  children: React.ReactNode;
  handler: () => void;
}
const ActionButton = ({ children, handler }: ButtonProps) => {
  return (
    <button
      className="flex-1 flex justify-center border border-[rgba(0,0,0,0.1)] rounded-main pt-[0.58rem] pb-[0.48rem] desktop:pt-[0.36rem] desktop:pb-[0.27rem]"
      onClick={() => handler()}
    >
      <div className="flex items-center gap-[0.44rem] desktop:gap-[0.7rem] text-dark text-[0.77rem]/[1.09rem]">
        {children}
      </div>
    </button>
  );
};

const BookmarkButton = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const bookmarkToggle = () => {
    setIsBookmarked((prev) => !prev);
  };

  return (
    <ActionButton handler={bookmarkToggle}>
      {isBookmarked ? (
        <img src={heartEmpty} alt="찜하기" className="w-3.5 h-3.5" />
      ) : (
        <img src={heartFull} alt="찜하기 취소" className="w-3.5 h-3.5" />
      )}
      찜하기
    </ActionButton>
  );
};

const ShareButton = () => {
  const handler = () => {};

  return (
    <ActionButton handler={handler}>
      <img src={shareIcon} alt="공유하기" className="w-3.5 h-3.5" />
      공유하기
    </ActionButton>
  );
};

export { BookmarkButton, ShareButton };
