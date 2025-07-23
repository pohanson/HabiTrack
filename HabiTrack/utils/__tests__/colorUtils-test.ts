import { getColorForPercentage, getProgressBarColorForPercentage } from '../colorUtils';

describe('colorUtils', () => {
  describe('getColorForPercentage', () => {
    it('should get color b/w red and green based on percentage', () => {
      expect(getColorForPercentage(0)).toBe('#ff0000'); // Red
      expect(getColorForPercentage(50)).toBe('#805a1e'); // Red-Green
      expect(getColorForPercentage(100)).toBe('#00b43c'); // Green (180 = b4, 60 = 3c)
    });
  });

  describe('getProgressBarColorForPercentage', () => {
    it('should get color b/w blue and purple based on percentage', () => {
      expect(getProgressBarColorForPercentage(0)).toBe('#00aac8'); // Blue
      expect(getProgressBarColorForPercentage(50)).toBe('#4673d2'); // Blue-Purple
      expect(getProgressBarColorForPercentage(100)).toBe('#8c3cdc'); // Purple (140 = 8c, 40 = 28, 225 = e1)
    });
  });
});
