import { useEffect, useState, type ReactNode } from "react";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import Header from "./Header";
import Footer from "@/shared/layout/Footer";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  // div가 화면에서 사라지는지, 나타나는지 관찰
  const { ref, isIntersecting } = useIntersectionObserver();
  // 화면에 아직 참조된 요소가 보이면 isIntersecting: true, 스크롤 발생 X
  // 보이지 않으면 false, 스크롤 발생 O
  const [isFilterActive, setIsFilterActive] = useState(false);
  const changeFilterState = (isFilterActive: boolean) => {
    setIsFilterActive(isFilterActive);
  };

  // 스크롤이 맨 위로 올라갈 떄마다 isFilterActive를 초기화
  // 초기화하지 않으면 스크롤을 내려도 필터가 확장된 상태가 유지됨
  useEffect(() => {
    if (isIntersecting) {
      setIsFilterActive(false);
    }
  }, [isIntersecting]);
  const isExpand = isIntersecting || isFilterActive;

  // marginTop은 스크롤 상태(isIntersecting)가 변할 때만 변화
  // filterActive = true일 때마다 변경하면 스크롤을 내린 상태에서도 main영역의 위치가 변경됨
  const marginTop = isIntersecting
    ? "mt-header-expanded"
    : "mt-header-shrinked";

  return (
    <>
      <Header isExpand={isExpand} onChangeFilterState={changeFilterState} />
      {isFilterActive && (
        <div className="fixed top-0 left-0 z-15 bg-[rgba(0,0,0,0.3)] w-full h-full"></div>
      )}
      <div ref={ref} className="h-1 bg-transparent"></div>
      <main className={`pt-6 pb-[6.12rem] ${marginTop}`}>{children}</main>
      <Footer />
    </>
  );
};

export default HomeLayout;
