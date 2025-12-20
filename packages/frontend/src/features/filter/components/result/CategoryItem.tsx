// onSelect은 단순 콜백으로 처리합니다
import CountBadge from "./CountBadge";

interface CategoryItemProps {
  text: string;
  selected: React.ReactNode;
  count?: number;
  onSelect: (value: string) => void;
}

const CategoryItem = ({ text, selected, count, onSelect }: CategoryItemProps) => {
  const style =
    selected === text
      ? "border-main text-main"
      : "border-[#e5e7eb] text-[#0a0a0a]";
  return (
    <div
      className={`flex justify-between rounded-[0.55rem] border p-[0.72rem] ${style}`}
      onClick={() => onSelect(text)}
    >
      <span className="text-[0.88rem]/[1.31rem]">{text}</span>
      {count && <CountBadge count={count} /> }
    </div>
  );
};

export default CategoryItem;