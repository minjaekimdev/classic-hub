import heartEmpty from "@shared/assets/icons/heart-black.svg";
import heartFull from "@shared/assets/icons/heart-red.svg";
import shareIcon from "@shared/assets/icons/share-black.svg";
import { useState } from "react";
import { useDetail } from "@features/detail/model/useDetail";

interface InfoRowProps {
  label: string;
  description: string;
}
const InfoRow = ({ label, description }: InfoRowProps) => {
  return (
    <li className="flex items-center gap-[1.19rem]">
      <span className="text-[#4a5565] text-[0.77rem]/[1.09rem]">{label}</span>
      <span className="text-dark text-[0.77rem]/[1.09rem]">{description}</span>
    </li>
  );
};

interface ButtonProps {
  children: React.ReactNode;
  handler: () => void;
}
const Button = ({ children, handler }: ButtonProps) => {
  return (
    <button
      className="flex-1 flex justify-center items-center border border-[rgba(0,0,0,0.1)] rounded-main h-[2.31rem]"
      onClick={() => handler()}
    >
      <div className="flex items-center gap-[0.44rem] text-dark text-[0.77rem]/[1.09rem]">
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
    <Button handler={bookmarkToggle}>
      {isBookmarked ? (
        <img src={heartEmpty} alt="찜하기" className="w-3.5 h-3.5" />
      ) : (
        <img src={heartFull} alt="찜하기 취소" className="w-3.5 h-3.5" />
      )}
      찜하기
    </Button>
  );
};

const ShareButton = () => {
  const handler = () => {};

  return (
    <Button handler={handler}>
      <img src={shareIcon} alt="공유하기" className="w-3.5 h-3.5" />
      공유하기
    </Button>
  );
};

const SummaryMobile = () => {
  const performance = useDetail();
  if (!performance) {
    throw new Error("useDetailContext must be used within a DetailProvider");
  }
  return (
    <div className="flex flex-col gap-[0.81rem] p-[1.09rem]">
      <div className="flex flex-col gap-[0.22rem]">
        <h1 className="text-dark text-[1.09rem]/[1.53rem] font-semibold">
          {performance.title}
        </h1>
        <p className="text-[#4a5565] text-[0.77rem]/[1.09rem]">
          {performance.artist}
        </p>
      </div>
      <ul className="flex flex-col gap-[0.41rem]">
        <InfoRow label="장소" description={performance.venue} />
        <InfoRow
          label="기간"
          description={`${performance.date.start} ~ ${performance.date.end}`}
        />
        <InfoRow label="공연시간" description={performance.time} />
        <InfoRow label="관람시간" description={performance.runningTime} />
      </ul>
      <div className="flex gap-[0.66rem]">
        <BookmarkButton />
        <ShareButton />
      </div>
    </div>
  );
};

export default SummaryMobile;
