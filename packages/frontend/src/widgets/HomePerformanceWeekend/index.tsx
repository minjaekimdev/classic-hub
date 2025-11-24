import React from "react";

import styles from "./HomePerformanceWeekend.module.scss";
import HomeWidgetHeader from "@/shared/ui/HomeWidgetHeader";
import calendarIcon from "@shared/assets/icons/calendar-red.svg";
import type { PerformanceDataSimple } from "@root-shared/model/performance.front";
import HomePerformanceAlbumItem from "@/features/performance/components/HomePerformanceAlbumItem";
import PerformanceListItem from "@/features/performance/components/PerformanceListItem";

interface HomePerformanceWeekendProps {
  performanceArray: PerformanceDataSimple[];
}

const HomePerformanceWeekend: React.FC<HomePerformanceWeekendProps> = ({
  performanceArray,
}) => {
  return (
    <div className={styles.weekend}>
      <div className={styles.weekend__wrapper}>
        <HomeWidgetHeader
          icon={calendarIcon}
          mainTitle="이번 주말에 볼 수 있는 공연"
          subTitle="당신의 주말을 채워줄 공연 리스트"
        />
        <ul className={styles.weekend__desktop}>
          {performanceArray.map((performance) => (
            <HomePerformanceAlbumItem
              key={performance.title}
              data={performance}
            />
          ))}
        </ul>
        <ul className={styles.weekend__mobile}>
          {performanceArray.map((performance) => (
            <PerformanceListItem key={performance.title} data={performance} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePerformanceWeekend;
