import { useId, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import type { SwiperOptions } from "swiper/types"; // 타입 지원을 위해
import leftArrow from "@shared/assets/icons/left-slidearrow-black.svg";
import rightArrow from "@shared/assets/icons/right-slidearrow-black.svg";
// import type { PerformanceSummary } from "@classic-hub/shared/types/client";

// interface DesktopCarouselProps {
//   items: PerformanceSummary[];
//   renderItem: (item: PerformanceSummary) => React.ReactNode;
//   breakpoints?: SwiperOptions["breakpoints"];
//   slidesPerView?: number | "auto";
//   spaceBetween?: number;
// }

// const DesktopCarousel = ({
//   items,
//   renderItem,
//   breakpoints,
//   slidesPerView = 4, // 기본값
//   spaceBetween = 21,
// }: DesktopCarouselProps) => {
//   const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
//   const uniqueId = useId().replace(/:/g, "");
//   const prevClass = `prev-${uniqueId}`;
//   const nextClass = `next-${uniqueId}`;

//   return (
//     <div className="relative w-full">
//       {/* 이전 버튼 */}
//       <button
//         className={`${prevClass} hidden desktop:flex absolute z-10 top-[50%] left-0 w-13 h-13 justify-center items-center border border-[rgba(0,0,0,0.1)] rounded-full bg-[rgba(255,255,255,0.9)] shadow-[0_0_8px_0_rgba(0,0,0,0.13)] translate-y-[-50%] translate-x-[-50%] disabled:opacity-0 transition-opacity`}
//         onClick={() => swiperInstance?.slidePrev()}
//       >
//         <img src={leftArrow} alt="이전" />
//       </button>

//       <Swiper
//         modules={[Navigation]}
//         navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
//         onSwiper={setSwiperInstance}
//         spaceBetween={spaceBetween}
//         slidesPerView={slidesPerView}
//         breakpoints={breakpoints}
//         allowTouchMove={true} // 모바일 대응을 위해 true 권장
//       >
//         {items.map((item, index) => (
//           // key는 item.id가 있으면 좋겠지만 없으면 index를 씁니다.
//           <SwiperSlide key={item.id || index}>{renderItem(item)}</SwiperSlide>
//         ))}
//       </Swiper>

//       {/* 다음 버튼 */}
//       <button
//         className={`${nextClass} hidden desktop:flex absolute z-10 top-[50%] right-0 w-13 h-13 justify-center items-center border border-[rgba(0,0,0,0.1)] rounded-full bg-[rgba(255,255,255,0.9)] shadow-[0_0_8px_0_rgba(0,0,0,0.13)] translate-y-[-50%] translate-x-[50%] disabled:opacity-0 transition-opacity`}
//         onClick={() => swiperInstance?.slideNext()}
//       >
//         <img src={rightArrow} alt="다음" />
//       </button>
//     </div>
//   );
// };

// export default DesktopCarousel;

// 1. 제네릭 타입 <T> 정의
interface DesktopCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  breakpoints?: SwiperOptions["breakpoints"];
  slidesPerView?: number | "auto";
  spaceBetween?: number;
  // 아이템의 고유 키를 뽑아내는 함수를 선택적으로 받으면 더 좋습니다.
  getItemKey?: (item: T, index: number) => string | number;
}

// 2. 컴포넌트에 제네릭 적용 (T를 인자로 받는 형태)
const DesktopCarousel = <T,>({
  items,
  renderItem,
  breakpoints,
  slidesPerView = 4,
  spaceBetween = 21,
  getItemKey,
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
        allowTouchMove={true}
      >
        {items.map((item, index) => (
          <SwiperSlide key={getItemKey ? getItemKey(item, index) : index}>
            {renderItem(item, index)}
          </SwiperSlide>
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

export default DesktopCarousel;