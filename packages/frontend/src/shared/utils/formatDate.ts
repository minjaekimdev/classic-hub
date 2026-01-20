const formatDateRange = (startDate: string, endDate: string) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const startDayIdx = new Date(startDate.replaceAll(".", "-")).getDay();
  const endDayIdx = new Date(endDate.replaceAll(".", "-")).getDay();

  if (startDate === endDate) {
    return `${startDate}(${days[startDayIdx]})`;
  }
  return `${startDate}(${days[startDayIdx]}) ~ ${endDate}(${days[endDayIdx]})`;
};

export default formatDateRange;
