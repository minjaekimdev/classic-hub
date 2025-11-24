import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";

const Header = () => {
  return (
    <div className="w-full border-b border-[#e5e7eb]">
      <div className="block max-[600px]:hidden">
        <DesktopHeader />
      </div>
      <div className="hidden max-[600px]:block">
        <MobileHeader />
      </div>
    </div>
  );
};

export default Header;
