import musicIcon from "@shared/assets/icons/musical-note-red.svg";
import arrowIcon from "@shared/assets/icons/left-arrow-dark.svg";

const DetailHeader = ({ title }: { title: string }) => {
  return (
    <header className="flex items-center justify-between px-7 h-14">
      <div className="flex items-center gap-[0.66rem]">
        <div className="shrink-0 flex gap-[0.77rem] rounded-button p-[0.36rem_0.43rem_0.27rem_0.55rem] cursor-pointer hover:bg-[#e9ebef]">
          <img src={arrowIcon} alt="뒤로가기" className="" />
          <span className="text-dark text-[0.77rem]/[1.09rem] font-medium">
            뒤로
          </span>
        </div>
        <div className="flex items-center gap-[0.44rem]">
          <img src={musicIcon} alt="" className="" />
          <div className="shrink-0 flex flex-col">
            <p className="text-[#717182] text-[0.77rem]/[1.09rem]">공연 상세</p>
            <h1 className="text-[#101828] text-[0.88rem]/[1.31rem] font-semibold">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DetailHeader;
