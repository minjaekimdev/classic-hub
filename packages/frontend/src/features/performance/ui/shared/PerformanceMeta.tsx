import React from "react";
import type { PerformanceSummary } from "@classic-hub/shared/types/client";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import locationIcon from "@shared/assets/icons/location-gray.svg";

interface MetaItemProps {
  iconSrc: string;
  children: React.ReactNode;
}

const MetaItem = ({ iconSrc, children }: MetaItemProps) => {
  return (
    <li className="flex items-center gap-[0.22rem] text-[#6a7282] text-[0.66rem]/[0.88rem]">
      <img src={iconSrc} alt="" />
      {children}
    </li>
  );
};

type MetaDataProps = Omit<
  PerformanceSummary,
  "id" | "rank" | "poster" | "price"
>;
const PerformanceMeta = ({ title, artist, period, venue }: MetaDataProps) => {
  return (
    <div className="flex flex-col gap-[0.66rem]">
      <div className="flex flex-col gap-[0.22rem]">
        <p className="text-[#101828] text-[0.88rem]/[1.1rem] font-semibold min-h-[2.2rem] line-clamp-2">
          {title}
        </p>
        <p className="text-[#4a5565] text-[0.77rem]/[1.09rem]">{artist}</p>
      </div>
      <div className="flex flex-col">
        <ul className="flex flex-col gap-[0.33rem]">
          <MetaItem iconSrc={calendarIcon}>{period}</MetaItem>
          <MetaItem iconSrc={locationIcon}>{venue}</MetaItem>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceMeta;
