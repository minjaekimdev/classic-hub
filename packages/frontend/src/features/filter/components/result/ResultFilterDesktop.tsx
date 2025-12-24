import locationIcon from "@shared/assets/icons/location-black.svg";
import noteIcon from "@shared/assets/icons/musical-note-red.svg";
import filterIcon from "@shared/assets/icons/filter-black.svg";
import CategoryHeader from "./CategoryHeader";

const sortCategoryItem = ["공연임박순", "낮은가격순", "높은가격순", "가나다순"];

interface ResultCountProps {
  count: number;
}

const ResultCount = ({ count }: ResultCountProps) => {
  return (
    <div className="flex flex-col gap-[0.44rem] rounded-main bg-[#f9fafb] px-[0.88rem] pt-[0.87rem] pb-[0.37rem]">
      <CategoryHeader iconSrc={noteIcon} text="검색 결과" />
      <span className="text-main text-[1.31rem]/[1.75rem] font-bold">
        {count}개
      </span>
      <span className="text-[#6a7282] text-[0.77rem]/[1.09rem]">
        클래식 공연
      </span>
    </div>
  );
};


const ResultFilterDesktop = () => {
  return (
    <div className="">
      
    </div>
  )
}