// calculate no. of days b/w 2 dates in 'YYYY-MM-DD' format
export function calculateDaysBetweenDates(earlierDate: string, laterDate: string) {
  const firstDate = new Date(earlierDate);
  firstDate.setHours(1, 0, 0, 0);

  const secondDate = new Date(laterDate);
  secondDate.setHours(1, 0, 0, 0);

  const diffInMs = secondDate.getTime() - firstDate.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
}

// calculate days b/w 2 days of week
export function calculateDaysBetweenDOW(earlierDateDOW: number, laterDateDOW: number) {
  if (earlierDateDOW === laterDateDOW) {
    return 7;
  }
  if (earlierDateDOW < laterDateDOW) {
    return laterDateDOW - earlierDateDOW;
  }
  // case where earlierDateDow > laterDateDOW
  return 7 - earlierDateDOW + laterDateDOW;
}
