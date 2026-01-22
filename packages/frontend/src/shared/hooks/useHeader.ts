import { useEffect, useRef, useState } from "react";
import type { filterCategoryObjType } from "../../features/filter/model/filter";
import useClickOutside from "./useClickOutside";

const useHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false); // window.scrollY > 0이면 isScrolled = true, 0이면 false
  const [isFilterClicked, setIsFilterClicked] = useState(false); // 축소된 필터를 클릭한 경우 true
  const [filterValue, setFilterValue] = useState<filterCategoryObjType>({
    searchText: "",
    location: "지역",
    price: "가격",
    date: "날짜",
  });
  const headerRef = useRef<HTMLDivElement | null>(null);

  // 헤더가 확장되는 경우는 스크롤 위치가 0이거나 축소된 필터를 클릭한 경우
  const headerExpand = !isScrolled || isFilterClicked;
  const headerMarginBottom = headerExpand ? "1.5rem" : "0";

  // 스크롤 발생 시 헤더 상태 최신화
  useEffect(() => {
    const scrollHandler = () => {
      if (window.scrollY === 0) {
        setIsScrolled(false);
      } else {
        setIsScrolled(true);
      }
      setIsFilterClicked(false); // 수동 열림 초기화
    };
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [setIsScrolled]);

  // 헤더의 외부를 클릭했을 때 닫기
  useClickOutside(headerRef as React.RefObject<HTMLElement>, () =>
    setIsFilterClicked(false)
  );
  return {
    isFilterClicked,
    headerExpand,
    headerRef,
    headerMarginBottom,
    filterValue,
    setIsFilterClicked,
    setFilterValue,
  };
};

export default useHeader;
