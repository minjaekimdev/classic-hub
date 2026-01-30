import rankingIcon from "@shared/assets/icons/ranking-red.svg";
import HomeWidgetHeader from "@/widgets/home/shared/HomeWidgetHeader";
import HomePerformanceAlbumCard from "@/features/performance/components/HomePerformanceAlbumCard";
import leftArrow from "@shared/assets/icons/left-slidearrow-black.svg";
import rightArrow from "@shared/assets/icons/right-slidearrow-black.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";
import useHomeRanking from "../hooks/useHomeRanking";
import { useState } from "react";

const RankingPerformances = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const data = useHomeRanking(10);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-[1.31rem] mx-auto max-w-7xl px-[0.88rem] desktop:px-7">
        <HomeWidgetHeader
          icon={rankingIcon}
          mainTitle="오늘의 공연 랭킹"
          subTitle="티켓판매액 기준 인기 공연"
        />
        <div className="relative w-full">
          <button
            className="prev-btn-ranking hidden desktop:flex absolute z-10 top-[50%] left-0 w-13 h-13 justify-center items-center border border-[rgba(0,0,0,0.1)] rounded-full bg-[rgba(255,255,255,0.9)] shadow-[0_0_8px_0_rgba(0, 0, 0, 0.13)] translate-y-[-50%] translate-x-[-50%] disabled:hidden"
            onClick={() => swiperInstance?.slidePrev()}
          >
            <img src={leftArrow} alt="" />
          </button>
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: ".prev-btn-ranking",
              nextEl: ".next-btn-ranking",
            }}
            onSwiper={(swiper: SwiperType) => {
              setSwiperInstance(swiper);
            }}
            spaceBetween={21}
            slidesPerView={2.2}
            breakpoints={{
              600: { slidesPerView: 3.2 },
              960: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
          >
            {data.map((performance) => (
              <SwiperSlide key={performance.id}>
                <HomePerformanceAlbumCard data={performance} />
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            className="next-btn-ranking hidden desktop:flex absolute z-10 top-[50%] right-0 w-13 h-13 justify-center items-center border border-[rgba(0,0,0,0.1)] rounded-full bg-[rgba(255,255,255,0.9)] shadow-[0_0_8px_0_rgba(0, 0, 0, 0.13)] translate-y-[-50%] translate-x-[50%] disabled:hidden"
            onClick={() => swiperInstance?.slideNext()}
          >
            <img src={rightArrow} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankingPerformances;
