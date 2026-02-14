import formatPriceToKo from "@/shared/utils/formatPriceToKo";
import type { FieldType, SearchValue } from "../types/filter";
import DateTransformer from "@/shared/utils/dateTransformer";
import locationIcon from "@shared/assets/icons/location-blue.svg";
import calendarIcon from "@shared/assets/icons/calendar-purple.svg";
import moneyIcon from "@shared/assets/icons/dollar-orange.svg";

export type FieldTypeKo = "지역" | "가격" | "기간";

interface FilterInterface {
  key: Exclude<FieldType, "keyword">;
  format: (value: SearchValue) => string | undefined;
  isSelected: (value: SearchValue) => boolean;
}

export const FILTER_STRATEGY: Record<FieldTypeKo, FilterInterface> = {
  지역: {
    key: "location",
    format: (v) => v.location,
    isSelected: (v) => !!v.location,
  },
  가격: {
    key: "price",
    format: (v) => formatPriceToKo(v.minPrice, v.maxPrice),
    isSelected: (v) => !!v.minPrice,
  },
  기간: {
    key: "period",
    format: (v) =>
      `${DateTransformer.format(v.startDate, "slash")} ~ ${DateTransformer.format(v.endDate, "slash")}`,
    isSelected: (v) => !!v.startDate,
  },
};

interface FilterFieldArrayItem {
  iconSrc: string;
  label: FieldTypeKo;
  subtitle: string;
}
export const filterFieldTitleArray: FilterFieldArrayItem[] = [
  {
    iconSrc: locationIcon,
    label: "지역",
    subtitle: "가까운 지역의 공연 찾기",
  },
  {
    iconSrc: calendarIcon,
    label: "기간",
    subtitle: "관람하고 싶은 날짜를 선택하세요",
  },
  {
    iconSrc: moneyIcon,
    label: "가격",
    subtitle: "예산에 맞는 공연 찾기",
  },
];
