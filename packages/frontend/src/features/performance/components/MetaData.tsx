import React from "react";
import type { HomePerformance } from "@classic-hub/shared/types/performance";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import clockIcon from "@shared/assets/icons/clock-gray.svg";
import locationIcon from "@shared/assets/icons/location-gray.svg";
import ComposerTab from "./ComposerTab";

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

type MetaDataProps = Omit<HomePerformance, "id" | "rank" | "posterUrl" | "price">;
const MetaData = ({
  title,
  artist,
  date,
  time,
  venue,
  composerArray,
}: MetaDataProps) => {
  return (
    <div className="flex flex-col gap-[0.66rem]">
      <div className="flex flex-col gap-[0.22rem]">
        <p className="text-[#101828] text-[0.88rem]/[1.1rem] font-semibold min-h-[2.2rem] line-clamp-2">
          {title}
        </p>
        <p className="text-[#4a5565] text-[0.77rem]/[1.09rem]">{artist}</p>
      </div>
      <div className="flex h-[2.66rem] overflow-hidden">
        <div className="flex flex-wrap gap-[0.22rem]">
          {composerArray.map((item: string) => (
            <ComposerTab composer={item} />
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <ul className="flex flex-col gap-[0.33rem]">
          <MetaItem iconSrc={calendarIcon}>
            <div>
              <span>{date.start}</span>
              {date.start !== date.end && (
                <>
                  <br />~ <span>{date.end}</span>
                </>
              )}
            </div>
          </MetaItem>
          <MetaItem iconSrc={clockIcon}>{time}</MetaItem>
          <MetaItem iconSrc={locationIcon}>{venue}</MetaItem>
        </ul>
      </div>
    </div>
  );
};

export default MetaData;
