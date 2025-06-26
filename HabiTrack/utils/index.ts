export const zeroPad = (num: number) => (num < 10 ? `0${num}` : num.toString());

export const paddedTimeFromDate = (date: Date | null): string | null => {
  if (!date) return null;
  const hours = zeroPad(date.getHours());
  const minutes = zeroPad(date.getMinutes());
  return `${hours}${minutes}`;
};

export const dateFromPaddedTime = (paddedTime: string | null): Date | null => {
  if (!paddedTime) return null;
  const hours = parseInt(paddedTime.slice(0, 2), 10);
  const minutes = parseInt(paddedTime.slice(2, 4), 10);
  const date = new Date();
  date.setHours(hours, minutes);
  return date;
};
