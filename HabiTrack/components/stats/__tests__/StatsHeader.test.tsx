import React from 'react';
import { render } from '@testing-library/react-native';
import { StatsHeader } from '../StatsHeader';

describe('<StatsHeader />', () => {
  it('displays without crashing', () => {
    const { getByTestId } = render(
      <StatsHeader
        badgesEarned={0}
        createdAt="2025-01-01"
        habitName="habit name"
        startDate="2025-01-01"
        todayDate="2025-06-01"
      />,
    );

    expect(getByTestId('habit-name')).toBeTruthy();
    expect(getByTestId('today-date')).toBeTruthy();
    expect(getByTestId('created-at')).toBeTruthy();
    expect(getByTestId('created-at-date')).toBeTruthy();
    expect(getByTestId('last-reset')).toBeTruthy();
    expect(getByTestId('start-date')).toBeTruthy();
  });

  it('display without badge icon if badgesEarned is 0', () => {
    const { queryByTestId } = render(
      <StatsHeader
        badgesEarned={0}
        createdAt="2025-01-01"
        habitName="habit name"
        startDate="2025-01-01"
        todayDate="2025-06-01"
      />,
    );

    expect(queryByTestId('badge')).toBeNull();
  });

  it('displays the habit name correctly', () => {
    const { getByTestId } = render(
      <StatsHeader
        badgesEarned={0}
        createdAt="2025-01-01"
        habitName="Test Habit"
        startDate="2025-01-01"
        todayDate="2025-06-01"
      />,
    );

    expect(getByTestId('habit-name').props.children).toBe('Test Habit');
  });

  it("it displays today's date correctly", () => {
    const { getByTestId } = render(
      <StatsHeader
        badgesEarned={0}
        createdAt="2025-01-01"
        habitName="habit name"
        startDate="2025-01-01"
        todayDate="2025-06-01"
      />,
    );

    expect(getByTestId('today-date').props.children).toBe('1 Jun, Sun');
  });

  it('displays the created at date correctly', () => {
    const { getByTestId } = render(
      <StatsHeader
        badgesEarned={0}
        createdAt="2025-01-01"
        habitName="habit name"
        startDate="2025-01-01"
        todayDate="2025-06-01"
      />,
    );

    expect(getByTestId('created-at-date').props.children).toBe('01-01-2025');
  });

  it('displays the start date correctly', () => {
    const { getByTestId } = render(
      <StatsHeader
        badgesEarned={0}
        createdAt="2025-01-01"
        habitName="habit name"
        startDate="2025-01-01"
        todayDate="2025-06-01"
      />,
    );

    expect(getByTestId('start-date').props.children).toBe('01-01-2025');
  });

  it('handles invalid dates properly', () => {
    const { getByTestId } = render(
      <StatsHeader
        badgesEarned={0}
        createdAt="invalid date"
        habitName="habit name"
        startDate="invalid date"
        todayDate="2025-06-01"
      />,
    );

    expect(getByTestId('habit-name').props.children).toBeTruthy();
  });

  it('handles empty dates properly', () => {
    const { getByTestId } = render(
      <StatsHeader
        badgesEarned={0}
        createdAt=""
        habitName="habit name"
        startDate=""
        todayDate=""
      />,
    );

    expect(getByTestId('habit-name').props.children).toBeTruthy();
  });

  it('handles leap year dates properly', () => {
    const { getByTestId } = render(
      <StatsHeader
        badgesEarned={0}
        createdAt="2024-02-29"
        habitName="habit name"
        startDate="2024-02-29"
        todayDate="2025-02-29"
      />,
    );
    expect(getByTestId('created-at-date').props.children).toBe('29-02-2024');
    expect(getByTestId('start-date').props.children).toBe('29-02-2024');
    expect(getByTestId('today-date').props.children).toBe('29 Feb, Sat');
  });

  it('handles empty habit names properly', () => {
    const { getByTestId } = render(
      <StatsHeader
        badgesEarned={0}
        createdAt="2025-01-01"
        habitName=""
        startDate="2025-01-01"
        todayDate="2025-01-01"
      />,
    );
    expect(getByTestId('habit-name').props.children).toBe('');
  });

  it('handles long habit names properly', () => {
    const longName = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
    const { getByTestId } = render(
      <StatsHeader
        badgesEarned={0}
        createdAt="2025-01-01"
        habitName={longName}
        startDate="2025-01-01"
        todayDate="2025-06-01"
      />,
    );

    expect(getByTestId('habit-name').props.children).toBe(longName);
  });

  it('handles habit names with special characters properly', () => {
    const specialName = 'Habit @#$%^&*()_+';
    const { getByTestId } = render(
      <StatsHeader
        badgesEarned={0}
        createdAt="2025-01-01"
        habitName={specialName}
        startDate="2025-01-01"
        todayDate="2025-06-01"
      />,
    );

    expect(getByTestId('habit-name').props.children).toBe(specialName);
  });
});
