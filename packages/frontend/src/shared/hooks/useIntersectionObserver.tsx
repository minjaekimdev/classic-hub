import { useEffect, useRef, useState } from "react";

/*
option은 다음과 같이 설정 가능
{
  root: null,        // 1. 브라우저 화면 기준
  rootMargin: "100px", // 2. 화면 하단 100px 전부터 미리 감지. 뷰포트의 높이를 100px 늘림 (미리 로딩하려고)
  threshold: 0.5     // 3. 요소가 절반은 보여야 '보였다'고 인정
};
*/
export const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    // ref가 아직 연결되지 않았거나, 브라우저가 지원하지 않으면 패스
    if (!ref.current) return;

    // 1. 관찰자(Observer) 생성
    const observer = new IntersectionObserver((entries) => {
      // entries는 관찰 중인 모든 요소를 배열로 줍니다.
      // 우리는 하나만 관찰하므로 첫 번째([0])만 보면 됩니다.
      const entry = entries[0];
      
      // isIntersecting: 화면에 조금이라도 보이면 true, 아예 안 보이면 false
      setIsIntersecting(entry.isIntersecting);
    }, options);

    // 2. 관찰 시작 (Target 지정)
    // observer가 해당 DOM 요소를 참조하게됨
    observer.observe(ref.current);

    // 3. 청소(Cleanup): 컴포넌트가 사라질 때 관찰 중단
    // disconnect를 해주어야 추후 컴포넌트가 언마운트될 때 gc가 수거할 수 있음
    return () => {
      observer.disconnect();
    };
  }, [options]); // 옵션이 바뀌면 관찰자를 새로 만듭니다.

  return { ref, isIntersecting };
};
