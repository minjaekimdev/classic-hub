import { useState } from "react";

interface MenuItemProps {
  icon: string;
  text: string;
  selected: string;
  onSelect: (text: string) => void;
}

const MenuItem = ({ icon, text, selected, onSelect }: MenuItemProps) => {
  const isSelected = selected === text;

  const textColorClass = isSelected
    ? "text-main font-medium"
    : "text-[#6a6a6a] mb-2";

  return (
    <div
      className={"flex flex-col gap-[0.69rem] cursor-pointer"}
      onClick={() => onSelect(text)}
    >
      <div
        className={`flex items-center gap-3 ${textColorClass}`}
        onClick={() => onSelect(text)}
      >
        <span className="text-[2.13rem]/[2.13rem]">{icon}</span>
        <span className="shrink-0 text-[0.88rem]/[1.13rem] font-medium">
          {text}
        </span>
      </div>
      {isSelected && (
        <div className="border-b-4 border-black rounded-full"></div>
      )}
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

const Menu = () => {
  const [selected, setSelected] = useState("홈");
  return (
    <div className="shrink-0 flex gap-[1.56rem]">
      {menuItemArray.map((item) => (
        <MenuItem
          icon={item.icon}
          text={item.text}
          selected={selected}
          onSelect={setSelected}
        />
      ))}
    </div>
  );
};

export default Menu;
