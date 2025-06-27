import { calculateDaysBetweenDates } from '@/utils/dateUtils';
import { DatabaseService } from './DatabaseService';

export class StatisticService {
  static #instance: StatisticService;
  private dbService: DatabaseService;

  private constructor(dbService: DatabaseService) {
    this.dbService = dbService;
  }

  public static get instance() {
    return StatisticService.#instance;
  }

  public static init(dbService: DatabaseService): StatisticService {
    if (!StatisticService.#instance) {
      StatisticService.#instance = new StatisticService(dbService);
    }
    return StatisticService.#instance;
  }

  public calculateExpectedDays(startDate: string, freq: number[]): number {
    // 1. Calculate expectedDays (startWeekExpectedDays + thisWeekExpectedDays + weeksBetweenExpectedDays)
    const startDay = new Date(startDate).getDay();
    const today = new Date();
    const todayDay = today.getDay();

    // edge case: startDate and todayDate fall within the same calendar week
    // find the following sunday after startDate date
    const startOfWeeksBetweenDate = new Date(startDate);
    const daysUntilFollowingSunday = startDay === 0 ? 7 : 7 - startDay;
    startOfWeeksBetweenDate.setDate(startOfWeeksBetweenDate.getDate() + daysUntilFollowingSunday);
    // if today's date < startOfWeeksBetweenDate, then startDate and todayDate fall within the same calendar week
    const sameCalendarWeek =
      today.toISOString().split('T')[0] < startOfWeeksBetweenDate.toISOString().split('T')[0];
    if (sameCalendarWeek) {
      // if in same calendar week, only count days b/w createdAt and today
      return freq.filter((day) => day >= startDay && day <= todayDay).length;
    }

    // 1.1 startWeekExpectedDays calculation
    const startWeekExpectedDays = freq.filter((day) => day >= startDay).length;

    // 1.2 thisWeekExpectedDays calculation
    const thisWeekExpectedDays = freq.filter((day) => day <= todayDay).length;

    // 1.3 weeksBetweenExpectedDays calculation
    // find the saturday preceding today's date
    const endOfWeeksBetweenDate = new Date(today);
    const daysSincePreviousSaturday = todayDay === 6 ? 7 : todayDay + 1;
    endOfWeeksBetweenDate.setDate(endOfWeeksBetweenDate.getDate() - daysSincePreviousSaturday);
    // calculate no. of weeks b/w these 2 dates
    const weeksBetween = Math.ceil(
      calculateDaysBetweenDates(
        startOfWeeksBetweenDate?.toJSON()?.split('T')[0],
        endOfWeeksBetweenDate?.toJSON()?.split('T')[0],
      ) / 7,
    );

    // 1.4 calculate expectedDays
    const expectedNoOfDays =
      startWeekExpectedDays + weeksBetween * freq.length + thisWeekExpectedDays;
    return expectedNoOfDays;
  }

  public calcActualDaysCompleted(
    startDate: string,
    completedAtData: { completedAt: string }[],
  ): number {
    // normalise startDate to yyyy-mm-dd
    const normalizedStartDate = startDate.split('T')[0];
    return completedAtData.filter(({ completedAt }) => {
      // normalise completedAt to yyyy-mm-dd
      const normalizedCompletedAt = completedAt.split('T')[0];
      return normalizedCompletedAt >= normalizedStartDate;
    }).length;
  }
  /**
   * Calculates habit statistics based on the creation date, frequency, and completed dates.
   * @param createdAtDate - The date when the habit was created in yyyy-mm-dd format
   * @param freq - An array that representing the days of the week the habit is to be completed on (0 for Sunday, 1 for Monday, etc).
   * @param completedAtData - An array of objects containing completedAt dates in yyyy-mm-dd
   *
   * @return A function that takes in a **(mode: 'week' | 'month' | 'all')** of timeframe calculation and perform the calculation. All modes would not include days before its creation.
   *    - weekExpectedNoOfDays for this habit (calculated since Sunday of this week) (This Week)
   *    - monthExpectedNoOfDays for this habit (calculated since 1st of this month) (This Month)
   *    - allExpectedNoOfDays for this habit (calculated since createdAtDate) (All Time)
   */
  public calcHabitStatistics(
    createdAtDate: string,
    freq: number[],
    completedAtData: { completedAt: string }[],
  ): (mode: 'week' | 'month' | 'all') => {
    startDate: string;
    expectedNoOfDays: number;
    actualNoOfDays: number;
  } {
    return (mode: 'week' | 'month' | 'all') => {
      let startDate = new Date();
      const today = new Date();
      switch (mode) {
        case 'week':
          startDate.setDate(today.getDate() - today.getDay());
          break;
        case 'month':
          startDate.setMonth(today.getMonth(), 1);
          break;
        case 'all':
          startDate = new Date(createdAtDate);
          break;
        default:
          // do nothing, uses today's date
          break;
      }
      let startDateStr = startDate.toISOString().split('T')[0];
      // Ensure startDate is not before createdAtDate
      if (startDateStr < createdAtDate) {
        startDateStr = createdAtDate;
      }

      return {
        startDate: startDateStr,
        expectedNoOfDays: this.calculateExpectedDays(startDateStr, freq),
        actualNoOfDays: this.calcActualDaysCompleted(startDateStr, completedAtData),
      };
    };
  }
}
