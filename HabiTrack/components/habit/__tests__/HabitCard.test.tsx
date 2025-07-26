import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { HabitCard } from '../HabitCard';
import { Habit, HabitCompletion, HabitMilestone } from '@/db/schema';
import { DatabaseService } from '@/services';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      habitCompletion: {
        toggleTodayHabitCompletion: jest.fn(),
      },
      habitMilestone: {
        getMilestonesByHabitIdQuery: jest.fn(),
        updateMilestoneByHabitId: jest.fn(),
      },
    },
  },
}));

jest.mock('@/utils/dateUtils', () => ({
  calculateDaysBetweenDates: jest.fn(),
}));

jest.mock('@/utils/milestoneUtils', () => ({
  getBadgesEarned: jest.fn(),
}));

describe('<HabitCard />', () => {
  const mockHabit: Habit = {
    id: '1',
    user_id: 'user1',
    name: 'Habit Name',
    description: 'Habit Description',
    frequencyModifiedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    isDeleted: false,
  };

  const mockHabitCompletion: HabitCompletion = {
    id: '1',
    habit_id: '1',
    completedAt: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    isDeleted: false,
  };

  const mockHabitMilestone: HabitMilestone = {
    id: '1',
    habit_id: '1',
    week_streak: 2,
    badges_earned: 1,
    streak_started_at: '2025-01-01',
    best_day_streak: 5,
    prev_best_day_streak: 3,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    isDeleted: false,
  };

  const defaultProps = {
    habit: mockHabit,
    habit_completion: null,
    habit_milestone: mockHabitMilestone,
    today: '2025-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays without crashing', () => {
    const { getByTestId } = render(<HabitCard {...defaultProps} />);

    expect(getByTestId('habit-card-1')).toBeTruthy();
  });

  it("displays habit's name correctly", () => {
    const { getByTestId } = render(<HabitCard {...defaultProps} />);

    expect(getByTestId(`habit-card-${mockHabit.id}-habit-name`).props.children).toBe(
      mockHabit.name,
    );
  });

  it('displays habit card buttons container', () => {
    const { getByTestId } = render(<HabitCard {...defaultProps} />);

    expect(getByTestId(`habit-card-${mockHabit.id}-buttons-container`)).toBeTruthy();
  });

  it('displays edit button when isEditable is true', () => {
    const { getByTestId } = render(<HabitCard {...defaultProps} isEditable={true} />);

    expect(getByTestId(`habit-card-${mockHabit.id}-edit-button`)).toBeTruthy();
  });

  it('displays stats button', () => {
    const { getByTestId } = render(<HabitCard {...defaultProps} />);

    expect(getByTestId(`habit-card-${mockHabit.id}-stats-button`)).toBeTruthy();
  });

  it('displays completion toggle when isCompletable is true', () => {
    const { getByTestId } = render(<HabitCard {...defaultProps} isCompletable={true} />);

    expect(getByTestId(`habit-card-${mockHabit.id}-toggle-completion`)).toBeTruthy();
  });

  it('does not display edit button when isEditable is false', () => {
    const { queryByTestId } = render(<HabitCard {...defaultProps} isEditable={false} />);

    expect(queryByTestId(`habit-card-${mockHabit.id}-edit-button`)).toBeFalsy();
  });

  it('does not display completion toggle when isCompletable is false', () => {
    const { queryByTestId } = render(<HabitCard {...defaultProps} isCompletable={false} />);

    expect(queryByTestId(`habit-card-${mockHabit.id}-toggle-completion`)).toBeFalsy();
  });

  it('navigates to edit screen when edit button is pressed', () => {
    const { getByTestId } = render(<HabitCard {...defaultProps} />);

    fireEvent.press(getByTestId(`habit-card-${mockHabit.id}-edit-button`));

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/habit/edit',
      params: { id: mockHabit.id },
    });
  });

  it('navigates to stats screen when stats button is pressed', () => {
    const { getByTestId } = render(<HabitCard {...defaultProps} />);

    fireEvent.press(getByTestId(`habit-card-${mockHabit.id}-stats-button`));

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/habit/statistics',
      params: { id: mockHabit.id, name: mockHabit.name },
    });
  });

  it('handles completion toggle when today is null', async () => {
    const mockSetRefresh = jest.fn();
    const { getByTestId } = render(
      <HabitCard {...defaultProps} today={null} setRefresh={mockSetRefresh} />,
    );

    fireEvent.press(getByTestId(`habit-card-${mockHabit.id}-toggle-completion`));

    await waitFor(() => {
      expect(
        DatabaseService.instance.habitCompletion.toggleTodayHabitCompletion,
      ).not.toHaveBeenCalled();
      expect(mockSetRefresh).not.toHaveBeenCalled();
    });
  });

  it('handles habit completion when habit is not completed', async () => {
    const mockSetRefresh = jest.fn();
    const mockGetMilestones = DatabaseService.instance.habitMilestone
      .getMilestonesByHabitIdQuery as jest.Mock;
    const mockUpdateMilestone = DatabaseService.instance.habitMilestone
      .updateMilestoneByHabitId as jest.Mock;
    const mockToggleCompletion = DatabaseService.instance.habitCompletion
      .toggleTodayHabitCompletion as jest.Mock;

    mockGetMilestones.mockResolvedValue([mockHabitMilestone]);

    const { getByTestId } = render(
      <HabitCard {...defaultProps} habit_completion={null} setRefresh={mockSetRefresh} />,
    );

    fireEvent.press(getByTestId(`habit-card-${mockHabit.id}-toggle-completion-pressable`));

    await waitFor(() => {
      expect(mockGetMilestones).toHaveBeenCalledWith(mockHabit.id);
      expect(mockToggleCompletion).toHaveBeenCalledWith(mockHabit.id);
      expect(mockUpdateMilestone).toHaveBeenCalled();
      expect(mockSetRefresh).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it('handles habit uncompletion when habit is completed', async () => {
    const mockSetRefresh = jest.fn();
    const mockUpdateMilestone = DatabaseService.instance.habitMilestone
      .updateMilestoneByHabitId as jest.Mock;
    const mockToggleCompletion = DatabaseService.instance.habitCompletion
      .toggleTodayHabitCompletion as jest.Mock;

    const { getByTestId } = render(
      <HabitCard
        {...defaultProps}
        habit_completion={mockHabitCompletion}
        setRefresh={mockSetRefresh}
      />,
    );

    fireEvent.press(getByTestId(`habit-card-${mockHabit.id}-toggle-completion-pressable`));

    await waitFor(() => {
      expect(mockUpdateMilestone).toHaveBeenCalled();
      expect(mockToggleCompletion).toHaveBeenCalledWith(mockHabit.id);
      expect(mockSetRefresh).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it('handles long habit names properly', () => {
    const longHabit = { ...mockHabit, name: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' };
    const { getByTestId } = render(<HabitCard {...defaultProps} habit={longHabit} />);

    const habitNameElement = getByTestId(`habit-card-${longHabit.id}-habit-name`);
    expect(habitNameElement.props.children).toBe(longHabit.name);
  });

  it('handles empty habit names properly', () => {
    const emptyNameHabit = { ...mockHabit, name: '' };
    const { getByTestId } = render(<HabitCard {...defaultProps} habit={emptyNameHabit} />);

    const habitNameElement = getByTestId(`habit-card-${emptyNameHabit.id}-habit-name`);
    expect(habitNameElement.props.children).toBe(emptyNameHabit.name);
  });

  it('handles null milestone data properly', () => {
    const { getByTestId } = render(<HabitCard {...defaultProps} habit_milestone={null} />);

    expect(getByTestId(`habit-card-${mockHabit.id}`)).toBeTruthy();
  });

  it('handles null habit completion data properly', () => {
    const { getByTestId } = render(<HabitCard {...defaultProps} habit_completion={null} />);

    expect(getByTestId(`habit-card-${mockHabit.id}`)).toBeTruthy();
  });
});
