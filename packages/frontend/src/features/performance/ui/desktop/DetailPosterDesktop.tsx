import BookmarkButtonWithText from "@/shared/ui/buttons/BookmarkButtonWithText";
import ShareButtonWithText from "@/shared/ui/buttons/ShareButtonWithText";
import { useDetail } from "../../contexts/detail-context";

const DetailPoster = () => {
  const {title, artist, poster} = useDetail();
  return (
    <div className="flex flex-col gap-[0.88rem]">
      <div className="flex flex-col gap-[0.44rem]">
        <h1 className="text-dark text-[1.64rem]/[1.97rem] font-bold">
          {title}
        </h1>
        <p className="text-[#717182] text-[0.98rem]/[1.53rem]">{artist}</p>
      </div>
      <div className="rounded-main aspect-10/14 overflow-hidden">
        <img src={poster ?? ""} alt="" className="w-full h-full" />
      </div>
      <div className="flex gap-[0.44rem] h-7">
        <BookmarkButtonWithText />
        <ShareButtonWithText />
      </div>
    </div>
  );
};

export default DetailPoster;
