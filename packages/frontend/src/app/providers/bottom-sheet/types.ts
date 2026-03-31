export const BOTTOM_SHEET_TYPES = {
  SEARCH: "SEARCH",
  RESULT: "RESULT",
} as const;

export type BottomSheetType = typeof BOTTOM_SHEET_TYPES[keyof typeof BOTTOM_SHEET_TYPES];

export interface BottomSheetPropsMap {
  [BOTTOM_SHEET_TYPES.SEARCH]: object;
  [BOTTOM_SHEET_TYPES.RESULT]: object;
}