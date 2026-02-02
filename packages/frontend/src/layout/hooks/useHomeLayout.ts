import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { createContext, useEffect, useState, type Ref } from "react";
import useBreakpoint from "@/shared/hooks/useBreakpoint";

interface HomeLayoutContextType {
  ref: Ref<HTMLDivElement>;
  isScrollZero: boolean;
  isExpand: boolean;
  isMobile: boolean;
  setIsActive;
  expand;
  shrink;
  getMarginTop;
}
const HomeLayoutContext = createContext(null);

const useHomeLayout = () => {
  // div가 화면에서 사라지는지, 나타나는지 관찰
  // 화면에 아직 참조된 요소가 보이면 isScrollZero: true, 스크롤 발생 X
  // 보이지 않으면 false, 스크롤 발생 O
  const { ref, isIntersecting: isScrollZero } = useIntersectionObserver();

  const [isActive, setIsActive] = useState(false);
  const handleFilterClick = () => {
    setIsActive(true);
  };

  // 스크롤이 맨 위로 올라갈 떄마다 isFilterActive를 false로 초기화
  useEffect(() => {
    if (isScrollZero) {
      setIsActive(false);
    }
  }, [isScrollZero]);

  // 헤더가 확장되는 경우는 scroll이 맨 위에 있거나 필터가 클릭되는 경우
  const isExpand = isScrollZero || isActive;
  const isMobile = useBreakpoint(740);

  // 모바일일 때와 데스크톱일 때 메인 영역의 상단 여백을 결정
  const getMarginTop = () => {
    let marginTop;
    if (isMobile) {
      marginTop = isScrollZero
        ? "mt-mobile-header-expanded"
        : "mt-mobile-header-shrinked";
    } else {
      marginTop = isScrollZero
        ? "mt-desktop-header-expanded"
        : "mt-desktop-header-shrinked";
    }
    return marginTop;
  };

  return {
    ref,
    isScrollZero,
    isExpand,
    isMobile,
    expand,
    shrink,
    getMarginTop,
  };
};



