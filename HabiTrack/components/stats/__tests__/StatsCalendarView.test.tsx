import React from 'react';
import { render } from '@testing-library/react-native';
import { StatsCalendarView } from '../StatsCalendarView';

describe('<StatsCalendarView />', () => {
  it('should display without crashing with empty data', () => {
    const { getByText, getByTestId } = render(
      <StatsCalendarView startDate="2025-01-01" completedAtDates={{}} today="2025-06-01" />,
    );

    expect(getByTestId('calendar')).toBeTruthy();
    expect(getByText('Completed days')).toBeTruthy();
    expect(getByText('Missed days')).toBeTruthy();
  });

  it('should display with completed dates', () => {
    const completedDates = {
      '2025-01-01': { marked: true, dotColor: 'green' },
      '2025-01-02': { marked: true, dotColor: 'green' },
    };

    const { getByText, getByTestId } = render(
      <StatsCalendarView
        startDate="2025-01-01"
        completedAtDates={completedDates}
        today="2025-06-01"
      />,
    );

    expect(getByTestId('calendar')).toBeTruthy();
    expect(getByText('Completed days')).toBeTruthy();
    expect(getByText('Missed days')).toBeTruthy();
  });

  it('renders with missed dates', () => {
    const completedDates = {
      '2025-01-01': { marked: true, dotColor: 'red' },
      '2025-01-02': { marked: true, dotColor: 'red' },
      '2025-01-03': { marked: false, dotColor: 'red' },
    };

    const { getByText, getByTestId } = render(
      <StatsCalendarView
        startDate="2025-01-01"
        completedAtDates={completedDates}
        today="2025-06-01"
      />,
    );

    expect(getByTestId('calendar')).toBeTruthy();
    expect(getByText('Completed days')).toBeTruthy();
    expect(getByText('Missed days')).toBeTruthy();
  });

  it('renders with both completed and missed dates', () => {
    const completedDates = {
      '2025-01-01': { marked: true, dotColor: 'green' },
      '2025-01-02': { marked: true, dotColor: 'green' },
      '2025-01-03': { marked: false, dotColor: 'red' },
    };

    const { getByText, getByTestId } = render(
      <StatsCalendarView
        startDate="2025-01-01"
        completedAtDates={completedDates}
        today="2025-06-01"
      />,
    );

    expect(getByTestId('calendar')).toBeTruthy();
    expect(getByText('Completed days')).toBeTruthy();
    expect(getByText('Missed days')).toBeTruthy();
  });

  it('handles future start date', () => {
    const { getByText, getByTestId } = render(
      <StatsCalendarView startDate="2030-12-01" completedAtDates={{}} today="2025-06-01" />,
    );

    expect(getByTestId('calendar')).toBeTruthy();
    expect(getByText('Completed days')).toBeTruthy();
    expect(getByText('Missed days')).toBeTruthy();
  });

  it('handles null completed dates', () => {
    const { getByText, getByTestId } = render(
      <StatsCalendarView startDate="2025-01-01" completedAtDates={null} today="2025-06-01" />,
    );

    expect(getByTestId('calendar')).toBeTruthy();
    expect(getByText('Completed days')).toBeTruthy();
    expect(getByText('Missed days')).toBeTruthy();
  });

  it('handles invalid date formats properly', () => {
    const { getByText, getByTestId } = render(
      <StatsCalendarView startDate="invalid date" completedAtDates={{}} today="invalid date" />,
    );

    expect(getByTestId('calendar')).toBeTruthy();
    expect(getByText('Completed days')).toBeTruthy();
    expect(getByText('Missed days')).toBeTruthy();
  });

  it('handles invalid completedAtDates objects properly', () => {
    const { getByText, getByTestId } = render(
      <StatsCalendarView
        startDate="2025-01-01"
        completedAtDates={{ 'invalid date': 'invalid object' }}
        today="2025-06-01"
      />,
    );

    expect(getByTestId('calendar')).toBeTruthy();
    expect(getByText('Completed days')).toBeTruthy();
    expect(getByText('Missed days')).toBeTruthy();
  });

  it('handles leap year dates properly', () => {
    const completedDates = {
      '2024-02-29': { marked: true, dotColor: 'green' },
      '2025-02-28': { marked: true, dotColor: 'green' },
    };

    const { getByText, getByTestId } = render(
      <StatsCalendarView
        startDate="2024-01-01"
        completedAtDates={completedDates}
        today="2025-06-01"
      />,
    );

    expect(getByTestId('calendar')).toBeTruthy();
    expect(getByText('Completed days')).toBeTruthy();
    expect(getByText('Missed days')).toBeTruthy();
  });

  it('handles large no. of completed dates properly', () => {
    const completedDates: { [key: string]: { marked: boolean; dotColor: string } } = {};
    for (let i = 1; i <= 500; i++) {
      const date = new Date(2025, 0, i).toISOString().split('T')[0];
      completedDates[date] = { marked: true, dotColor: i % 3 === 0 ? 'green' : 'red' };
    }
    const { getByText, getByTestId } = render(
      <StatsCalendarView
        startDate="2025-01-01"
        completedAtDates={completedDates}
        today="2025-06-01"
      />,
    );
    expect(getByTestId('calendar')).toBeTruthy();
    expect(getByText('Completed days')).toBeTruthy();
    expect(getByText('Missed days')).toBeTruthy();
  });

  it('handles completed dates over a large time span properly', () => {
    const completedDates: { [key: string]: { marked: boolean; dotColor: string } } = {};
    for (let i = 1; i <= 10000; i += 100) {
      const date = new Date(2020, 0, i).toISOString().split('T')[0];
      completedDates[date] = { marked: true, dotColor: 'green' };
    }
    const { getByText, getByTestId } = render(
      <StatsCalendarView
        startDate="2020-01-01"
        completedAtDates={completedDates}
        today="2040-01-01"
      />,
    );
    expect(getByTestId('calendar')).toBeTruthy();
    expect(getByText('Completed days')).toBeTruthy();
    expect(getByText('Missed days')).toBeTruthy();
  });
});
