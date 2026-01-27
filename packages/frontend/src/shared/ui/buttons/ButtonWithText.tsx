interface ButtonProps {
  children: React.ReactNode;
  handler: () => void;
}
const ActionButton = ({ children, handler }: ButtonProps) => {
  return (
    <button
      className="flex-1 flex justify-center items-center border border-[rgba(0,0,0,0.1)] rounded-main"
      onClick={handler}
    >
      <div className="flex items-center gap-[0.44rem] desktop:gap-[0.7rem] text-dark text-[0.77rem]/[1.09rem]">
        {children}
      </div>
    </button>
  );
};

export default ActionButton;