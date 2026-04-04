import dayjs from "dayjs";

const getWeekendDate = () => {
  const today = dayjs();
  const isSunday = today.day() === 0; // 0은 일요일

  // 일요일이면 오늘(일요일) 그대로,
  // 월~토요일이면 '이번 주 토요일(6)'로 설정
  const startDate = isSunday ? today : today.day(6);

  // 일요일이면 오늘(일요일) 그대로,
  // 월~토요일이면 '이번 주 토요일'에서 하루 더하기(+1 day = 일요일)
  const endDate = isSunday ? today : startDate.add(1, "day");

  return {
    startDate,
    endDate,
  };
};

export default getWeekendDate;
