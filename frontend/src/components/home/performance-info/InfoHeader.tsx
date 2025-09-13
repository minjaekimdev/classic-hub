import React from "react";
import styles from "./InfoHeader.module.scss";
import ViewAll from "./ViewAll";

const InfoHeader: React.FC<{ main: string; sub: string }> = ({ main, sub }) => { 
  return (
    <div className={styles["info-header"]}>
      <section className={styles["title-wrapper"]}>
        <p className={styles["info-header__main"]}>{main}</p>
        <p className={styles["info-header__sub"]}>{sub}</p>
      </section>
      {main === "🔥 인기 공연" && <ViewAll />}
    </div>
  );
};

export default InfoHeader;
