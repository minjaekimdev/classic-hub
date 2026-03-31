import { type ComponentType } from "react";
import { BOTTOM_SHEET_TYPES, type BottomSheetPropsMap } from "./types";
import SearchBottomSheet from "@/features/filter/ui/mobile/SearchBottomSheet";
import FilterBottomSheet from "@/features/filter/ui/mobile/FilterBottomSheet";

// Registry의 타입을 강제하여 누락된 모달이 없도록 함
export const BOTTOM_SHEET_COMPONENTS: {
  [K in keyof BottomSheetPropsMap]: ComponentType<BottomSheetPropsMap[K]>;
} = {
  [BOTTOM_SHEET_TYPES.SEARCH]: SearchBottomSheet as any,
  [BOTTOM_SHEET_TYPES.RESULT]: FilterBottomSheet as any,
};
