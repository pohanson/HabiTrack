import { DatabaseService } from '@/services';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { HabitMilestoneList } from '../HabitMilestoneList';

jest.mock('expo-router', () => ({
  useFocusEffect: jest.fn(() => {}),
}));

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      habitMilestone: {
        getAllMilestonesQuery: jest.fn(),
      },
    },
  },
}));

jest.mock('../HabitMilestoneCard', () => ({
  HabitMilestoneCard: ({ testID, habitName }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { View, Text } = require('react-native');
    return (
      <View testID={testID}>
        <Text>{habitName}</Text>
      </View>
    );
  },
}));

jest.mock('../HabitMilestoneHeader', () => ({
  HabitMilestoneHeader: ({ totalMilestoneBadges, totalCompleteHabits }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { View } = require('react-native');
    return (
      <View testID="habit-milestone-header">
        <View testID={`total-badges-${totalMilestoneBadges}`} />
        <View testID={`total-complete-${totalCompleteHabits}`} />
      </View>
    );
  },
}));

const mockDatabaseService = DatabaseService.instance.habitMilestone
  .getAllMilestonesQuery as jest.Mock;

describe('<HabitMilestoneList />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDatabaseService.mockResolvedValue([]);
  });

  it('displays without crashing', async () => {
    const mockData = [{ habit_id: '1', habit_name: 'Run', week_streak: 3, badges_earned: 2 }];
    mockDatabaseService.mockResolvedValue(mockData);
    const { getByTestId } = render(<HabitMilestoneList />);

    await waitFor(() => {
      expect(getByTestId('habit-milestone-list')).toBeTruthy();
      expect(getByTestId('habit-milestone-scrollview')).toBeTruthy();
      expect(getByTestId('habit-milestone-ranks-section')).toBeTruthy();
      expect(getByTestId('ranks-title')).toBeTruthy();
      expect(getByTestId('habit-milestone-header')).toBeTruthy();
      expect(getByTestId('milestone-list-container')).toBeTruthy();
    });
  });

  it('displays no habits message when database returns empty array', async () => {
    mockDatabaseService.mockResolvedValue([]);

    const { getByText } = render(<HabitMilestoneList />);

    await waitFor(() => {
      expect(getByText('No habits')).toBeTruthy();
    });
  });

  it('does not display no habits message when database returns non-empty array', async () => {
    const mockData = [{ habit_id: '1', habit_name: 'Run', week_streak: 3, badges_earned: 2 }];
    mockDatabaseService.mockResolvedValue(mockData);

    const { queryByText } = render(<HabitMilestoneList />);

    await waitFor(() => {
      expect(queryByText('No habits')).toBeFalsy();
    });
  });

  it('does not display habit cards when user has no habits', async () => {
    mockDatabaseService.mockResolvedValue([]);

    const { queryByTestId } = render(<HabitMilestoneList />);

    await waitFor(() => {
      expect(queryByTestId('habit-milestone-card-1')).toBeFalsy();
      expect(queryByTestId('habit-milestone-card-2')).toBeFalsy();
      expect(queryByTestId('no-habits-container')).toBeTruthy();
    });
  });

  it('displays habit cards when user has habits', async () => {
    const mockData = [
      { habit_id: '1', habit_name: 'Run', week_streak: 3, badges_earned: 2 },
      { habit_id: '2', habit_name: 'Read', week_streak: 5, badges_earned: 4 },
    ];
    mockDatabaseService.mockResolvedValue(mockData);

    const { getByTestId, queryByTestId } = render(<HabitMilestoneList />);

    await waitFor(() => {
      expect(queryByTestId('no-habits-container')).toBeFalsy();
      expect(getByTestId('habit-milestone-card-1')).toBeTruthy();
      expect(getByTestId('habit-milestone-card-2')).toBeTruthy();
      expect(queryByTestId('habit-milestone-card-3')).toBeFalsy();
    });
  });

  it('calculates total number of milestone badges correctly', async () => {
    const mockData = [
      { habit_id: '1', habit_name: 'Run', week_streak: 3, badges_earned: 2 },
      { habit_id: '2', habit_name: 'Read', week_streak: 30, badges_earned: 4 },
      { habit_id: '3', habit_name: 'Study', week_streak: 14, badges_earned: 3 },
    ];
    mockDatabaseService.mockResolvedValue(mockData);

    const { getByTestId } = render(<HabitMilestoneList />);

    await waitFor(() => {
      expect(getByTestId('total-badges-9')).toBeTruthy();
    });
  });

  it('calculates total number of complete habits correctly', async () => {
    const mockData = [
      { habit_id: '1', habit_name: 'Exercise', week_streak: 3, badges_earned: 5 },
      { habit_id: '2', habit_name: 'Read', week_streak: 5, badges_earned: 3 },
      { habit_id: '3', habit_name: 'Meditate', week_streak: 2, badges_earned: 5 },
      { habit_id: '4', habit_name: 'Cook', week_streak: 72, badges_earned: 5 },
      { habit_id: '5', habit_name: 'Study', week_streak: 0, badges_earned: 0 },
    ];
    mockDatabaseService.mockResolvedValue(mockData);

    const { getByTestId } = render(<HabitMilestoneList />);

    await waitFor(() => {
      expect(getByTestId('total-complete-3')).toBeTruthy();
    });
  });

  it('calls database service with correct userId', async () => {
    const userId = 'user123';
    mockDatabaseService.mockResolvedValue([]);

    render(<HabitMilestoneList userId={userId} />);

    await waitFor(() => {
      expect(mockDatabaseService).toHaveBeenCalledWith(userId);
    });
  });

  it('calls database service only once on initial render', async () => {
    mockDatabaseService.mockResolvedValue([]);

    render(<HabitMilestoneList />);

    await waitFor(() => {
      expect(mockDatabaseService).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call database service multiple times unnecessarily', async () => {
    mockDatabaseService.mockResolvedValue([]);

    const { rerender } = render(<HabitMilestoneList userId="user1" />);

    await waitFor(() => {
      expect(mockDatabaseService).toHaveBeenCalledTimes(1);
    });

    rerender(<HabitMilestoneList userId="user1" />);

    expect(mockDatabaseService).toHaveBeenCalledTimes(1);
  });

  it('handles habits with invalid habit names', async () => {
    const mockData = [
      { habit_id: '1', habit_name: null, week_streak: 3, badges_earned: 2 },
      { habit_id: '2', habit_name: undefined, week_streak: 5, badges_earned: 4 },
    ];
    mockDatabaseService.mockResolvedValue(mockData);

    const { getByTestId } = render(<HabitMilestoneList />);

    await waitFor(() => {
      expect(getByTestId('habit-milestone-card-1')).toBeTruthy();
      expect(getByTestId('habit-milestone-card-2')).toBeTruthy();
    });
  });

  it('handles habits with 0 badges earned', async () => {
    const mockData = [
      { habit_id: '1', habit_name: 'Read', week_streak: 0, badges_earned: 0 },
      { habit_id: '2', habit_name: 'Read', week_streak: 100, badges_earned: 0 },
    ];
    mockDatabaseService.mockResolvedValue(mockData);

    const { getByTestId } = render(<HabitMilestoneList />);

    await waitFor(() => {
      expect(getByTestId('habit-milestone-list')).toBeTruthy();
      expect(getByTestId('habit-milestone-card-1')).toBeTruthy();
      expect(getByTestId('habit-milestone-card-2')).toBeTruthy();
      expect(getByTestId('total-badges-0')).toBeTruthy();
      expect(getByTestId('total-complete-0')).toBeTruthy();
    });
  });

  it('handles habits with negative badges earned', async () => {
    const mockData = [
      { habit_id: '1', habit_name: 'Read', week_streak: 0, badges_earned: -1 },
      { habit_id: '2', habit_name: 'Read', week_streak: 100, badges_earned: -45 },
    ];
    mockDatabaseService.mockResolvedValue(mockData);

    const { getByTestId } = render(<HabitMilestoneList />);

    await waitFor(() => {
      expect(getByTestId('habit-milestone-list')).toBeTruthy();
      expect(getByTestId('habit-milestone-card-1')).toBeTruthy();
      expect(getByTestId('habit-milestone-card-2')).toBeTruthy();
      expect(getByTestId('total-badges--46')).toBeTruthy();
      expect(getByTestId('total-complete-0')).toBeTruthy();
    });
  });

  it('handles large no. of habits properly', async () => {
    const mockData = [];
    for (let i = 0; i < 100; i++) {
      mockData.push({
        habit_id: i + 1 + '',
        habit_name: i + 1 + '',
        week_streak: i,
        badges_earned: i % 6,
      });
    }
    mockDatabaseService.mockResolvedValue(mockData);

    const { getByTestId } = render(<HabitMilestoneList />);

    await waitFor(() => {
      expect(getByTestId('habit-milestone-list')).toBeTruthy();
      expect(getByTestId('habit-milestone-card-1')).toBeTruthy();
      expect(getByTestId('habit-milestone-card-100')).toBeTruthy();
    });
  });
});
