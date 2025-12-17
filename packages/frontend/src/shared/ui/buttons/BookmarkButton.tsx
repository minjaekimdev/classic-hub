import React, { useState, type CSSProperties } from "react";
import heartIconActive from "@shared/assets/icons/heart-red.svg";
import heartIconInactive from "@shared/assets/icons/heart-gray.svg";

interface BookmarkProp {
  style: CSSProperties;
}

const BookmarkButton: React.FC<BookmarkProp> = ({ style }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <button
      className="absolute z-10 flex justify-center items-center rounded-full p-[0.44rem] bg-[rgba(255,255,255,0.9)] transition hover:scale-110"
      style={style}
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
