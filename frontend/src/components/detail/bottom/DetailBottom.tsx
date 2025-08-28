import React, { useState } from "react";
import styles from "./DetailBottom.module.scss";
import type { TextNode } from "@/models/common.client";
import PerformanceInfo from "./PerformanceInfo";
import PlaceInfo from "./PlaceInfo";

interface DetailBottomPropsObj {
  fcltynm: TextNode;
  mt10id: TextNode;
  dtguidance: TextNode;
  styurls: {
    styurl: TextNode | TextNode[];
  };
}

interface DetailBottomProps {
  data: DetailBottomPropsObj;
}

const DetailBottom: React.FC<DetailBottomProps> = ({ data }) => {
  const [selectedTab, setSelectedTab] = useState("performance-info");

  const { fcltynm, mt10id, dtguidance, styurls } = data;

  const performanceInfoData = { dtguidance, styurls };
  const placeInfoData = { fcltynm, mt10id };

  return (
    <div className={styles["bottom-info"]}>
      <div className={styles["bottom-info__header"]}>
        <div
          className={`${styles["bottom-info__tab"]} ${
            selectedTab === "performance-info" &&
            styles["bottom-info__tab--active"]
          }`}
          onClick={() => setSelectedTab("performance-info")}
        >
          공연 정보
        </div>
        <div
          className={`${styles["bottom-info__tab"]} ${
            selectedTab === "place-info" && styles["bottom-info__tab--active"]
          }`}
          onClick={() => setSelectedTab("place-info")}
        >
          장소 정보
        </div>
      </div>
      <div
        style={{
          display: selectedTab === "performance-info" ? "block" : "none",
        }}
      >
        {performanceInfoData && <PerformanceInfo data={performanceInfoData} />}
      </div>
      <div
        style={{
          display: selectedTab === "place-info" ? "block" : "none",
        }}
      >
        {placeInfoData && <PlaceInfo data={placeInfoData} />}
      </div>
    </div>
  );
};

export default DetailBottom;
