export enum DaysOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

// based on js Date.getDay() where 0=Sunday, ..., 6=Saturday
export const daysOfWeekArray: DaysOfWeek[] = [
  DaysOfWeek.Sunday,
  DaysOfWeek.Monday,
  DaysOfWeek.Tuesday,
  DaysOfWeek.Wednesday,
  DaysOfWeek.Thursday,
  DaysOfWeek.Friday,
  DaysOfWeek.Saturday,
];
