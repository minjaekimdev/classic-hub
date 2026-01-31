import rightArrow from "@shared/assets/icons/right-arrowhead-red.svg";

interface HomeSectionLayoutProps {
  mainTitle: string;
  subTitle: string;
  headerIcon: string;
  children: React.ReactNode;
}

const HomeSectionLayout = ({
  mainTitle,
  subTitle,
  headerIcon,
  children,
}: HomeSectionLayoutProps) => {
  return (
    <div className="mb-14 w-full">
      <div className="flex flex-col items-center gap-[1.31rem] mx-auto px-[0.88rem] desktop:px-7 max-w-7xl">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-[0.66rem]">
            <img className="w-[1.31rem] h-[1.31rem]" src={headerIcon} alt="" />
            <div className="flex flex-col">
              <h1 className="text-[#101828] text-[1.09rem]/[1.53rem] font-bold">
                {mainTitle}
              </h1>
              <span className="text-[#4a5565] text-[0.77rem]/[1.09rem]">
                {subTitle}
              </span>
            </div>
          </div>
          <div className="flex gap-[0.43rem] items-center p-[0.47rem_0.66rem_0.38rem] text-main text-[0.76rem]/[1.1rem] font-medium cursor-pointer">
            전체보기
            <img src={rightArrow} alt="" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default HomeSectionLayout;
