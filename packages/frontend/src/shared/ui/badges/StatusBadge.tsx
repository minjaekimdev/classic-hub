import type { CSSProperties } from "react";

interface Props {
  text: string;
  style: CSSProperties;
}
const StatusBadge = ({ text, style }: Props) => {
  return (
    <div
      className={`rounded-button px-033 pt-[0.14rem] pb-[0.2rem] shadow ${style}`}
    >
      <span className="">{text}</span>
    </div>
  );
};

export default StatusBadge;
