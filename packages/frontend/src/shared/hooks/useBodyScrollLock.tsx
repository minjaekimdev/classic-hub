import { useEffect } from "react";

const useBodyScrollLock = () => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    // 잠금
    document.body.style.overflow = "hidden";

    // 복구 (원래 설정했던 값으로 되돌림)
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
};

export default useBodyScrollLock;
