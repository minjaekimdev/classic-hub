const formatDateRange = (startDate: string | null, endDate: string | null) => {
  if (startDate === null || endDate === null) return "";
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const startDayIdx = new Date(startDate).getDay();
  const endDayIdx = new Date(endDate).getDay();

  const parsedStartDate = startDate.replaceAll("-", ".");
  const parsedEndDate = endDate.replaceAll("-", ".");

  if (startDate === endDate) {
    return `${parsedStartDate}(${days[startDayIdx]})`;
  }
  return `${parsedStartDate}(${days[startDayIdx]}) ~ ${parsedEndDate}(${days[endDayIdx]})`;
};

export default formatDateRange;
