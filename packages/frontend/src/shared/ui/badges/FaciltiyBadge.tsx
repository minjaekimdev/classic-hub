import React from "react";

interface FaciltiyBadgeProps {
  children: React.ReactNode;
}
const FaciltiyBadge = ({ children }: FaciltiyBadgeProps) => {
  return (
    <div className="rounded-button px-badge-x text-badge bg-[#eceef2] text-[#030213]">
      {children}
    </div>
  );
};

export default FaciltiyBadge;
