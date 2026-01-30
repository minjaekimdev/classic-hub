import supabase from "@/app/api/supabase-client";
import { mapToHomePerformance } from "@/features/performance/mappers/home-performance-mapper";
import type { HomePerformance } from "@classic-hub/shared/types/client";
import { useEffect, useState } from "react";

// Date 형식의 날짜 데이터를 DB에 맞는 YYYY.MM.DD 형식으로 변환
const getParsedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

const useWeekendPerformance = () => {
  const [performances, setPerformances] = useState<HomePerformance[]>([]);

  const now = new Date();
  const nowDay = now.getDay();
  const startDate = new Date(now);
  const endDate = new Date(now);

  // 월요일 ~ 토요일이라면 startDate, endDate를 계산
  // 일요일이라면 오늘이 startDate이자 endDate

  if (nowDay !== 0) {
    startDate.setDate(now.getDate() + (6 - nowDay));
    endDate.setDate(now.getDate() + (7 - nowDay));
  }

  const parsedStartDate = getParsedDate(startDate);
  const parsedEndDate = getParsedDate(endDate);

  useEffect(() => {
    const fetchPerformances = async () => {
      const { error, data } = await supabase
        .from("performances")
        .select("*")
        .or(
          `and(period_from.gte."${parsedStartDate}",period_from.lte."${parsedEndDate}"),and(period_to.gte."${parsedStartDate}",period_to.lte."${parsedEndDate}"),and(period_from.lte."${parsedStartDate}",period_to.gte."${parsedEndDate}")`,
        );

      if (error) {
        console.log("[FETCH_FAIL] WeekendPerformance fetch failed", error);
      } else {
        setPerformances(data.map((item) => mapToHomePerformance(item)));
      }
    };
    fetchPerformances();
  }, [parsedStartDate, parsedEndDate]);

  return performances;
};

export default useWeekendPerformance;
