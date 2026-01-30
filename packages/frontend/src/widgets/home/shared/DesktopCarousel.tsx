import HomePerformanceAlbumCard from "@/features/performance/components/HomePerformanceAlbumCard";
import leftArrow from "@shared/assets/icons/left-slidearrow-black.svg";
import rightArrow from "@shared/assets/icons/right-slidearrow-black.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";
import { useState } from "react";
import type { HomePerformance } from "@classic-hub/shared/types/client";

const DesktopCarousel = ({ performanceArray }: {performanceArray: HomePerformance[]}) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  return (
    <div className="relative w-full">
      <button
        className="prev-btn-weekend hidden desktop:flex absolute z-10 top-[50%] left-0 w-13 h-13 justify-center items-center border border-[rgba(0,0,0,0.1)] rounded-full bg-[rgba(255,255,255,0.9)] shadow-[0_0_8px_0_rgba(0, 0, 0, 0.13)] translate-y-[-50%] translate-x-[-50%] disabled:hidden"
        onClick={() => swiperInstance?.slidePrev()}
      >
        <img src={leftArrow} alt="" />
      </button>
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".prev-btn-weekend",
          nextEl: ".next-btn-weekend",
        }}
        onSwiper={(swiper: SwiperType) => {
          setSwiperInstance(swiper);
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
            <HomePerformanceAlbumCard data={performance} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        className="next-btn-weekend hidden desktop:flex absolute z-10 top-[50%] right-0 w-13 h-13 justify-center items-center border border-[rgba(0,0,0,0.1)] rounded-full bg-[rgba(255,255,255,0.9)] shadow-[0_0_8px_0_rgba(0, 0, 0, 0.13)] translate-y-[-50%] translate-x-[50%] disabled:hidden"
        onClick={() => swiperInstance?.slideNext()}
      >
        <img src={rightArrow} alt="" />
      </button>
    </div>
  );
};

export default DesktopCarousel;
