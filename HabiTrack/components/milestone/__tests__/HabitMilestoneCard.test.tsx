import React from 'react';
import { render } from '@testing-library/react-native';
import { HabitMilestoneCard } from '../HabitMilestoneCard';

describe('<HabitMilestoneCard />', () => {
  it('displays without crashing', () => {
    const { getByTestId } = render(
      <HabitMilestoneCard habitName="Habit Name" weekStreak={0} badgesEarned={0} />,
    );

    expect(getByTestId('habit-milestone-card')).toBeTruthy();
  });

  it("displays habit's name", () => {
    const { getByTestId } = render(
      <HabitMilestoneCard habitName="Habit Name" weekStreak={0} badgesEarned={0} />,
    );

    expect(getByTestId('habit-name').props.children).toBe('Habit Name');
  });

  it('displays correct number of complete badges', () => {
    const { queryAllByText } = render(
      <HabitMilestoneCard habitName="Habit Name" weekStreak={5} badgesEarned={3} />,
    );

    expect(queryAllByText('Completed!').length).toBe(3);
  });

  it('displays week streak messages correctly', () => {
    const { queryAllByText } = render(
      <HabitMilestoneCard habitName="Habit Name" weekStreak={2} badgesEarned={1} />,
    );

    expect(queryAllByText('2/3 Weeks').length).toBe(1);
    expect(queryAllByText('2/12 Weeks').length).toBe(1);
    expect(queryAllByText('2/26 Weeks').length).toBe(1);
    expect(queryAllByText('2/52 Weeks').length).toBe(1);
  });

  it('displays all 5 badges', () => {
    const { getByTestId } = render(
      <HabitMilestoneCard habitName="Habit Name" weekStreak={10} badgesEarned={2} />,
    );

    expect(getByTestId('badge-1')).toBeTruthy();
    expect(getByTestId('badge-2')).toBeTruthy();
    expect(getByTestId('badge-3')).toBeTruthy();
    expect(getByTestId('badge-4')).toBeTruthy();
    expect(getByTestId('badge-5')).toBeTruthy();
  });

  it('shows completed badges with correct opacity', () => {
    const { getByTestId } = render(
      <HabitMilestoneCard habitName="Habit Name" weekStreak={20} badgesEarned={3} />,
    );

    expect(getByTestId('badge-1-image')).toHaveStyle({ opacity: 1 });
    expect(getByTestId('badge-2-image')).toHaveStyle({ opacity: 1 });
    expect(getByTestId('badge-3-image')).toHaveStyle({ opacity: 1 });

    expect(getByTestId('badge-4-image')).toHaveStyle({ opacity: 0.5 });
    expect(getByTestId('badge-5-image')).toHaveStyle({ opacity: 0.5 });
  });

  it('shows correct singular/plural week messages', () => {
    const { getByText } = render(
      <HabitMilestoneCard habitName="Habit Name" weekStreak={0} badgesEarned={0} />,
    );

    expect(getByText('0/1 Week')).toBeTruthy();
    expect(getByText('0/3 Weeks')).toBeTruthy();
    expect(getByText('0/12 Weeks')).toBeTruthy();
    expect(getByText('0/26 Weeks')).toBeTruthy();
    expect(getByText('0/52 Weeks')).toBeTruthy();
  });

  it('shows completed progress bars correctly', () => {
    const { getByTestId } = render(
      <HabitMilestoneCard habitName="Habit Name" weekStreak={10} badgesEarned={3} />,
    );

    expect(getByTestId('badge-1-progress-bar-complete-message')).toHaveTextContent('Completed!');
    expect(getByTestId('badge-2-progress-bar-complete-message')).toHaveTextContent('Completed!');
    expect(getByTestId('badge-3-progress-bar-complete-message')).toHaveTextContent('Completed!');
  });

  it('shows incomplete progress bars correctly', () => {
    const { getByTestId } = render(
      <HabitMilestoneCard habitName="Habit Name" weekStreak={5} badgesEarned={1} />,
    );

    expect(getByTestId('badge-2-progress-bar-incomplete-message')).toHaveTextContent('5/3 Weeks');
    expect(getByTestId('badge-3-progress-bar-incomplete-message')).toHaveTextContent('5/12 Weeks');
  });

  it('handles zero week streak and badges earned', () => {
    const { queryAllByText } = render(
      <HabitMilestoneCard habitName="Habit Name" weekStreak={0} badgesEarned={0} />,
    );

    expect(queryAllByText('0/1 Week').length).toBe(1);
    expect(queryAllByText('0/3 Weeks').length).toBe(1);
    expect(queryAllByText('0/12 Weeks').length).toBe(1);
    expect(queryAllByText('0/26 Weeks').length).toBe(1);
    expect(queryAllByText('0/52 Weeks').length).toBe(1);
  });

  it('handles all badges completed correctly', () => {
    const { queryAllByText } = render(
      <HabitMilestoneCard habitName="Habit Name" weekStreak={52} badgesEarned={5} />,
    );

    expect(queryAllByText('Completed!').length).toBe(5);
  });

  it('handles high week streaks properly', () => {
    const { queryAllByText } = render(
      <HabitMilestoneCard habitName="Habit Name" weekStreak={100} badgesEarned={5} />,
    );

    expect(queryAllByText('Completed!').length).toBe(5);
  });

  it('handles negative badges earned properly', () => {
    const { getByText } = render(
      <HabitMilestoneCard habitName="Habit Name" badgesEarned={-5} weekStreak={20} />,
    );

    expect(getByText('20/1 Week')).toBeTruthy();
  });

  it('handles negative week streaks properly', () => {
    const { queryAllByText } = render(
      <HabitMilestoneCard habitName="Habit Name" badgesEarned={3} weekStreak={-12} />,
    );

    expect(queryAllByText('-12/1 Week').length).toBe(0);
    expect(queryAllByText('-12/3 Weeks').length).toBe(0);
    expect(queryAllByText('-12/12 Weeks').length).toBe(0);
    expect(queryAllByText('-12/26 Weeks').length).toBe(1);
    expect(queryAllByText('-12/52 Weeks').length).toBe(1);
  });

  it('handles week streak >= badge requirement, but badge not earned', () => {
    const { getByText } = render(
      <HabitMilestoneCard habitName="Habit Name" badgesEarned={1} weekStreak={5} />,
    );

    expect(getByText('5/3 Weeks')).toBeTruthy();
  });
});
