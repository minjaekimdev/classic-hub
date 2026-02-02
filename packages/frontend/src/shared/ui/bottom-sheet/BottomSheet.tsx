import React, { useState, createContext, useContext, useEffect } from "react";

interface BottomSheetContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}
const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

interface BottomSheetProviderProps {
  children: React.ReactNode;
}
const BottomSheetProvider = ({ children }: BottomSheetProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  return (
    <BottomSheetContext.Provider value={{ isOpen, open, close }}>
      {children}
    </BottomSheetContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet should be used within a ModalProvider.");
  }
  return context;
};

interface WrapperProps {
  children: React.ReactNode;
}
const BottomSheetWrapper = ({ children }: WrapperProps) => {
  const { isOpen, close } = useBottomSheet();
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-(--z-modal-overlay) transition-opacity"
          onClick={close}
        >
          <div className="fixed bottom-0 left-0 right-0 bg-white z-(--z-modal) rounded-t-2xl shadow-xl max-h-[90vh] flex flex-col transition-transform duration-300 transform translate-y-0">
            {children}
          </div>
        </div>
      )}
    </>
  );
};

const BottomSheetTrigger = ({ children }: { children: React.ReactNode }) => {
  const { open } = useBottomSheet();
  return <div onClick={open}>{children}</div>;
};

const BottomSheetRoot = ({ children }: { children: React.ReactNode }) => {
  return <BottomSheetProvider>{children}</BottomSheetProvider>;
};

const BottomSheet = Object.assign(BottomSheetRoot, {
  Trigger: BottomSheetTrigger,
  Wrapper: BottomSheetWrapper,
});

export default BottomSheet;
