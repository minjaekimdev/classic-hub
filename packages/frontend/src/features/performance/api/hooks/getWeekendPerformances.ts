import supabase from "@/app/api/supabase-client";
import type { DBPerformance } from "@classic-hub/shared/types/database";
import dayjs from "dayjs";

export const getWeekendDate = () => {
  const today = dayjs();
  const isSunday = today.day() === 0; // 0은 일요일

  // 일요일이면 오늘(일요일) 그대로,
  // 월~토요일이면 '이번 주 토요일(6)'로 설정
  const startDate = isSunday ? today : today.day(6);

  // 일요일이면 오늘(일요일) 그대로,
  // 월~토요일이면 '이번 주 토요일'에서 하루 더하기(+1 day = 일요일)
  const endDate = isSunday ? today : startDate.add(1, "day");

  const parsedStartDate = startDate.format("YYYY.MM.DD");
  const parsedEndDate = endDate.format("YYYY.MM.DD");

  return {
    parsedStartDate,
    parsedEndDate,
  };
};

export const getWeekendPerformances = async () => {
  const { parsedStartDate, parsedEndDate } = getWeekendDate();

  const { error, data } = await supabase
    .from("performances")
    .select("*")
    .or(
      `and(period_from.gte."${parsedStartDate}",period_from.lte."${parsedEndDate}"),and(period_to.gte."${parsedStartDate}",period_to.lte."${parsedEndDate}"),and(period_from.lte."${parsedStartDate}",period_to.gte."${parsedEndDate}")`,
    )
    .returns<DBPerformance[]>();

  if (error) {
    throw new Error(
      error.message || "[FETCH_FAIL] Home Weekend Ranking data fetch failed",
    );
  }

  return data;
};
