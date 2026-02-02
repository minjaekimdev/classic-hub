import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";

const useHomeLayoutMobile = () => {
  const { ref, isIntersecting: isScrollZero } = useIntersectionObserver();

  const marginTop = isScrollZero
    ? "mt-mobile-header-expanded"
    : "mt-mobile-header-shrinked";

  return {
    ref,
    isScrollZero,
    marginTop,
  };
};

export default useHomeLayoutMobile;
