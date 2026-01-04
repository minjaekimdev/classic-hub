import HomeWidgetHeader from "@/shared/layout/HomeWidgetHeader";
import calendarIcon from "@shared/assets/icons/calendar-red.svg";
import HomePerformanceAlbumItem from "@/features/performance/components/HomeAlbumItem";
import ListItem from "./ListItem";
import type { PerformanceSummary } from "@classic-hub/shared/types/performance";
import leftArrow from "@shared/assets/icons/left-slidearrow-black.svg";
import rightArrow from "@shared/assets/icons/right-slidearrow-black.svg";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";

interface WeekendPerformancesProps {
  performanceArray: PerformanceSummary[];
}

const WeekendPerformances = ({
  performanceArray,
}: WeekendPerformancesProps) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true); //
  const [isEnd, setIsEnd] = useState(false);
  return (
    <div className="mt-14 w-full">
      <div className="flex flex-col items-center gap-[1.31rem] mx-auto px-7 max-w-7xl">
        <HomeWidgetHeader
          icon={calendarIcon}
          mainTitle="이번 주말에 볼 수 있는 공연"
          subTitle="당신의 주말을 채워줄 공연 리스트"
        />
        <div className="relative hidden desktop:block w-full">
          {!isBeginning && (
            <button
              className="absolute z-10 top-[50%] left-0 w-13 h-13 flex justify-center items-center border border-[rgba(0,0,0,0.1)] rounded-full bg-[rgba(255,255,255,0.9)] shadow-[0_0_8px_0_rgba(0, 0, 0, 0.13)] translate-y-[-50%] translate-x-[-50%]"
              onClick={() => swiperInstance?.slidePrev()}
            >
              <img src={leftArrow} alt="" />
            </button>
          )}
          <Swiper
            onSwiper={(swiper: SwiperType) => {
              setSwiperInstance(swiper);
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={(swiper: SwiperType) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            spaceBetween={21}
            slidesPerView={4}
            allowTouchMove={false}
            breakpoints={{
              1280: { slidesPerView: 5 },
            }}
          >
            {performanceArray.map((performance) => (
              <SwiperSlide key={performance.id}>
                <HomePerformanceAlbumItem
                  data={performance}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {!isEnd && (
            <button
              className="absolute z-10 top-[50%] right-0 w-13 h-13 flex justify-center items-center border border-[rgba(0,0,0,0.1)] rounded-full bg-[rgba(255,255,255,0.9)] shadow-[0_0_8px_0_rgba(0, 0, 0, 0.13)] translate-y-[-50%] translate-x-[50%]"
              onClick={() => swiperInstance?.slideNext()}
            >
              <img src={rightArrow} alt="" />
            </button>
          )}
        </div>
        <ul className="flex desktop:hidden flex-col gap-[0.88rem] w-full">
          {performanceArray.map((performance) => (
            <ListItem key={performance.title} data={performance} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WeekendPerformances;
