import { useEffect } from "react";

interface UseScrollProps {
  callback: React.Dispatch<React.SetStateAction<boolean>>
}

const useScroll = ({callback}: UseScrollProps) => {
  useEffect(() => {
    const scrollHandler = () => {
      if (window.scrollY > 0) {
        callback(true);
      } else {
        callback(false);
      }
    };
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [callback]);
};

export default useScroll;
