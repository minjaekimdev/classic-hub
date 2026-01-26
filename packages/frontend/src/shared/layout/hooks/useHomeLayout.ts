import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { useEffect, useState } from "react";
import useBreakpoint from "@/shared/hooks/useBreakpoint";

const useHomeLayout = () => {
  // div가 화면에서 사라지는지, 나타나는지 관찰
  // 화면에 아직 참조된 요소가 보이면 isIntersecting: true, 스크롤 발생 X
  // 보이지 않으면 false, 스크롤 발생 O
  const { ref, isIntersecting } = useIntersectionObserver();

  const [isFilterActive, setIsFilterActive] = useState(false);
  const onFilterClick = (isFilterActive: boolean) => {
    setIsFilterActive(isFilterActive);
  };

  const isMobile = useBreakpoint(740);

  // 스크롤이 맨 위로 올라갈 떄마다 isFilterActive를 false로 초기화
  useEffect(() => {
    if (isIntersecting) {
      setIsFilterActive(false);
    }
  }, [isIntersecting]);

  // 헤더가 확장되는 경우는 scroll이 맨 위에 있거나 필터가 클릭되는 경우
  const isExpand = isIntersecting || isFilterActive;

  // 모바일일 때와 데스크톱일 때 메인 영역의 상단 여백을 결정
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
    onFilterClick,
    isExpand,
    getMarginTop,
  };
};

export default useHomeLayout;
