import React from "react";
import "@app/styles/main.scss";
import styles from "./HomePerformanceWeekend.module.scss";
import HomeWidgetHeader from "@/shared/ui/HomeWidgetHeader";
import calendarIcon from "@shared/assets/icons/calendar-red.svg";
import HomePerformanceAlbumItem from "@/features/performance/components/HomePerformanceAlbumItem";
import type { PerformanceDataSimple } from "@root-shared/model/performance.front";

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
        <ul className={styles.weekend__list}>
          {performanceArray.map((performance) => (
            <HomePerformanceAlbumItem
              key={performance.title}
              data={performance}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePerformanceWeekend;
