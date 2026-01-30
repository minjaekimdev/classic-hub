import HomeWidgetHeader from "@/widgets/home/shared/HomeWidgetHeader";
import calendarIcon from "@shared/assets/icons/calendar-red.svg";
import "swiper/css";

interface HomeSectionLayoutProps {
  mainTitle: string;
  subTitle: string;
  children: React.ReactNode;
}

const HomeSectionLayout = ({
  mainTitle,
  subTitle,
  children,
}: HomeSectionLayoutProps) => {
  return (
    <div className="mt-14 w-full">
      <div className="flex flex-col items-center gap-[1.31rem] mx-auto px-[0.88rem] desktop:px-7 max-w-7xl">
        <HomeWidgetHeader
          icon={calendarIcon}
          mainTitle={mainTitle}
          subTitle={subTitle}
        />
        {children}
      </div>
    </div>
  );
};

export default HomeSectionLayout;
