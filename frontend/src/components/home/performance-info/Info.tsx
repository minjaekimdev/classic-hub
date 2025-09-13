import React from "react";
// import styles from "./Info.module.scss";
import InfoHeader from "./InfoHeader";
import PerformanceCardGallery from "./PerformanceCardGallery";

const Info: React.FC = () => {
  return (
    <div className="container">
      <InfoHeader main="🔥 인기 공연" sub="가장 많은 관심을 받고 있는 클래식 공연들" />
      <PerformanceCardGallery isPopular={true}/>
      <InfoHeader main="🎼 교향악/협연 임박 공연" sub="웅장한 교향악 공연들" />
      <PerformanceCardGallery />
      <InfoHeader main="🎹 리사이틀 임박 공연" sub="솔로 연주자들의 특별한 무대" />
      <PerformanceCardGallery />
      <InfoHeader main="🎻 실내악 임박 공연" sub="소규모 앙상블의 섬세한 하모니" />
      <PerformanceCardGallery />
      <InfoHeader main="🎭 무대 음악 임박 공연" sub="화려한 무대 예술" />
      <PerformanceCardGallery />
    </div>
  );
};

export default Info;
