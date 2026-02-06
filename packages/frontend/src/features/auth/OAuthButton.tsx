import React from "react";

interface OAuthButtonProps {
  iconSrc: string;
  children: React.ReactNode;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({ iconSrc, children }) => {
  return (
    <button
      className="
        w-full bg-white 
        border border-black/10 rounded-main
        pt-[0.47rem] pb-[0.38rem] px-0
        text-dark text-[0.77rem] leading-[1.09rem] font-medium
      "
    >
      <div className="flex items-center justify-center gap-[0.88rem]">
        <img src={iconSrc} alt="" />
        {children}
      </div>
    </button>
  );
};

export default OAuthButton;