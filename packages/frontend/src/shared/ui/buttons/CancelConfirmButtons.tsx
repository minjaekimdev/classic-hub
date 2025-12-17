import React from "react";

interface ButtonProps {
  text: string;
  isConfirm: boolean;
}

const Button = ({ text, isConfirm }: ButtonProps) => {
  const style = isConfirm
    ? "bg-main text-white"
    : "bg-white text-[#0a0a0a] border border-[rgba(0,0,0,0.1)]";
  return (
    <button
      className={`text-[#0a0a0a] text-[0.77rem]/[1.09rem] font-medium px-[0.88rem] py-[0.44rem] rounded-[0.42rem] ${style}`}
    >
      {text}
    </button>
  );
};

interface ButtonGroupProps {
  mainText: string;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ mainText }) => {
  return (
    <div className="flex justify-end items-center gap-[0.44rem] mt-[0.88rem]">
      <Button text="취소" isConfirm={false} />
      <Button text={mainText} isConfirm={true} />
    </div>
  );
};

export default ButtonGroup;
