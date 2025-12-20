interface CountBadgeProps {
  count: number;
}

const CountBadge = ({ count }: CountBadgeProps) => {
  return (
    <span className="flex justify-center items-center bg-gray-100 w-7 h-[1.22rem] rounded-[0.42rem] text-[#030213] text-[0.66rem]/[0.88rem] font-medium">
      {count}
    </span>
  );
};

export default CountBadge;
