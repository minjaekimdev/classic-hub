import styles from "./PerformanceInfo.module.scss";
import type { TextNode } from "@/models/common.client";

interface PerformanceInfoPropsObj {
  dtguidance: TextNode;
  styurls: {
    styurl: TextNode | TextNode[];
  };
}

interface PerformanceInfoProps {
  data: PerformanceInfoPropsObj;
}

const PerformanceInfo: React.FC<PerformanceInfoProps> = ({ data }) => {
  const { dtguidance, styurls } = data;
  const pfDetailImgData = styurls.styurl;

  return (
    <div className={styles["performance-info"]}>
      <section className={styles["time"]}>
        <p className={styles["performance-info__title"]}>공연 시간 정보</p>
        <span className={styles["time__content"]}>{dtguidance._text}</span>
      </section>
      <section className={styles["detail"]}>
        <p className={styles["performance-info__title"]}>공연 상세 정보</p>
        {Array.isArray(pfDetailImgData) ? (
          pfDetailImgData.map((element, index) =>
            element._text ? (
              <img
                key={index}
                className={styles["detail__image"]}
                src={element._text}
                alt="공연 상세 이미지"
              />
            ) : null
          )
        ) : pfDetailImgData._text ? (
          <img
            className={styles["detail__image"]}
            src={pfDetailImgData._text}
            alt="공연 상세 이미지"
          />
        ) : null}
      </section>
    </div>
  );
};

export default PerformanceInfo;
