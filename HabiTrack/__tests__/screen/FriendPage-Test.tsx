import FriendPage from '@/app/(app)/friend/[id]';
import { mockHabit1 } from '@/mocks/habit';
import { mockUser1, mockUser2 } from '@/mocks/user';
import { DatabaseService } from '@/services';
import {
  act,
  render,
  screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      user: {
        getUserById: jest.fn(),
      },
      habitMilestone: {
        getAllMilestonesQuery: jest.fn(),
      },
      habit: {
        getAllHabits: jest.fn(),
      },
    },
  },
}));

describe('FriendPage', () => {
  beforeEach(() => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'qwertyuiopasdfgh' });

    DatabaseService.instance.user.getUserById = jest.fn((id: string) =>
      Promise.resolve(
        {
          asdfqwertyuizxcv: mockUser1,
          qwertyuiopasdfgh: mockUser2,
        }[id] || null,
      ),
    );

    DatabaseService.instance.habitMilestone.getAllMilestonesQuery = jest
      .fn()
      .mockResolvedValue([
        { habit_id: '1', habit_name: 'Exercise', week_streak: 5, badges_earned: 2 },
      ]);
    DatabaseService.instance.habit.getAllHabits = jest.fn((userId) =>
      Promise.resolve(userId === 'qwertyuiopasdfgh' ? [mockHabit1] : []),
    );
  });

  it('should render friend details', async () => {
    // could not properly test with the habit because of issue with
    // the react-native-collapsible-tab-view. It is lazy loaded.
    render(<FriendPage />);
    const { getByText } = screen;
    // followed the help here https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
    await waitForElementToBeRemoved(() => getByText('Loading friend...'), { timeout: 5000 });
    await waitFor(() => {
      getByText('Jane Doe');
      getByText('@janedoe');
      getByText('This is a friend.');
    });
  });

  it('should show Friend not found', async () => {
    (DatabaseService.instance.user.getUserById as jest.Mock).mockResolvedValue(null);

    render(<FriendPage />);
    const { getByText } = screen;
    await waitForElementToBeRemoved(() => getByText('Loading friend...'), { timeout: 5000 });
    getByText('Friend not found');
  });

  it('should navigate to milestone page', async () => {
    const { getByText, queryByText, getByTestId } = render(<FriendPage />);
    await waitForElementToBeRemoved(() => getByText('Loading friend...'), { timeout: 5000 });
    expect(queryByText('Friend not found')).toBeNull();
    const user = userEvent.setup();
    await act(async () => {
      await user.press(getByTestId('milestone-tab'));
    });
    await waitFor(() => {
      getByText('Ranks');
    });
  });

  it('should shown Friend not found when missing id', async () => {
    (useLocalSearchParams as jest.Mock).mockImplementation(() => ({ id: '' }));
    const { getByText } = render(<FriendPage />);
    getByText('Friend not found');
  });
});
