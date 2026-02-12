const formatDateQueryToFilter = (startDate: string, endDate: string) => {
  const formatDate = (date: string) => {
    return `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(6, 8)}`;
  }

  const formattedStartDate = formatDate(startDate);

  if (startDate === endDate) {
    return formattedStartDate;
  }



  const formattedEndDate = formatDate(endDate);
  return `${formattedStartDate} ~ ${formattedEndDate}`

};

export default formatDateQueryToFilter;
