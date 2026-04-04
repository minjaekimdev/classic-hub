import { useEffect } from "react";
import { useModal } from "./useModal";

export const ModalWrapper = ({ children }: { children: React.ReactNode }) => {
  const { closeModal } = useModal();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-99 flex justify-center items-center px-10 bg-[rgba(0,0,0,0.5)]"
      onClick={closeModal}
    >
      {children}
    </div>
  );
};