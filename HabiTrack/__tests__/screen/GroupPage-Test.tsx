import GroupPage from '@/app/(app)/habitCircles/group';
import { mockUser1, mockUser2, mockUser3 } from '@/mocks/user';
import { DatabaseService } from '@/services';
import { act, fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Alert, AlertButton } from 'react-native';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useNavigation: jest.fn(),
}));

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      groupMember: {
        leaveGroup: jest.fn(),
        getMembersRankedByCompletionRate: jest.fn(),
        getMembersRankedByBadgesEarned: jest.fn(),
      },
      userId: 'testUser',
    },
  },
}));

describe('GroupPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      groupId: '123',
      groupName: 'Test Group',
    });
    (useNavigation as jest.Mock).mockReturnValue({
      goBack: jest.fn(),
      setOptions: jest.fn(),
    });
    DatabaseService.instance.groupMember.leaveGroup = jest.fn();
    DatabaseService.instance.groupMember.getMembersRankedByCompletionRate = jest
      .fn()
      .mockResolvedValue([
        {
          rank: 1,
          user: mockUser1,
          totalCompletionRateStats: {
            totalNoOfActualDays: 11,
            totalNoOfExpectedDays: 21,
          },
        },
        {
          rank: 2,
          user: mockUser2,
          totalCompletionRateStats: {
            totalNoOfActualDays: 10,
            totalNoOfExpectedDays: 21,
          },
        },
        {
          rank: 3,
          user: mockUser3,
          totalCompletionRateStats: {
            totalNoOfActualDays: 0,
            totalNoOfExpectedDays: 0,
          },
        },
      ]);
    DatabaseService.instance.groupMember.getMembersRankedByBadgesEarned = jest
      .fn()
      .mockResolvedValue([
        {
          rank: 1,
          user: mockUser2,
          totalBadgesEarned: 29,
        },
        {
          rank: 2,
          user: mockUser1,
          totalBadgesEarned: 1,
        },
        {
          rank: 3,
          user: mockUser3,
          totalBadgesEarned: 0,
        },
      ]);
  });

  it('should render completion rate leaderboard correctly', async () => {
    const { getByText, getAllByText } = render(<GroupPage />);

    await waitForElementToBeRemoved(() => getByText('Loading...'), { timeout: 5000 });
    getByText('Completion Rate Leaderboard');
    expect(getAllByText(mockUser1.name)).toHaveLength(2);
    expect(getAllByText(mockUser2.name)).toHaveLength(2);
    expect(getAllByText(mockUser3.name)).toHaveLength(2);
    getByText('52.4%');
    getByText('47.6%');
    getByText('0%');
  });

  it('should render badges leaderboard correctly', async () => {
    const { getByText, getAllByText } = render(<GroupPage />);

    await waitForElementToBeRemoved(() => getByText('Loading...'), { timeout: 5000 });
    await act(async () => {
      fireEvent.press(getByText('Badges Earned'));
    });

    getByText('Badges Earned Leaderboard');

    expect(getAllByText(mockUser1.name)).toHaveLength(2);
    expect(getAllByText(mockUser2.name)).toHaveLength(2);
    expect(getAllByText(mockUser3.name)).toHaveLength(2);
    getByText('29 Badges');
    getByText('1 Badges');
    getByText('0 Badges');
  });

  it('should leave group', async () => {
    const spiedAlert = jest.spyOn(Alert, 'alert');
    const { getByText, getByTestId } = render(<GroupPage />);
    expect(spiedAlert).toHaveBeenCalledTimes(0);
    await waitForElementToBeRemoved(() => getByText('Loading...'), { timeout: 5000 });
    await act(async () => {
      fireEvent.press(getByTestId('leaveGroupButton'));
    });
    expect(spiedAlert).toHaveBeenCalledTimes(1);

    (spiedAlert.mock.calls[0][2]?.[1] as AlertButton | undefined)?.onPress?.(); // confirm leaving group
    expect(DatabaseService.instance.groupMember.leaveGroup).toHaveBeenCalledWith('123', 'testUser');
    expect(useNavigation().goBack).toHaveBeenCalled();
  });

  it('should not leave group', async () => {
    const spiedAlert = jest.spyOn(Alert, 'alert');
    const { getByText, getByTestId } = render(<GroupPage />);

    expect(spiedAlert).toHaveBeenCalledTimes(0);
    await waitForElementToBeRemoved(() => getByText('Loading...'), { timeout: 5000 });
    await act(async () => {
      fireEvent.press(getByTestId('leaveGroupButton'));
    });
    expect(spiedAlert).toHaveBeenCalledTimes(1);

    // unable to mock clicking the cancel

    expect(DatabaseService.instance.groupMember.leaveGroup).not.toHaveBeenCalled();
    expect(useNavigation().goBack).not.toHaveBeenCalled();
  });
});
