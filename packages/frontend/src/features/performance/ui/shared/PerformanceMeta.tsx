import React from "react";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import locationIcon from "@shared/assets/icons/location-gray.svg";
import formatDateRange from "@/shared/utils/formatDateRange";
import type { PerformanceSummary } from "@classic-hub/shared/types/client";
import ComposerBadge from "@/shared/ui/badges/ComposerBadge";

interface MetaItemProps {
  iconSrc: string;
  children: React.ReactNode;
}

const MetaItem = ({ iconSrc, children }: MetaItemProps) => {
  return (
    <li className="flex items-center gap-[0.22rem] text-[0.66rem]/[0.88rem] text-[#6a7282]">
      <img src={iconSrc} alt="" />
      {children}
    </li>
  );
};

type PerformanceMetaProps = Pick<
  PerformanceSummary,
  "title" | "startDate" | "endDate" | "venue" | "program"
>;
const PerformanceMeta = ({
  title,
  startDate,
  endDate,
  venue,
  program = [],
}: PerformanceMetaProps) => {
  const renderComposers = () => {
    const composers = program.filter((item) => item.composerKo);
    if (composers.length === 0) return null;
    return (
      <div className="flex max-h-11 w-full flex-wrap items-center gap-1 overflow-hidden">
        {program
          .filter((item) => item.composerKo)
          .map((item, idx) => (
            <ComposerBadge key={idx} composer={item.composerKo!} />
          ))}
      </div>
    );
  };
  return (
    <div className="flex flex-col gap-[0.66rem]">
      <div className="flex flex-col gap-3">
        <p className="line-clamp-2 text-[0.88rem]/[1.1rem] font-semibold text-[#101828]">
          {title}
        </p>
        {renderComposers()}
      </div>
      <div className="flex flex-col">
        <ul className="flex flex-col gap-[0.33rem]">
          <MetaItem iconSrc={calendarIcon}>
            {formatDateRange(startDate, endDate)}
          </MetaItem>
          <MetaItem iconSrc={locationIcon}>{venue}</MetaItem>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceMeta;
