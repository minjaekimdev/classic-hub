import React, { useState, useEffect } from "react";
import styles from "./DetailContainer.module.scss";
import DetailTop from "./top/DetailTop";
import DetailBottom from "./bottom/DetailBottom";
import type { pfDetail } from "@/models/detail.client";

interface DetailContainerProps {
  pfId: string;
}

const DetailContainer: React.FC<DetailContainerProps> = ({ pfId }) => {
  const [fetchComplete, setFetchComplete] = useState(false);
  const [detail, setDetail] = useState<pfDetail>({
    prfnm: { _text: "" },
    prfpdfrom: { _text: "" },
    prfpdto: { _text: "" },
    fcltynm: { _text: "" },
    poster: { _text: "" },
    prfstate: { _text: "" },
    prfruntime: { _text: "" },
    prfage: { _text: "" },
    pcseguidance: { _text: "" },
    mt10id: { _text: "" },
    dtguidance: { _text: "" },
    styurls: {
      styurl: { _text: "" },
    },
    relates: {
      relate: {
        relatenm: { _text: "" },
        relateurl: { _text: "" },
      },
    },
  });

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        const data = await fetch(`http://localhost:3000/detail/${pfId}`).then(
          (res) => res.json()
        );
        setDetail(data);
        setFetchComplete(true);
      } catch (error) {
        console.log("공연 상세 데이터 불러오기 실패", error);
      }
    };

    fetchDetailData();
  }, [pfId]);

  const { mt10id, dtguidance, styurls, ...topData } = detail;
  const bottomData = { fcltynm: detail.fcltynm, mt10id, dtguidance, styurls };

  if (!fetchComplete) {
    return <div></div>;
  }

  return (
    <div className={styles["detail-background"]}>
      <div className="container">
        {topData && <DetailTop data={topData} />}
        {bottomData && <DetailBottom data={bottomData} />}
      </div>
    </div>
  );
};

export default DetailContainer;
