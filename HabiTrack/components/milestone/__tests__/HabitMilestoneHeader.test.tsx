import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { HabitMilestoneHeader } from '../HabitMilestoneHeader';

describe('<HabitMilestoneHeader />', () => {
  it('displays without crashing', () => {
    const { getByTestId } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    expect(getByTestId('habit-milestone-header')).toBeTruthy();
  });

  it('displays correct mastery rank', () => {
    const { getByText } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    expect(getByText('NEWBIE')).toBeTruthy();
  });

  it('displays correct mastery rank for intermediate levels', () => {
    const { getByText } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={5} />,
    );

    expect(getByText('SKILLED')).toBeTruthy();
  });

  it('displays correct completion rank', () => {
    const { getByText } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    expect(getByText('LOCKED')).toBeTruthy();
  });

  it('displays correct completion rank for intermediate levels', () => {
    const { getByText } = render(
      <HabitMilestoneHeader totalCompleteHabits={4} totalMilestoneBadges={0} />,
    );

    expect(getByText('SILVER')).toBeTruthy();
  });

  it('does not display any rank modal by default', () => {
    const { queryByTestId } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    expect(queryByTestId('rank-modal')).toBeFalsy();
  });

  it('displays mastery rank modal when mastery rank button is pressed', () => {
    const { getByTestId, getByText } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    fireEvent.press(getByTestId('mastery-rank-button'));
    expect(getByTestId('rank-modal')).toBeTruthy();
    expect(getByText('MASTERY RANK')).toBeTruthy();
  });

  it('displays all mastery ranks correctly in mastery rank modal', () => {
    const { getByTestId } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    fireEvent.press(getByTestId('mastery-rank-button'));
    expect(getByTestId('mastery-rank-popup-rank-0')).toBeTruthy();
    expect(getByTestId('mastery-rank-popup-rank-1')).toBeTruthy();
    expect(getByTestId('mastery-rank-popup-rank-2')).toBeTruthy();
    expect(getByTestId('mastery-rank-popup-rank-3')).toBeTruthy();
    expect(getByTestId('mastery-rank-popup-rank-4')).toBeTruthy();
    expect(getByTestId('mastery-rank-popup-rank-5')).toBeTruthy();
  });

  it('displays mastery rank names with the correct opacity in mastery rank modal', () => {
    const { getByTestId } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    fireEvent.press(getByTestId('mastery-rank-button'));
    expect(getByTestId('mastery-rank-popup-rank-0-name')).toHaveStyle({ opacity: 1 });
    expect(getByTestId('mastery-rank-popup-rank-1-name')).toHaveStyle({ opacity: 0.2 });
    expect(getByTestId('mastery-rank-popup-rank-2-name')).toHaveStyle({ opacity: 0.2 });
    expect(getByTestId('mastery-rank-popup-rank-3-name')).toHaveStyle({ opacity: 0.2 });
    expect(getByTestId('mastery-rank-popup-rank-4-name')).toHaveStyle({ opacity: 0.2 });
    expect(getByTestId('mastery-rank-popup-rank-5-name')).toHaveStyle({ opacity: 0.2 });
  });

  it('displays correct next rank message in mastery rank modal', () => {
    const { getByText, getByTestId } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    fireEvent.press(getByTestId('mastery-rank-button'));
    expect(getByText('1 more Milestone Badges needed to reach NOVICE')).toBeTruthy();
  });

  it('displays correct next rank message (when maximum mastery rank is already achieved) in mastery rank modal', () => {
    const { getByText, getByTestId } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={40} />,
    );

    fireEvent.press(getByTestId('mastery-rank-button'));
    expect(getByText('Congratulations! You are a MASTER!')).toBeTruthy();
  });

  it('displays correct level up message in mastery rank modal', () => {
    const { getByText, getByTestId } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    fireEvent.press(getByTestId('mastery-rank-button'));
    expect(getByText('Level up by earning more Milestone Badges')).toBeTruthy();
  });

  it('closes rank modal when close button is pressed in mastery rank modal', () => {
    const { getByTestId, queryByTestId } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    fireEvent.press(getByTestId('mastery-rank-button'));
    expect(queryByTestId('rank-modal')).toBeTruthy();

    fireEvent.press(getByTestId('mastery-rank-popup-close-button'));
    expect(queryByTestId('rank-modal')).toBeFalsy();
  });

  it('displays completion rank modal when completion rank button is pressed', () => {
    const { getByTestId, getByText } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    fireEvent.press(getByTestId('completion-rank-button'));
    expect(getByTestId('rank-modal')).toBeTruthy();
    expect(getByText('COMPLETION RANK')).toBeTruthy();
  });

  it('displays all completion ranks correctly in completion rank modal', () => {
    const { getByTestId } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    fireEvent.press(getByTestId('completion-rank-button'));
    expect(getByTestId('completion-rank-popup-rank-0')).toBeTruthy();
    expect(getByTestId('completion-rank-popup-rank-1')).toBeTruthy();
    expect(getByTestId('completion-rank-popup-rank-2')).toBeTruthy();
    expect(getByTestId('completion-rank-popup-rank-3')).toBeTruthy();
    expect(getByTestId('completion-rank-popup-rank-4')).toBeTruthy();
    expect(getByTestId('completion-rank-popup-rank-5')).toBeTruthy();
  });

  it('displays completion rank names with the correct opacity in completion rank modal', () => {
    const { getByTestId } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    fireEvent.press(getByTestId('completion-rank-button'));
    expect(getByTestId('completion-rank-popup-rank-0-name')).toHaveStyle({ opacity: 1 });
    expect(getByTestId('completion-rank-popup-rank-1-name')).toHaveStyle({ opacity: 0.2 });
    expect(getByTestId('completion-rank-popup-rank-2-name')).toHaveStyle({ opacity: 0.2 });
    expect(getByTestId('completion-rank-popup-rank-3-name')).toHaveStyle({ opacity: 0.2 });
    expect(getByTestId('completion-rank-popup-rank-4-name')).toHaveStyle({ opacity: 0.2 });
    expect(getByTestId('completion-rank-popup-rank-5-name')).toHaveStyle({ opacity: 0.2 });
  });

  it('displays correct next rank message in completion rank modal', () => {
    const { getByText, getByTestId } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    fireEvent.press(getByTestId('completion-rank-button'));
    expect(getByText('Unlock by earning ALL 5 Milestone Badges on 1 habit')).toBeTruthy();
  });

  it('displays correct next rank message (when maximum completion rank is already achieved) in completion rank modal', () => {
    const { getByText, getByTestId } = render(
      <HabitMilestoneHeader totalCompleteHabits={15} totalMilestoneBadges={0} />,
    );

    fireEvent.press(getByTestId('completion-rank-button'));
    expect(getByText('Congratulations! You reached DIAMOND!')).toBeTruthy();
  });

  it('displays correct level up message in completion rank modal', () => {
    const { getByText, getByTestId } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    fireEvent.press(getByTestId('completion-rank-button'));
    expect(getByText('Level up by earning ALL 5 Milestone Badges on more habits')).toBeTruthy();
  });

  it('closes rank modal when close button is pressed in completion rank modal', () => {
    const { getByTestId, queryByTestId } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    fireEvent.press(getByTestId('completion-rank-button'));
    expect(queryByTestId('rank-modal')).toBeTruthy();

    fireEvent.press(getByTestId('completion-rank-popup-close-button'));
    expect(queryByTestId('rank-modal')).toBeFalsy();
  });

  it('does not close modal when background is pressed', () => {
    const { getByTestId, queryByTestId } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    fireEvent.press(getByTestId('mastery-rank-button'));
    expect(queryByTestId('rank-modal')).toBeTruthy();

    fireEvent.press(getByTestId('rank-modal-background'));
    expect(queryByTestId('rank-modal')).toBeTruthy();
  });

  it('handles negative milestone badges properly', () => {
    const { getByText } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={-5} />,
    );

    expect(getByText('UNKNOWN')).toBeTruthy();
  });

  it('handles negative complete habits properly', () => {
    const { getByText } = render(
      <HabitMilestoneHeader totalCompleteHabits={-1} totalMilestoneBadges={0} />,
    );

    expect(getByText('UNKNOWN')).toBeTruthy();
  });

  it('handles switching between mastery and completion rank modals properly', () => {
    const { getByTestId } = render(
      <HabitMilestoneHeader totalCompleteHabits={0} totalMilestoneBadges={0} />,
    );

    fireEvent.press(getByTestId('mastery-rank-button'));
    expect(getByTestId('mastery-rank-popup')).toBeTruthy();

    fireEvent.press(getByTestId('mastery-rank-popup-close-button'));
    fireEvent.press(getByTestId('completion-rank-button'));
    expect(getByTestId('completion-rank-popup')).toBeTruthy();
  });
});
