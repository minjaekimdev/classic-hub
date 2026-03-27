import React from "react";

interface ButtonProps {
  text: string;
  isConfirm: boolean;
  onConfirm?: (e: any) => void;
}

const Button = ({ text, isConfirm, onConfirm }: ButtonProps) => {
  const style = isConfirm
    ? "bg-main text-white"
    : "bg-white text-[#0a0a0a] border border-[rgba(0,0,0,0.1)]";
  return (
    <button
      className={`text-dark px-088 rounded-button py-[0.44rem] text-[0.77rem]/[1.09rem] font-medium ${style}`}
      onClick={onConfirm}
    >
      {text}
    </button>
  );
};

interface ButtonGroupProps {
  mainText: string;
  onConfirm: (e: any) => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ mainText, onConfirm }) => {
  return (
    <div className="088 flex items-center justify-end gap-[0.44rem]">
      <Button text="취소" isConfirm={false} />
      <Button text={mainText} isConfirm={true} onConfirm={onConfirm} />
    </div>
  );
};

export default ButtonGroup;
