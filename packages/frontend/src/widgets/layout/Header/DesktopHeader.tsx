import FilterDesktop from "@/features/filter/FilterDesktop";
import Auth from "./Auth";
import Logo from "./Logo";
import Menu from "./Menu";

const DesktopHeader = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col max-w-7xl m-[0_auto] p-[0_1.75rem] pb-8">
        <div className="flex place-content-between items-start h-[6.38rem]">
          <Logo />
          <Menu />
          <Auth />
        </div>
        <div className="flex justify-center">
          <FilterDesktop />
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;
