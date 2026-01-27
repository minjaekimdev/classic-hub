import heartEmpty from "@shared/assets/icons/heart-black.svg";
import heartFull from "@shared/assets/icons/heart-red.svg";
import shareIcon from "@shared/assets/icons/share-black.svg";
import { useState } from "react";
import { toast } from "sonner";

interface ButtonProps {
  children: React.ReactNode;
  handler: () => void;
}
const ActionButton = ({ children, handler }: ButtonProps) => {
  return (
    <button
      className="flex-1 flex justify-center border border-[rgba(0,0,0,0.1)] rounded-main pt-[0.58rem] pb-[0.48rem] desktop:pt-[0.36rem] desktop:pb-[0.27rem]"
      onClick={handler}
    >
      <div className="flex items-center gap-[0.44rem] desktop:gap-[0.7rem] text-dark text-[0.77rem]/[1.09rem]">
        {children}
      </div>
    </button>
  );
};

export const BookmarkButton = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handler = () => {
    if (isBookmarked) {
      toast("찜한 공연에서 삭제되었습니다.");
    } else {
      toast("찜한 공연에 추가되었습니다.");
    }
    setIsBookmarked((prev) => !prev);
  };

  return (
    <ActionButton handler={handler}>
      {!isBookmarked ? (
        <>
          <img src={heartEmpty} alt="찜하기" className="w-3.5 h-3.5" />
          찜하기
        </>
      ) : (
        <>
          <img src={heartFull} alt="찜하기 취소" className="w-3.5 h-3.5" />
          찜하기 취소
        </>
      )}
    </ActionButton>
  );
};

export const ShareButton = () => {
  const handler = async () => {
    const currentUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success("링크가 복사되었습니다.", {id: "copy-success"});
    } catch (error) {
      console.error("클립보드 복사 실패", error);
      toast.error("링크 복사에 실패했습니다.", {id: "copy-fail"});
    }
  };

  return (
    <ActionButton handler={handler}>
      <img src={shareIcon} alt="공유하기" className="w-3.5 h-3.5" />
      공유하기
    </ActionButton>
  );
};
