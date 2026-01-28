import { createContext, useContext, useEffect, useState } from "react";

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

export const ModalWrapper = ({ children }: { children: React.ReactNode }) => {
  const { close } = useModal();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center p-[6.8rem] bg-[rgba(0,0,0,0.5)]"
      onClick={(e) => {
        close();
      }}
    >
      {children}
    </div>
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

  return <div onClick={open}>{children}</div>;
};

interface ModalRootProps {
  children: React.ReactNode;
}

const ModalRoot = ({ children }: ModalRootProps) => {
  return <ModalProvider>{children}</ModalProvider>;
};

const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Wrapper: ModalWrapper,
});

export default Modal;
