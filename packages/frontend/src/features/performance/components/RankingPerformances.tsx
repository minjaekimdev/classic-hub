import React from "react";
import rankingIcon from "@shared/assets/icons/ranking-red.svg";
import type { HomePerformance } from "@classic-hub/shared/types/performance";
import HomeWidgetHeader from "@/shared/layout/HomeWidgetHeader";
import AlbumItem from "@/features/performance/components/HomeAlbumItem";
import leftArrow from "@shared/assets/icons/left-slidearrow-black.svg";
import rightArrow from "@shared/assets/icons/right-slidearrow-black.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import useSwiper from "../hooks/useSwiper";

interface HomePerformanceRankingProps {
  performanceArray: HomePerformance[];
}

const HomePerformanceRanking: React.FC<HomePerformanceRankingProps> = ({
  performanceArray,
}) => {
  const {
    swiperInstance,
    setSwiperInstance,
    isBeginning,
    isEnd,
    updateNavigationState,
  } = useSwiper();

  return (
    <div className="w-full">
      <div className="flex flex-col gap-[1.31rem] mx-auto max-w-7xl px-7">
        <HomeWidgetHeader
          icon={rankingIcon}
          mainTitle="오늘의 공연 랭킹"
          subTitle="티켓판매액 기준 인기 공연"
        />
        <div className="relative w-full">
          {!isBeginning && (
            <button
              className="hidden desktop:flex absolute z-10 top-[50%] left-0 w-13 h-13 justify-center items-center border border-[rgba(0,0,0,0.1)] rounded-full bg-[rgba(255,255,255,0.9)] shadow-[0_0_8px_0_rgba(0, 0, 0, 0.13)] translate-y-[-50%] translate-x-[-50%]"
              onClick={() => swiperInstance?.slidePrev()}
            >
              <img src={leftArrow} alt="" />
            </button>
          )}
          <Swiper
            onSwiper={(swiper: SwiperType) => {
              console.log(
                `isBeginning: ${swiper.isBeginning}, isEnd: ${swiper.isEnd}`
              );
              setSwiperInstance(swiper);
              updateNavigationState(swiper);
            }}
            onBreakpoint={updateNavigationState}
            onSlideChange={updateNavigationState}
            spaceBetween={21}
            slidesPerView={2.2}
            breakpoints={{
              600: { slidesPerView: 3.2 },
              960: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
          >
            {performanceArray.map((performance) => (
              <SwiperSlide key={performance.id}>
                <AlbumItem data={performance} />
              </SwiperSlide>
            ))}
          </Swiper>
          {!isEnd && (
            <button
              className="hidden desktop:flex absolute z-10 top-[50%] right-0 w-13 h-13 justify-center items-center border border-[rgba(0,0,0,0.1)] rounded-full bg-[rgba(255,255,255,0.9)] shadow-[0_0_8px_0_rgba(0, 0, 0, 0.13)] translate-y-[-50%] translate-x-[50%]"
              onClick={() => swiperInstance?.slideNext()}
            >
              <img src={rightArrow} alt="" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePerformanceRanking;
