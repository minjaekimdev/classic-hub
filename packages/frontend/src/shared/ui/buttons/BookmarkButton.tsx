import { useState } from "react";
import heartIconActive from "@shared/assets/icons/heart-red.svg";
import heartIconInactive from "@shared/assets/icons/heart-gray.svg";

interface BookmarkProps {
  className?: string;
}

const BookmarkButton = ({ className }: BookmarkProps) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <button
      className={`absolute z-10 flex justify-center items-center rounded-full p-[0.44rem] bg-[rgba(255,255,255,0.9)] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2),0_2px_4px_-2px_rgba(0,0,0,0.2)] transition hover:scale-110 ${className || ""}`}
      onClick={() => setIsActive((prev) => !prev)}
    >
      {isActive ? (
        <img src={heartIconActive} />
      ) : (
        <img src={heartIconInactive} />
      )} 
    </button>
  );
};

export default BookmarkButton;
