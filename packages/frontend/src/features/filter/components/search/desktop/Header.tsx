import Logo from "@/shared/layout/Logo";
import { SearchFilter } from "./SearchFilter";
import Menu from "@/shared/layout/HeaderMenu";
import locationIcon from "@shared/assets/icons/location-gray.svg";
import moneyIcon from "@shared/assets/icons/dollar-gray.svg";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";


const Header = () => {
  return (
    <div className="fixed top-0 z-20 bg-[linear-gradient(180deg,#FFF_39.9%,#F8F8F8_100%)] max-w-[1920px] mx-auto">
      <div className="flex justify-between">
        <Logo />
          <div className="flex flex-col gap-6 mt-[1.87rem] mb-8">
            <Menu />

          </div>
      </div>
    </div>
  );
};

export default Header;