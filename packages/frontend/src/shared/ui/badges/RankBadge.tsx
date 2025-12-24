interface CardBadgeProps {
  children: React.ReactNode;
  className?: string;
}

const CardBadge = ({ children, className }: CardBadgeProps) => {
  return (
    <div
      className={`absolute z-10 shrink-0 flex justify-center items-center rounded-full p-[0.47rem_0.65rem_0.38rem] bg-linear-to-b from-[#cc0000] to-[#990000] text-white text-[0.77rem]/[1.09rem] font-bold ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};

export default CardBadge;
