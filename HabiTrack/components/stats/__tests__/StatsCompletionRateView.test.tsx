import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { StatsCompletionRateView } from '@/components/stats/StatsCompletionRateView';

describe('<StatsCompletionRateView />', () => {
  it('should display without crashing', () => {
    const { getByText } = render(
      <StatsCompletionRateView
        calcHabitStatsisticsByMode={() => ({
          startDate: '2025-01-01',
          actualNoOfDays: 5,
          expectedNoOfDays: 10,
        })}
      />,
    );

    expect(getByText('Completion Rate [Lifetime]')).toBeTruthy();
    expect(getByText('Evaluated since: 01-01-2025')).toBeTruthy();
    expect(getByText('5 / 10')).toBeTruthy();
    expect(getByText('Halfway to full consistency! 🏁')).toBeTruthy();
  });

  it('should display correct evaluated since date', () => {
    const { getByText } = render(
      <StatsCompletionRateView
        calcHabitStatsisticsByMode={() => ({
          startDate: '2025-11-29',
          actualNoOfDays: 5,
          expectedNoOfDays: 10,
        })}
      />,
    );

    expect(getByText('Evaluated since: 29-11-2025')).toBeTruthy();
  });

  it('should display correct progress message for 0% completion rate [Lifetime]', () => {
    const { getByText } = render(
      <StatsCompletionRateView
        calcHabitStatsisticsByMode={() => ({
          startDate: '2025-01-01',
          actualNoOfDays: 0,
          expectedNoOfDays: 10,
        })}
      />,
    );

    expect(getByText('Time to begin your journey! 🏁')).toBeTruthy();
  });

  it('should display correct progress message for low completion rate (30%) [Lifetime]', () => {
    const { getByText } = render(
      <StatsCompletionRateView
        calcHabitStatsisticsByMode={() => ({
          startDate: '2025-01-01',
          actualNoOfDays: 3,
          expectedNoOfDays: 10,
        })}
      />,
    );

    expect(getByText('Decent effort, but consistency is key! 🔑')).toBeTruthy();
  });

  it('should display correct progress message for high completion rate (80%) [Lifetime]', () => {
    const { getByText } = render(
      <StatsCompletionRateView
        calcHabitStatsisticsByMode={() => ({
          startDate: '2025-01-01',
          actualNoOfDays: 8,
          expectedNoOfDays: 10,
        })}
      />,
    );

    expect(getByText('Impressive dedication! 🌟')).toBeTruthy();
  });

  it('should display correct progress message for 100% completion rate [Lifetime]', () => {
    const { getByText } = render(
      <StatsCompletionRateView
        calcHabitStatsisticsByMode={() => ({
          startDate: '2025-01-01',
          actualNoOfDays: 10,
          expectedNoOfDays: 10,
        })}
      />,
    );

    expect(getByText('Perfect completion rate! 🎯')).toBeTruthy();
  });

  it('should display correct progress message when switching timeframes', () => {
    const mockCalc = jest.fn(() => {
      return {
        startDate: '2025-01-01',
        actualNoOfDays: 4,
        expectedNoOfDays: 10,
      };
    });

    const { getByText, getByTestId } = render(
      <StatsCompletionRateView calcHabitStatsisticsByMode={mockCalc} />,
    );

    expect(getByText('Getting there, keep on moving! 🚴')).toBeTruthy();

    const picker = getByTestId('picker');

    fireEvent(picker, 'valueChange', 'month');
    expect(getByText('Decent progress this month! 📌')).toBeTruthy();

    fireEvent(picker, 'valueChange', 'week');
    expect(getByText('Decent weekly progress! 👏')).toBeTruthy();

    expect(mockCalc).toHaveBeenCalledTimes(3);
  });

  it('handles division by 0 properly', () => {
    const { getByTestId } = render(
      <StatsCompletionRateView
        calcHabitStatsisticsByMode={() => ({
          startDate: '2025-01-01',
          actualNoOfDays: 10,
          expectedNoOfDays: 0,
        })}
      />,
    );
    const percentageText = getByTestId('pie-chart-percentage-text');
    expect(percentageText.props.children.props.children).toBe('0%');
  });

  it('handles actualNoOfDays greater than expectedNoOfDays properly', () => {
    const { getByTestId } = render(
      <StatsCompletionRateView
        calcHabitStatsisticsByMode={() => ({
          startDate: '2025-01-01',
          actualNoOfDays: 15,
          expectedNoOfDays: 10,
        })}
      />,
    );
    const percentageText = getByTestId('pie-chart-percentage-text');
    expect(percentageText.props.children.props.children).toBe('100%');
  });

  it('handles negative day values properly', () => {
    const { getByTestId } = render(
      <StatsCompletionRateView
        calcHabitStatsisticsByMode={() => ({
          startDate: '2025-01-01',
          actualNoOfDays: -5,
          expectedNoOfDays: 10,
        })}
      />,
    );
    const percentageText = getByTestId('pie-chart-percentage-text');
    expect(percentageText.props.children.props.children).toBe('0%');
  });

  it('handles large numbers properly', () => {
    const { getByTestId } = render(
      <StatsCompletionRateView
        calcHabitStatsisticsByMode={() => ({
          startDate: '2025-01-01',
          actualNoOfDays: 1000000,
          expectedNoOfDays: 2,
        })}
      />,
    );
    const percentageText = getByTestId('pie-chart-percentage-text');
    expect(percentageText.props.children.props.children).toBe('100%');
  });

  it('calls calcHabitStatsisticsByMode with correct params', () => {
    const mockCalc = jest.fn(() => ({
      startDate: '2025-01-01',
      actualNoOfDays: 5,
      expectedNoOfDays: 10,
    }));

    render(<StatsCompletionRateView calcHabitStatsisticsByMode={mockCalc} />);

    expect(mockCalc).toHaveBeenCalledWith('all');
    expect(mockCalc).toHaveBeenCalledTimes(1);
  });

  it('recalculates completion rate when switching timeframes', () => {
    const mockCalc = jest.fn(() => ({
      startDate: '2025-01-01',
      actualNoOfDays: 5,
      expectedNoOfDays: 10,
    }));

    const { getByTestId } = render(
      <StatsCompletionRateView calcHabitStatsisticsByMode={mockCalc} />,
    );

    fireEvent(getByTestId('picker'), 'valueChange', 'month');

    expect(mockCalc).toHaveBeenCalledWith('month');
    expect(mockCalc).toHaveBeenCalledTimes(2);
  });
});
