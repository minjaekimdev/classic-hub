import type { BookingLink } from "@classic-hub/shared/types/common";

// 모든 모달의 이름을 상수로 정의
export const MODAL_TYPES = {
  BOOKING: "BOOKING",
  FEEDBACK: "FEEDBACK",
  CONTACT: "CONTACT",
} as const;

export type ModalType = typeof MODAL_TYPES[keyof typeof MODAL_TYPES]

// 각 모달이 받을 Props의 타입을 정의
export interface ModalPropsMap {
  [MODAL_TYPES.BOOKING]: {
    bookingLinks: BookingLink[] | null;
  };
  [MODAL_TYPES.FEEDBACK]: object;
  [MODAL_TYPES.CONTACT]: object;
}