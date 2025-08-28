import React from "react";
import type { TextNode, TicketLink } from "@/models/common.client";
import styles from "./DetailTop.module.scss";
import Ticketlink from "./Ticketlink";
import SeatInfo from "./SeatInfo";
import DetailTopComp from "./DetailTopComp";

interface DetailTopObj {
  prfnm: TextNode;
  prfpdfrom: TextNode;
  prfpdto: TextNode;
  fcltynm: TextNode;
  poster: TextNode;
  prfstate: TextNode;
  prfruntime: TextNode;
  prfage: TextNode;
  pcseguidance: TextNode;
  relates: {
    relate: TicketLink | TicketLink[];
  };
}

interface DetailTopProps {
  data: DetailTopObj;
}

const DetailTop: React.FC<DetailTopProps> = ({ data }) => {
  const {
    prfnm,
    prfpdfrom,
    prfpdto,
    fcltynm,
    poster,
    prfstate,
    prfruntime,
    prfage,
    pcseguidance,
    relates,
  } = data;

  const prfstateStyleMap: Record<string, string> = {
    공연중: styles["state--ongoing"],
    공연예정: styles["state--upcoming"],
    공연완료: styles["state--finished"],
  };

  const prfstateStyle = prfstateStyleMap[prfstate._text];
  const seatInfoArr = pcseguidance._text.split(", ");

  return (
    <div className={styles["detail-top"]}>
      <div
        className={styles["poster"]}
        style={{
          backgroundImage: `url(${poster._text})`
        }}
      >
        <div className={`${styles["state"]} ${prfstateStyle}`}>
          {prfstate._text}
        </div>
      </div>
      <div className={styles["info"]}>
        <div className={styles["info__title"]}>
          <span className={styles["info__title-text"]}>{prfnm._text}</span>
        </div>
        <div className={styles["info__detail"]}>
          <DetailTopComp title={"장소"}>
            <p className={styles["info__comp-content--odd"]}>{fcltynm._text}</p>
          </DetailTopComp>
          <DetailTopComp title={"관람시간"}>
            <p className={styles["info__comp-content"]}>{prfruntime._text}</p>
          </DetailTopComp>
          <DetailTopComp title={"기간"}>
            <p className={styles["info__comp-content--odd"]}>{`${prfpdfrom._text} ~ ${prfpdto._text}`}</p>
          </DetailTopComp>
          <DetailTopComp title={"관람등급"}>
            <p className={styles["info__comp-content"]}>{prfage._text}</p>
          </DetailTopComp>
          <DetailTopComp title={"가격"}>
            <div className={styles["info__comp-content-list"]}>
              {seatInfoArr.map((element, index) => (
                <SeatInfo data={element} key={index} />
              ))}
            </div>
          </DetailTopComp>
          <DetailTopComp title={"예매처"}>
            <div className={styles["info__comp-content-list"]}>
              {Array.isArray(relates.relate) ? (
                relates.relate.map((element, index) => (
                  <Ticketlink key={index} data={element} />
                ))
              ) : (
                <Ticketlink data={relates.relate} />
              )}
            </div>
          </DetailTopComp>
        </div>
      </div>
    </div>
  );
};

export default DetailTop;
