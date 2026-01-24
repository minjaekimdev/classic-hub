import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import useIsMobile from "@/shared/hooks/useIsMobile";
import { useEffect, useState } from "react";

const useHomeLayout = () => {
  // div가 화면에서 사라지는지, 나타나는지 관찰
  // 화면에 아직 참조된 요소가 보이면 isIntersecting: true, 스크롤 발생 X
  // 보이지 않으면 false, 스크롤 발생 O
  const { ref, isIntersecting } = useIntersectionObserver();
  
  const [isFilterActive, setIsFilterActive] = useState(false);
  const changeFilterState = (isFilterActive: boolean) => {
    setIsFilterActive(isFilterActive);
  };

  const isMobile = useIsMobile(740);

  // 스크롤이 맨 위로 올라갈 떄마다 isFilterActive를 초기화
  // 초기화하지 않으면 스크롤을 내려도 필터가 확장된 상태가 유지됨
  useEffect(() => {
    if (isIntersecting) {
      setIsFilterActive(false);
    }
  }, [isIntersecting]);
  const isExpand = isIntersecting || isFilterActive;

  const getMarginTop = () => {
    let marginTop;
    if (isMobile) {
      marginTop = isIntersecting
        ? "mt-mobile-header-expanded"
        : "mt-mobile-header-shrinked";
    } else {
      marginTop = isIntersecting
        ? "mt-desktop-header-expanded"
        : "mt-desktop-header-shrinked";
    }
    return marginTop;
  };

  return {
    ref,
    isIntersecting,
    isFilterActive,
    isMobile,
    setIsFilterActive,
    changeFilterState,
    isExpand,
    getMarginTop
  }
}

export default useHomeLayout;