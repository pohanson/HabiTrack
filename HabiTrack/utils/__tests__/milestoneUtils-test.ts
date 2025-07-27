import { getBadgesEarned } from '../milestoneUtils';

describe('milestoneUtils', () => {
  describe('getBadgesEarned', () => {
    it('calculate the badges_earned for a given week_streak', () => {
      expect(getBadgesEarned(0)).toBe(0);

      expect(getBadgesEarned(1)).toBe(1);
      expect(getBadgesEarned(2)).toBe(1);

      expect(getBadgesEarned(3)).toBe(2);
      expect(getBadgesEarned(8)).toBe(2);
      expect(getBadgesEarned(11)).toBe(2);

      expect(getBadgesEarned(12)).toBe(3);
      expect(getBadgesEarned(14)).toBe(3);
      expect(getBadgesEarned(25)).toBe(3);

      expect(getBadgesEarned(26)).toBe(4);
      expect(getBadgesEarned(36)).toBe(4);
      expect(getBadgesEarned(51)).toBe(4);

      expect(getBadgesEarned(52)).toBe(5);
      expect(getBadgesEarned(100)).toBe(5);
    });
  });
});
