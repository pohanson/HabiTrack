import {
  calculateDaysBetweenDates,
  calculateDaysBetweenDOW,
  dateFromPaddedTime,
  getDayOfWeekString,
  getExpectedDates,
  getNiceDateString,
  paddedTimeFromDate,
  reorderDateString,
  zeroPad,
} from '../dateUtils';

describe('dateUtils', () => {
  describe('calculateDaysBetweenDates', () => {
    it('calculate no. of days b/w 2 dates in YYYY-MM-DD format', () => {
      expect(calculateDaysBetweenDates('2025-01-01', '2025-01-10')).toBe(9);
      expect(calculateDaysBetweenDates('2025-01-02', '2025-01-22')).toBe(20);
      expect(calculateDaysBetweenDates('2025-02-27', '2025-03-01')).toBe(2);
      expect(calculateDaysBetweenDates('2024-12-27', '2025-01-02')).toBe(6);
    });
  });

  describe('calculateDaysBetweenDOW', () => {
    it('calculate days b/w 2 days of week', () => {
      expect(calculateDaysBetweenDOW(0, 0)).toBe(7);
      expect(calculateDaysBetweenDOW(0, 4)).toBe(4);
      expect(calculateDaysBetweenDOW(1, 3)).toBe(2);
      expect(calculateDaysBetweenDOW(2, 0)).toBe(5);
      expect(calculateDaysBetweenDOW(5, 1)).toBe(3);
      expect(calculateDaysBetweenDOW(6, 2)).toBe(3);
    });
  });

  describe('getDayOfWeekString', () => {
    it('should return the correct day of the week string', () => {
      expect(getDayOfWeekString(0)).toBe('Sun');
      expect(getDayOfWeekString(1)).toBe('Mon');
      expect(getDayOfWeekString(2)).toBe('Tue');
      expect(getDayOfWeekString(3)).toBe('Wed');
      expect(getDayOfWeekString(4)).toBe('Thu');
      expect(getDayOfWeekString(5)).toBe('Fri');
      expect(getDayOfWeekString(6)).toBe('Sat');
      expect(getDayOfWeekString(7)).toBe('Invalid DOW'); // out of range
    });
  });

  describe('getNiceDateString', () => {
    it('get "[day] [month], [DOW]" format out of "YYYY-MM-DD" string', () => {
      expect(getNiceDateString('2025-01-01')).toBe('1 Jan, Wed');
      expect(getNiceDateString('2025-02-05')).toBe('5 Feb, Wed');
      expect(getNiceDateString('2023-03-04')).toBe('4 Mar, Sat');
      expect(getNiceDateString('2024-04-25')).toBe('25 Apr, Thu');
      expect(getNiceDateString('2028-05-15')).toBe('15 May, Mon');
      expect(getNiceDateString('2026-06-20')).toBe('20 Jun, Sat');
      expect(getNiceDateString('2027-07-18')).toBe('18 Jul, Sun');
      expect(getNiceDateString('2025-08-29')).toBe('29 Aug, Fri');
      expect(getNiceDateString('2024-09-30')).toBe('30 Sep, Mon');
      expect(getNiceDateString('2023-10-13')).toBe('13 Oct, Fri');
      expect(getNiceDateString('2022-11-22')).toBe('22 Nov, Tue');
      expect(getNiceDateString('2024-12-31')).toBe('31 Dec, Tue');
    });
  });

  describe('reorderDateString', () => {
    it('convert from YYYY-MM-DD to DD-MM-YYYY', () => {
      expect(reorderDateString('2025-01-01')).toBe('01-01-2025');
      expect(reorderDateString('2024-12-31')).toBe('31-12-2024');
      expect(reorderDateString('2023-07-04')).toBe('04-07-2023');
      expect(reorderDateString('2022-11-22')).toBe('22-11-2022');
    });
  });

  describe('getExpectedDates', () => {
    it('gets an array of expected dates for a habit in YYYY-MM-DD format (input freq array must be sorted)', () => {
      expect(getExpectedDates('2025-01-01', '2025-01-15', [1, 2, 5])).toEqual([
        '2025-01-03',
        '2025-01-06',
        '2025-01-07',
        '2025-01-10',
        '2025-01-13',
        '2025-01-14',
      ]);
      // edge case: include start and end date
      expect(getExpectedDates('2024-02-03', '2024-02-10', [0, 2, 6])).toEqual([
        '2024-02-03',
        '2024-02-04',
        '2024-02-06',
        '2024-02-10',
      ]);
      // across the year and month boundary
      expect(getExpectedDates('2025-12-25', '2026-01-07', [2, 4])).toEqual([
        '2025-12-25',
        '2025-12-30',
        '2026-01-01',
        '2026-01-06',
      ]);
    });
  });

  describe('zeroPad', () => {
    it('should pad single digit numbers with a leading zero', () => {
      expect(zeroPad(5)).toBe('05');
      expect(zeroPad(12)).toBe('12');
      expect(zeroPad(9)).toBe('09');
      expect(zeroPad(29)).toBe('29');
      expect(zeroPad(10)).toBe('10');
      expect(zeroPad(40)).toBe('40');
      expect(zeroPad(0)).toBe('00');
    });
  });

  describe('paddedTimeFromDate', () => {
    it('should return the padded time string from a Date object', () => {
      expect(paddedTimeFromDate(new Date('2025-01-01T05:30:00'))).toBe('0530');
      expect(paddedTimeFromDate(new Date('2025-01-01T15:59:00'))).toBe('1559');
      expect(paddedTimeFromDate(new Date('2025-01-01T07:09:00'))).toBe('0709');
      expect(paddedTimeFromDate(new Date('2025-01-01T00:00:00'))).toBe('0000');
      expect(paddedTimeFromDate(new Date('2025-01-01T23:01:00'))).toBe('2301');

      expect(paddedTimeFromDate(null)).toBe(null);
    });
  });

  describe('dateFromPaddedTime', () => {
    it('should return a Date object from a padded time string', () => {
      expect(dateFromPaddedTime('0530')).toBeCloseInTime(new Date('2000-01-01T05:30:00+08:00'));
      expect(dateFromPaddedTime('1559')).toBeCloseInTime(new Date('2000-01-01T15:59:00+08:00'));
      expect(dateFromPaddedTime('0709')).toBeCloseInTime(new Date('2000-01-01T07:09:00+08:00'));
      expect(dateFromPaddedTime('0000')).toBeCloseInTime(new Date('2000-01-01T00:00:00+08:00'));
      expect(dateFromPaddedTime('2301')).toBeCloseInTime(new Date('2000-01-01T23:01:00+08:00'));

      expect(dateFromPaddedTime(null)).toBe(null);
    });
  });
});
