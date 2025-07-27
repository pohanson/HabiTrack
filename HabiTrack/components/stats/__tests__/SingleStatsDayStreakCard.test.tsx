import { render, screen } from '@testing-library/react-native';
import { SingleStatsDayStreakCard } from '../SingleStatsDayStreakCard';

describe('SingleStatsDayStreakCard', () => {
  it('renders correctly', () => {
    const { getByText } = render(<SingleStatsDayStreakCard label="Test Streak" streak={5} />);

    getByText('Test Streak');
    getByText('⚡⚡');
    getByText('5 days');
  });

  it('renders correct emoji', () => {
    const testCases: [number, string][] = [
      [7, '⚡⚡'],
      [13, '⚡⚡⚡'],
      [14, '⚡⚡⚡'],
      [15, '🔥'],
      [30, '🔥'],
      [50, '🔥🔥'],
      [60, '🔥🔥'],
      [61, '🔥🔥🔥'],
      [90, '🔥🔥🔥'],
      [91, '🏆'],
      [120, '🏆'],
      [121, '🏆🏆'],
      [150, '🏆🏆'],
      [151, '🏆🏆🏆'],
      [180, '🏆🏆🏆'],
      [181, '⭐'],
      [210, '⭐'],
      [211, '⭐⭐'],
      [240, '⭐⭐'],
      [241, '⭐⭐⭐'],
      [270, '⭐⭐⭐'],
      [271, '💎'],
      [300, '💎'],
      [301, '💎💎'],
      [330, '💎💎'],
      [331, '💎💎💎'],
      [365, '💎💎💎'],
      [366, '👑👑👑'],
      [400, '👑👑👑'],
    ];
    render(<SingleStatsDayStreakCard label="Test Streak" streak={0} />);
    screen.getByText('0 day');
    screen.getByText('😴');

    render(<SingleStatsDayStreakCard label="Test Streak" streak={1} />);
    screen.getByText('1 day');
    screen.getByText('🌱');

    render(<SingleStatsDayStreakCard label="Test Streak" streak={2} />);
    screen.getByText('2 days');
    screen.getByText('⚡');

    render(<SingleStatsDayStreakCard label="Test Streak" streak={3} />);
    screen.getByText('3 days');
    screen.getByText('⚡');

    for (const [streak, emoji] of testCases) {
      render(<SingleStatsDayStreakCard label="Test Streak" streak={streak} />);
      screen.getByText(emoji);
    }
  });
});
