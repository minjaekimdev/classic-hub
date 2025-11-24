import logoIcon from "@shared/assets/logos/classichub.svg";
import MenuItem from "./MenuItem";

const Logo = () => {
  return (
    <div className="p-[1.62rem_0]">
      <div className="flex gap-[0.44rem]">
        <img className="w-7 h-7" src={logoIcon} alt="" />
        <h1 className="m-auto font-[1.31rem]/[1.31rem] font-logo">
          ClassicHub
        </h1>
      </div>
    </div>
  );
};

const menuItemArray = [
  {
    icon: "🎻",
    text: "홈",
  },
  {
    icon: "🏆",
    text: "랭킹",
  },
  {
    icon: "👍",
    text: "내가 찜한 공연",
  },
];

const DesktopHeader = () => {
  return (
    <div className="w-full">
      <div className="">
        <Logo />
        {menuItemArray.map((item) => (
          <MenuItem icon={item.icon} text={item.text} />
        ))}
      </div>
    </div>
  );
};

export default DesktopHeader;
