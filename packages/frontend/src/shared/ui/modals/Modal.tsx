import { createContext, useContext, useState } from "react";

interface ModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  modalData: unknown;
  sendData: (data: unknown) => unknown;
}

const ModalContext = createContext<ModalContextType | null>(null);

interface ModalProviderProps {
  children: React.ReactNode;
}
const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<unknown>(null);

  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };
  const sendData = (data: unknown) => {
    setModalData(data);
  };

  return (
    <ModalContext.Provider value={{ isOpen, open, close, modalData, sendData }}>
      {children}
    </ModalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal should be used within a ModalProvider.");
  }
  return context;
};

const ModalTrigger = ({ children }: { children: React.ReactNode }) => {
  const { open } = useModal();

  return <button onClick={open}>{children}</button>;
};

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

const ModalWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, close } = useModal();

  return (
    isOpen && (
      <div
        className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center p-[6.8rem] bg-[rgba(0,0,0,0.5)]"
        onClick={close}
      >
        <div
          className="rounded-main border border-[rgba(0,0,0,0.1)] shadodw-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] bg-white p-[1.38rem] max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    )
  );
};

interface ModalRootProps {
  children: React.ReactNode;
}

const ModalRoot = ({ children }: ModalRootProps) => {
  return <ModalProvider>{children}</ModalProvider>;
};

const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Wrapper: ModalWrapper,
  Trigger: ModalTrigger,
});

export default Modal;
