import HomeScreen from '@/app/(app)/(tabs)';
import { Habit, HabitCompletion, HabitMilestone, Reminder } from '@/db/schema';
import { PartialSync } from '@/repositories/SyncableRepository';
import { DatabaseService } from '@/services';
import { render, waitFor } from '@testing-library/react-native/build/pure';

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      habit: {
        getAllHabitsToday: jest.fn().mockResolvedValue([
          {
            habit: {
              id: '1',
              name: 'Test Habit fdsa',
              description: 'This is a test habit.',
              user_id: 'asdfqwertyuizxcv',
              frequencyModifiedAt: new Date(2025, 7, 7).toISOString(),
            },
          },
        ] as {
          habit: PartialSync<Habit>;
          habit_completion: HabitCompletion | null;
          reminder: Reminder | null;
          habit_milestone: HabitMilestone | null;
        }[]),
      },
    },
  },
}));

describe('HomeScreen', () => {
  it('should render one habit correctly', async () => {
    const { getByText } = render(<HomeScreen />);

    getByText("Today's Habits");

    await waitFor(() => {
      getByText('Test Habit fdsa'); // should only have one habit.
    });
  });

  it('should render many habit correctly', async () => {
    DatabaseService.instance.habit.getAllHabitsToday = jest.fn().mockResolvedValue([
      {
        habit: {
          id: '1',
          name: 'Test Habit fdsa',
          description: 'This is a test habit.',
          user_id: 'asdfqwertyuizxcv',
          frequencyModifiedAt: new Date(2025, 7, 7).toISOString(),
        },
      },

      {
        habit: {
          id: '2',
          name: 'Test Habit2 fdsa',
          description: 'Another great habit.',
          user_id: 'asdfqwertyuizxcv',
          frequencyModifiedAt: new Date(2025, 7, 7).toISOString(),
        },
      },
    ] as {
      habit: PartialSync<Habit>;
      habit_completion: HabitCompletion | null;
      reminder: Reminder | null;
      habit_milestone: HabitMilestone | null;
    }[]);
    const { getByText, queryAllByText } = render(<HomeScreen />);

    getByText("Today's Habits");

    await waitFor(() => {
      expect(queryAllByText('fdsa', { exact: false })).toHaveLength(2); // should have 2
    });
  });

  it('should show "No habits for today." when no habits are present', async () => {
    DatabaseService.instance.habit.getAllHabitsToday = jest.fn().mockResolvedValue([]);
    const { getByText, queryByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(queryByText('Test Habit fdsa', { exact: false })).toBeNull();
    });
    getByText('No habits for today.');
  });
});
