import "@app/styles/main.scss";
import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const callback = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", () => setWidth(window.innerWidth));
    return () => {
      window.removeEventListener("resize", callback);
    };
  }, []);

  return width;
};

export default useWindowSize;
