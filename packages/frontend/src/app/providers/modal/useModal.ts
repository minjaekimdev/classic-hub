// src/shared/lib/modal/useModal.ts
import { createContext, useContext } from 'react';
import type { ModalPropsMap, ModalType } from './types';

interface ModalContextType {
  // K extends ModalType을 통해 키에 맞는 props만 허용
  openModal: <K extends ModalType>(type: K, props: ModalPropsMap[K]) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
};