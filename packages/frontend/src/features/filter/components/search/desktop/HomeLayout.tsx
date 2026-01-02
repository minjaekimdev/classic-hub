import { useEffect, useState, type ReactNode } from 'react';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';
import Header from './Header';

const HomeLayout = ({children}: {children: ReactNode}) => {
  // div가 화면에서 사라지는지, 나타나는지 관찰
  const {ref, isIntersecting} = useIntersectionObserver();
  // 화면에 아직 참조된 요소가 보이면 isIntersecting: true, 스크롤 발생 X
  // 보이지 않으면 false, 스크롤 발생 O
  const [isFilterActive, setIsFilterActive] = useState(false);
  const changeFilterState = (isFilterActive: boolean) => {
    setIsFilterActive(isFilterActive);
  }
  
  // 스크롤이 맨 위로 올라갈 떄마다 isFilterActive를 초기화
  // 초기화하지 않으면 스크롤을 내려도 필터가 확장된 상태가 유지된다
  useEffect(() => {
    if (isIntersecting) {
      setIsFilterActive(false);
    }
  }, [isIntersecting]);
  const isExpand = isIntersecting || isFilterActive;

  return (
    <>
      <Header isExpand={isExpand} changeFilterState={changeFilterState}/>
      <div ref={ref} className="h-1 bg-black"></div>
      {children}
    </>
  );
};

export default HomeLayout;