import { useId, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import type { SwiperOptions } from "swiper/types"; // 타입 지원을 위해
import leftArrow from "@shared/assets/icons/left-slidearrow-black.svg";
import rightArrow from "@shared/assets/icons/right-slidearrow-black.svg";
import type { BaseItem } from "./AsyncCarousel";

interface DesktopCarouselProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  breakpoints?: SwiperOptions["breakpoints"];
  slidesPerView?: number | "auto";
  spaceBetween?: number;
}

export const DesktopCarousel = <T extends BaseItem>({
  items,
  renderItem,
  breakpoints,
  slidesPerView = 4, // 기본값
  spaceBetween = 21,
}: DesktopCarouselProps<T>) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const uniqueId = useId().replace(/:/g, "");
  const prevClass = `prev-${uniqueId}`;
  const nextClass = `next-${uniqueId}`;

  return (
    <div className="relative w-full">
      <button
        className={`${prevClass} hidden desktop:flex absolute z-10 top-[50%] left-0 w-13 h-13 justify-center items-center border border-[rgba(0,0,0,0.1)] rounded-full bg-[rgba(255,255,255,0.9)] shadow-[0_0_8px_0_rgba(0,0,0,0.13)] translate-y-[-50%] translate-x-[-50%] disabled:opacity-0 transition-opacity`}
        onClick={() => swiperInstance?.slidePrev()}
      >
        <img src={leftArrow} alt="이전" />
      </button>
      <Swiper
        modules={[Navigation]}
        navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
        onSwiper={setSwiperInstance}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        breakpoints={breakpoints}
        allowTouchMove={true} // 모바일 대응을 위해 true 권장
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>{renderItem(item)}</SwiperSlide>
        ))}
      </Swiper>
      <button
        className={`${nextClass} hidden desktop:flex absolute z-10 top-[50%] right-0 w-13 h-13 justify-center items-center border border-[rgba(0,0,0,0.1)] rounded-full bg-[rgba(255,255,255,0.9)] shadow-[0_0_8px_0_rgba(0,0,0,0.13)] translate-y-[-50%] translate-x-[50%] disabled:opacity-0 transition-opacity`}
        onClick={() => swiperInstance?.slideNext()}
      >
        <img src={rightArrow} alt="다음" />
      </button>
    </div>
  );
};
