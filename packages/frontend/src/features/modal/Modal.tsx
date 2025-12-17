import React from "react";

interface ModalProps {
  children: React.ReactNode;
}

const Modal = ({ children }: ModalProps) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center p-[6.8rem] bg-[rgba(0,0,0,0.5)]">
      <div className="rounded-[0.55rem] border border-[rgba(0,0,0,0.1)] shadodw-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] bg-white p-[1.38rem] max-h-full">
        {children}
      </div>
    </div>
  );
};

export default Modal;
