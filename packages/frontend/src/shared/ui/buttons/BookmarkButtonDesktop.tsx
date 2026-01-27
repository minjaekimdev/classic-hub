import { useState } from "react";
import heartIconActive from "@shared/assets/icons/heart-red.svg";
import heartIconInactive from "@shared/assets/icons/heart-gray.svg";
import { toast } from "sonner";

const BookmarkButtonDesktop = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsBookmarked((prev) => !prev);
    if (isBookmarked) {
      toast("찜한 공연에서 삭제되었습니다.");
    } else {
      toast("찜한 공연에 추가되었습니다.");
    }
  };

  return (
    <button
      className="flex justify-center items-center rounded-full p-[0.44rem] bg-[rgba(255,255,255,0.9)] w-7 h-7 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2),0_2px_4px_-2px_rgba(0,0,0,0.2)] transition hover:scale-110"
      onClick={handleClick}
    >
      {isBookmarked ? (
        <img src={heartIconActive} className="h-4" />
      ) : (
        <img src={heartIconInactive} className="h-4"/>
      )}
    </button>
  );
};

export default BookmarkButtonDesktop;
