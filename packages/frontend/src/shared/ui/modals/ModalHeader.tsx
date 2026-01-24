interface ModalHeaderProps {
  main: string;
  sub: string;
}

const ModalHeader = ({ main, sub }: ModalHeaderProps) => {
  return (
    <div className="flex flex-col gap-[0.44rem]">
      <h3 className="text-dark text-[0.98rem] font-semibold">{main}</h3>
      <p className="text-[#717182] text-[0.77rem]/[1.09rem]">{sub}</p>
    </div>
  );
};

export default ModalHeader;