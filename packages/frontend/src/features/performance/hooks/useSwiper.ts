import { useState } from "react";
import { Swiper as SwiperType } from "swiper";

const useSwiper = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const updateNavigationState = (swiper: SwiperType) => {
    swiper.update();
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };
  return {
    swiperInstance,
    setSwiperInstance,
    isBeginning,
    isEnd,
    updateNavigationState,
  };
};

export default useSwiper;
