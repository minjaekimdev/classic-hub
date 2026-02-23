import { useFilter } from "@/features/filter/contexts/filter-context";
import useBreakpoint from "@/shared/hooks/useBreakpoint";

const useDesktopGridStyle = () => {
  const { isOpen } = useFilter();

  const isDesktop = useBreakpoint(1280);
  const isMobile = useBreakpoint(960);

  let gridStyle;
  // 뷰포트 너비와 필터 열림 여부를 확인하여 그리드 열 개수 설정
  if (!isMobile && isDesktop) {
    gridStyle = isOpen ? "grid-cols-2" : "grid-cols-3";
  } else {
    gridStyle = "grid-cols-4";
  }

  return gridStyle;
};

export default useDesktopGridStyle;
