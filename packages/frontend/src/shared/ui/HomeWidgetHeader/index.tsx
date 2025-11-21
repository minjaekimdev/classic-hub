import "@app/styles/main.scss";
import React from "react";
import styles from "./HomeWidgetHeader.module.scss";
import rightArrow from "@shared/assets/icons/right-arrow-red.svg";

interface HomeWidgetHeaderProps {
  icon: string;
  mainTitle: string;
  subTitle: string;
}

const HomeWidgetHeader: React.FC<HomeWidgetHeaderProps> = ({
  icon,
  mainTitle,
  subTitle,
}) => {
  return (
    <div className={styles.widgetHeader}>
      <div className={styles.widgetHeader__title}>
        <img className={styles.widgetHeader__logo} src={icon} alt="" />
        <div className={styles.widgetHeader__headerText}>
          <h1 className={styles.widgetHeader__mainTitle}>{mainTitle}</h1>
          <span className={styles.widgetHeader__subTitle}>{subTitle}</span>
        </div>
      </div>
      <div className={styles.widgetHeader__seeAll}>
        더보기
        <img src={rightArrow} alt="" />
      </div>
    </div>
  );
};

export default HomeWidgetHeader;
