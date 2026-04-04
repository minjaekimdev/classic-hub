import rightArrow from "@shared/assets/icons/right-arrowhead-red.svg";

interface HomeSectionLayoutProps {
  mainTitle: string;
  subTitle: string;
  headerIcon: string;
  children: React.ReactNode;
  onFullShowClick: () => void;
}

const HomeSectionLayout = ({
  mainTitle,
  subTitle,
  headerIcon,
  children,
  onFullShowClick,
}: HomeSectionLayoutProps) => {
  return (
    <div className="px-088 desktop:px-7 mb-14 flex flex-col items-center gap-[1.31rem]">
      <div className="flex w-full items-center justify-between">
        <div className="gap-066 flex items-center">
          <img className="h-[1.31rem] w-[1.31rem]" src={headerIcon} alt="" />
          <div className="flex flex-col">
            <h1 className="text-[1.09rem]/[1.53rem] font-bold text-[#101828]">
              {mainTitle}
            </h1>
            <span className="text-[0.77rem]/[1.09rem] text-[#4a5565]">
              {subTitle}
            </span>
          </div>
        </div>
        <div
          className="text-main flex cursor-pointer items-center gap-[0.43rem] p-[0.47rem_0.66rem_0.38rem] text-[0.76rem]/[1.1rem] font-medium"
          onClick={onFullShowClick}
        >
          전체보기
          <img src={rightArrow} alt="" />
        </div>
      </div>
      {children}
    </div>
  );
};

export default HomeSectionLayout;
