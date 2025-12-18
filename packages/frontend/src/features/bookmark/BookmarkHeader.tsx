import heartIcon from "@shared/assets/icons/bookmarkpage-heart-red.svg";

interface BookmarkHeaderProps {
  pfNum: number;
}

const BookmarkHeader = ({ pfNum }: BookmarkHeaderProps) => {
  return (
    <div className="flex flex-col gap-[0.66rem]">
      <div className="flex gap-[0.66rem]">
        <img src={heartIcon} alt="" />
        <h1 className="text-[#0a0a0a] text-[1.64rem]/[1.97rem]">찜한 공연</h1>
      </div>
      <span className="text-[#717182] text-[0.88rem]/[1.31rem]">
        총 {pfNum}개의 공연을 찜했습니다
      </span>
    </div>
  );
};

export default BookmarkHeader;
