import FriendPage from '@/app/(app)/friend/[id]';
import { mockUser1 } from '@/mocks/user';
import { DatabaseService } from '@/services';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn().mockReturnValue({ id: 'qwertyuiopasdfgh' }),
}));

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      user: {
        getUserById: jest.fn((id: string) =>
          Promise.resolve(
            {
              asdfqwertyuizxcv: mockUser1,
              qwertyuiopasdfgh: {
                id: 'qwertyuiopasdfgh',
                username: 'janedoe',
                name: 'Jane Doe',
                password: '$2a$10$syT94VQnn/TXIoNiZmMGzejcUpEOUA2aqCjzD2O5fetvBVWeESRnW',
                bio: 'This is a friend.',
                profilePicture: null,
                createdAt: '2025-06-22T19:16:14.823Z',
                modifiedAt: '2025-07-16T19:16:14.823Z',
                isDeleted: false,
              },
            }[id] || null,
          ),
        ),
      },
      habitMilestone: {
        getAllMilestonesQuery: jest.fn((userId: string) =>
          Promise.resolve([
            { habit_id: '1', habit_name: 'Exercise', week_streak: 5, badges_earned: 2 },
          ]),
        ),
      },
      habit: {
        getAllHabits: jest.fn((userId) =>
          Promise.resolve(
            userId === 'qwertyuiopasdfgh'
              ? [
                  {
                    id: '1',
                    name: 'Exercise',
                    description: 'This is a test habit.',
                    user_id: 'qwertyuiopasdfgh',
                    frequencyModifiedAt: new Date(2025, 7, 7).toISOString(),
                  },
                ]
              : [],
          ),
        ),
      },
    },
  },
}));

describe('FriendPage', () => {
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
});
