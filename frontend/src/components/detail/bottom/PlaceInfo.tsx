import React, { useState, useEffect, useRef } from "react";
import styles from "./PlaceInfo.module.scss";
import locationIcon from "@/assets/filter/location.svg";
import type { TextNode } from "@/models/common.client";
import supabase from "@/apis/supabase-client";

interface PlaceInfoPropsObj {
  fcltynm: TextNode;
  mt10id: TextNode;
}

interface PlaceInfoProps {
  data: PlaceInfoPropsObj;
}

const PlaceInfo: React.FC<PlaceInfoProps> = ({ data }) => {
  const [adres, setAdres] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);

  const { fcltynm, mt10id } = data;

  useEffect(() => {
    const fetchLocationData = async (concertHallId: string) => {
      const { data, error } = await supabase
        .from("concert_halls")
        .select("adres, la, lo")
        .eq("mt10id", concertHallId)
        .limit(1)
        .single();

      if (error) {
        console.log("DB concert_halls에서 위치 데이터 가져오기 실패");
        return null;
      } else {
        return data;
      }
    };

    const drawMap = (latitude: number, longitude: number) => {
      const { naver } = window;
      if (mapRef.current && naver) {
        const location = new naver.maps.LatLng(latitude, longitude);
        const map = new naver.maps.Map(mapRef.current, {
          center: location,
          zoom: 17,
        });
        new naver.maps.Marker({
          position: location,
          map,
        });
      }
    };

    const handleLocationData = async () => {
      const locationData = await fetchLocationData(mt10id._text);

      if (locationData) {
        setAdres(locationData.adres);
        drawMap(locationData.la, locationData.lo);
      }
    };

    handleLocationData();
  }, []);

  return (
    <div className={styles["place-info"]}>
      <section className={styles["hall"]}>
        <p className={styles["hall__title"]}>공연장 정보</p>
        <div className={styles["hall__detail"]}>
          <img className={styles["icon"]} src={locationIcon} alt="" />
          <div className={styles["hall__detail-text"]}>
            <div className={styles["hall__detail-name"]}>{fcltynm._text}</div>
            <div className={styles["hall__detail-address"]}>
              {adres}
            </div>
          </div>
        </div>
      </section>
      <section className={styles["location"]}>
        <p className={styles["location__title"]}>위치</p>
        <div
          ref={mapRef}
          className={`${styles["location__map"]} ${
            !location && styles["location__map--no-location"]
          }`}
        >
          {!location && "위치 정보가 제공되지 않습니다."}
        </div>
      </section>
    </div>
  );
};

export default PlaceInfo;
