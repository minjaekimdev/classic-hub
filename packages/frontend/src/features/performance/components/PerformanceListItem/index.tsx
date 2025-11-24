import styles from "./PerformanceListItem.module.scss";
import Bookmark from "@shared/ui/BookmarkButton";
import type { PerformanceDataSimple } from "@root-shared/model/performance.front";
import PerformanceAlbumMeta from "../PerformanceMeta";
import ProgramButton from "@/shared/ui/ProgramButton";

interface CardProps {
  imgSrc: string;
  rank?: string;
}

const MobileCard: React.FC<CardProps> = ({ imgSrc }) => {
  return (
    <div className={styles.mobileCard}>
      <img className={styles.mobileCard__poster} src={imgSrc} alt="" />
      <Bookmark style={{ top: "0.66rem", right: "0.66rem" }} />
    </div>
  );
};

const MobileItem: React.FC<{ data: PerformanceDataSimple }> = ({ data }) => {
  return (
    <li className={styles.mobileItem}>
      <MobileCard imgSrc={data.imgSrc} />
      <div className={styles.mobileItem__info}>
        <div className={styles.top}>
          <PerformanceAlbumMeta
            title={data.title}
            artist={data.artist}
            stdate={data.stdate}
            eddate={data.eddate}
            time={data.time}
            hall={data.hall}
          />
          <div>
            <ProgramButton />
          </div>
        </div>
        <p className={styles.mobileItem__price}>
          {data.lowPrice === data.highPrice ? (
            <>
              <span className={styles.price}>전석 {data.lowPrice}</span>
            </>
          ) : (
            <>
              {data.lowPrice}
              <span className={styles.tilde}> ~ </span>
              {data.highPrice}
            </>
          )}
        </p>
      </div>
    </li>
  );
};

export default MobileItem;
