// src/app/providers/ModalProvider/ui/ModalProvider.tsx
import { useState, type ReactNode, Suspense } from "react";
import { ModalContext } from "./useModal";
import type { ModalType, ModalPropsMap } from "./types";
import { MODAL_COMPONENTS } from "./modalRegistry"

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState<{
    type: ModalType;
    props: any;
  } | null>(null);

  const openModal = <K extends ModalType>(type: K, props: ModalPropsMap[K]) => {
    setModalState({ type, props });
  };

  const closeModal = () => setModalState(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalState && (
        <Suspense fallback={null}>
          {/* 현재 활성화된 모달 렌더링 */}
          {(() => {
            const SelectedModal = MODAL_COMPONENTS[modalState.type];
            return <SelectedModal {...modalState.props} onClose={closeModal} />;
          })()}
        </Suspense>
      )}
    </ModalContext.Provider>
  );
};
