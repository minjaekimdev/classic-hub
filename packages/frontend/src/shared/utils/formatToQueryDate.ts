const formatQueryDate = (raw: string) => {
  const year = raw.slice(0, 4);
  const month = raw.slice(4, 6);
  const day = raw.slice(6, 8);
  return `${year}.${month}.${day}`;
}

export default formatQueryDate;