import React from "react";

interface BadgeProps {
  children: React.ReactNode;
}
const Badge = ({ children }: BadgeProps) => {
  return (
    <div className="flex items-center h-[1.21rem] rounded-button bg-[#eceef2] px-[0.44rem] text-[#030213] text-[0.66rem]/[0.88rem] font-medium">
      {children}
    </div>
  );
};

export default Badge;
