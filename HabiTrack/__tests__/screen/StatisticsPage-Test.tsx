import StatisticsPage from '@/app/(app)/habit/statistics';
import { mockHabit1 } from '@/mocks/habit';
import { DatabaseService } from '@/services';
import { render, waitFor } from '@testing-library/react-native';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useLocalSearchParams } from 'expo-router';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
}));

jest.mock('drizzle-orm/expo-sqlite', () => ({
  useLiveQuery: jest.fn(),
}));

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      habit: {
        getHabitByIdQuery: jest.fn(),
      },
      habitCompletion: {
        getCompletionsForHabitQuery: jest.fn(),
      },
      reminder: {
        getRemindersForHabitQuery: jest.fn(),
      },

      habitMilestone: {
        calculateHabitStreak: jest.fn(),
      },
      statistic: {
        calcHabitStatistics: jest.fn(),
      },
    },
  },
}));

describe('StatisticsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      id: mockHabit1.id,
      name: mockHabit1.name,
    });
    (useLiveQuery as jest.Mock).mockImplementation((query) => ({ data: query, error: null }));

    DatabaseService.instance.habit.getHabitByIdQuery = jest.fn().mockReturnValue([mockHabit1]);
    DatabaseService.instance.habitCompletion.getCompletionsForHabitQuery = jest
      .fn()
      .mockReturnValue([
        { habit_id: mockHabit1.id, completedAt: '2025-01-05' },
        { habit_id: mockHabit1.id, completedAt: '2025-01-10' },
      ]);
    DatabaseService.instance.reminder.getRemindersForHabitQuery = jest.fn().mockReturnValue([
      { day: 0, time: '0800' },
      { day: 5, time: '0800' },
    ]);

    DatabaseService.instance.habitMilestone.calculateHabitStreak = jest.fn().mockResolvedValue({
      badgesEarned: 0,
      bestStreak: 1,
      activeStreak: 1,
    });

    DatabaseService.instance.statistic.calcHabitStatistics = jest.fn().mockReturnValue(
      jest.fn().mockReturnValue({
        startDate: '2025-01-01',
        endDate: '2025-01-13',
        expectedNoOfDays: 4,
        actualNoOfDays: 2,
      }),
    );
  });

  it('should render correctly', async () => {
    const { getByText, queryAllByText } = render(<StatisticsPage />);
    await waitFor(() => {
      expect(queryAllByText('1 day')).toHaveLength(2); // from the streak
    });
    getByText(mockHabit1.name);

    getByText('2 / 4');
  });

  it('handle missing createdAt', async () => {
    DatabaseService.instance.habit.getHabitByIdQuery = jest.fn().mockReturnValue([
      {
        ...mockHabit1,
        createdAt: undefined,
      },
    ]);
    // should not have error
    render(<StatisticsPage />);
  });

  it('error are handled', async () => {
    const spiedToastError = jest.spyOn(console, 'error');
    (useLiveQuery as jest.Mock).mockImplementation(() => ({
      data: [],
      error: new Error('Error fetching habit data.'),
    }));
    render(<StatisticsPage />);

    expect(spiedToastError).toHaveBeenCalled();
  });
});
