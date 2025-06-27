// calculate the badges_earned for a given week_streak
export function getBadgesEarned(weekStreak: number) {
  try {
    if (weekStreak >= 0 && weekStreak < 1) {
      return 0;
    } else if (weekStreak >= 1 && weekStreak < 3) {
      return 1;
    } else if (weekStreak >= 3 && weekStreak < 12) {
      return 2;
    } else if (weekStreak >= 12 && weekStreak < 26) {
      return 3;
    } else if (weekStreak >= 26 && weekStreak < 52) {
      return 4;
    } else if (weekStreak >= 52) {
      return 5;
    } else {
      return -1;
    }
  } catch (error) {
    console.error('Error in getBadgesEarned:', error);
    return -1;
  }
}
