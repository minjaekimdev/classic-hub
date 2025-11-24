import { useState } from "react";

interface MenuItemProps {
  icon: string;
  text: string;
}

const MenuItem = ({icon, text}: MenuItemProps) => {
  const [selected, setSelected] = useState(null);
  return (
    <div className="flex gap-3" onClick={}>
      <span className="f-[2.13rem]/[2.13rem]">{icon}</span>
      <span className="f-[0.88rem]/[1.13rem] font-medium">{text}</span>
    </div>
  );
}

export default MenuItem;