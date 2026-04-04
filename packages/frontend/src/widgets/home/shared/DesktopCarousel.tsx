import { useId } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { SwiperOptions } from "swiper/types"; // 타입 지원을 위해
import leftArrow from "@shared/assets/icons/left-slidearrow-black.svg";
import rightArrow from "@shared/assets/icons/right-slidearrow-black.svg";
import type { BaseItem } from "./AsyncCarousel";

interface DesktopCarouselProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  breakpoints?: SwiperOptions["breakpoints"];
  slidesPerView?: number | "auto";
  slidesPerGroup?: number;
  spaceBetween?: number;
}

export const DesktopCarousel = <T extends BaseItem>({
  items,
  renderItem,
  breakpoints,
  slidesPerView = 4, // 기본값
  slidesPerGroup = 1, // 기본값
  spaceBetween = 21,
}: DesktopCarouselProps<T>) => {
  const uniqueId = useId().replace(/:/g, "");
  const prevClass = `prev-${uniqueId}`;
  const nextClass = `next-${uniqueId}`;

  return (
    <div className="relative w-full">
      <button
        className={`${prevClass} desktop:flex absolute top-[50%] left-0 z-10 hidden h-13 w-13 translate-x-[-50%] translate-y-[-50%] items-center justify-center rounded-full border border-[rgba(0,0,0,0.1)] bg-[rgba(255,255,255,0.9)] shadow-[0_0_8px_0_rgba(0,0,0,0.13)] transition-opacity disabled:opacity-0`}
      >
        <img src={leftArrow} alt="이전" />
      </button>
      <Swiper
        modules={[Navigation]}
        navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        slidesPerGroup={slidesPerGroup}
        breakpoints={breakpoints}
        allowTouchMove={true} // 모바일 대응을 위해 true 권장
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>{renderItem(item)}</SwiperSlide>
        ))}
      </Swiper>
      <button
        className={`${nextClass} desktop:flex absolute top-[50%] right-0 z-10 hidden h-13 w-13 translate-x-[50%] translate-y-[-50%] items-center justify-center rounded-full border border-[rgba(0,0,0,0.1)] bg-[rgba(255,255,255,0.9)] shadow-[0_0_8px_0_rgba(0,0,0,0.13)] transition-opacity disabled:opacity-0`}
      >
        <img src={rightArrow} alt="다음" />
      </button>
    </div>
  );
};
