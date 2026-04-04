import { useFilter } from "@/features/filter/contexts/filter-context";
import useBreakpoint from "@/shared/hooks/useBreakpoint";

const useDesktopGridStyle = () => {
  const { isOpen } = useFilter();

  // useBreakpoint(n)은 너비가 n 이하일 때 true를 반환함
  const isTabletSize = useBreakpoint(1280); // 1280px 이하인가?

  // 1. 상태를 하나의 키로 조합 (작은 순서대로 체크하는 것이 안전함)
  const deviceState = isTabletSize ? "tablet" : "desktop";

  const filterState = isOpen ? "open" : "closed";

  // 2. 설정 맵 정의 (가독성이 좋아지고 수정이 쉬워짐)
  const GRID_MAP = {
    desktop: { open: "grid-cols-4", closed: "grid-cols-5" },
    tablet: { open: "grid-cols-3", closed: "grid-cols-4" },
  } as const;

  // 3. 값 반환
  return GRID_MAP[deviceState][filterState];
};

export default useDesktopGridStyle;
