import React from 'react';
import { render } from '@testing-library/react-native';
import { StatsDayStreakView } from '@/components/stats/StatsDayStreakView';

describe('<StatsDayStreakView />', () => {
  it('renders active and best streaks correctly', () => {
    const { getByText } = render(<StatsDayStreakView activeStreak={5} bestStreak={10} />);

    expect(getByText('Active Streak')).toBeTruthy();
    expect(getByText('5 days')).toBeTruthy();
    expect(getByText('Best Streak')).toBeTruthy();
    expect(getByText('10 days')).toBeTruthy();
  });

  it('displays the correct emojis for different streak values', () => {
    const { getByText } = render(<StatsDayStreakView activeStreak={3} bestStreak={7} />);

    expect(getByText('⚡')).toBeTruthy(); // 3 days:⚡
    expect(getByText('⚡⚡')).toBeTruthy(); // 7 days:⚡⚡
  });

  it('handles singular vs plural days correctly', () => {
    const { getByText: getByTextSingle } = render(
      <StatsDayStreakView activeStreak={1} bestStreak={2} />,
    );

    expect(getByTextSingle('1 day')).toBeTruthy(); // singular
    expect(() => getByTextSingle('1 days')).toThrow(); // plural

    const { getByText: getByTextPlural } = render(
      <StatsDayStreakView activeStreak={2} bestStreak={3} />,
    );

    expect(getByTextPlural('2 days')).toBeTruthy(); // plural
    expect(getByTextPlural('3 days')).toBeTruthy(); // plural
  });

  it('displays correct emojis for edge cases', () => {
    const { getByText: getByTextZero } = render(
      <StatsDayStreakView activeStreak={0} bestStreak={1} />,
    );

    expect(getByTextZero('😴')).toBeTruthy(); // 0 days: 😴

    const { getByText: getByTextHigh } = render(
      <StatsDayStreakView activeStreak={365} bestStreak={366} />,
    );

    expect(getByTextHigh('💎💎💎')).toBeTruthy(); // 365 days: 💎💎💎
    expect(getByTextHigh('👑👑👑')).toBeTruthy(); // >365 days: 👑👑👑
  });
});
