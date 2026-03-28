import { type ComponentType } from "react";
import { MODAL_TYPES, type ModalPropsMap } from "./types";
import BookingModal from "@/features/booking/BookingModal";
import FeedbackModal from "@/features/feedback/FeedbackModal";

// Registry의 타입을 강제하여 누락된 모달이 없도록 함
export const MODAL_COMPONENTS: {
  [K in keyof ModalPropsMap]: ComponentType<ModalPropsMap[K]>;
} = {
  [MODAL_TYPES.BOOKING]: BookingModal as any,
  [MODAL_TYPES.FEEDBACK]: FeedbackModal as any,
};
