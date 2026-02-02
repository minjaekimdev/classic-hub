import { useState } from "react";

const useHeader = () => {
  const [isExpand, setIsExpand] = useState(false);
  const open = () => {
    setIsExpand(true);
  };
  const close = () => {
    setIsExpand(false);
  };

  return {
    isExpand,
    open,
    close,
  };
};

export default useHeader;
