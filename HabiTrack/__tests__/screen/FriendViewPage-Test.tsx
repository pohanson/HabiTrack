import FriendViewPage from '@/app/(app)/friend/view';
import { mockUser2 } from '@/mocks/user';
import { DatabaseService } from '@/services';
import { act, fireEvent, render, screen, userEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      friend: {
        getIncomingPendingRequests: jest.fn(),
        getUserFriends: jest.fn(),
        acceptFriendRequest: jest.fn(),
        rejectFriendRequest: jest.fn(),
      },
      user: {
        searchUser: jest.fn(),
      },
    },
  },
}));

const mockPendingUser = {
  id: 'pending',
  username: 'pendinguser',
  name: 'Pending User',
  password: '$2a$10$syT94VQnn/TXIoNiZmMGzejcUpEOUA2aqCjzD2O5fetvBVWeESRnW',
  bio: 'This is a pending user.',
  profilePicture: null,
  createdAt: '2025-06-22T19:16:14.823Z',
  modifiedAt: '2025-07-16T19:16:14.823Z',
  isDeleted: false,
};

describe('FriendViewPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DatabaseService.instance.friend.getUserFriends = jest.fn().mockResolvedValue([mockUser2]);

    DatabaseService.instance.friend.getIncomingPendingRequests = jest
      .fn()
      .mockResolvedValue([mockPendingUser]);

    DatabaseService.instance.user.searchUser = jest.fn().mockResolvedValue([mockUser2]);
    DatabaseService.instance.friend.acceptFriendRequest = jest.fn().mockResolvedValue(null);
    DatabaseService.instance.friend.rejectFriendRequest = jest.fn().mockResolvedValue(null);
  });

  it('should render friends list w/o pending', async () => {
    (DatabaseService.instance.friend.getIncomingPendingRequests as jest.Mock).mockResolvedValue([]);
    const { getByText, queryByText } = render(<FriendViewPage />);

    getByText('Your Friends');
    await waitFor(() => {
      getByText('Jane Doe');
      getByText('@janedoe');
    });
    expect(queryByText('Your Pending Requests')).toBeNull();
  });

  it('should render friends list with pending', async () => {
    const { getByText } = render(<FriendViewPage />);

    getByText('Your Friends');
    await waitFor(() => {
      getByText('Pending Requests');
      getByText('Pending User');
      getByText('@pendinguser');
      getByText('Jane Doe');
      getByText('@janedoe');
    });
  });

  it('should filter friend list, contains user', async () => {
    render(<FriendViewPage />);
    const user = userEvent.setup();
    const searchboxInput = screen.getByPlaceholderText('Search for friends...');

    await waitFor(() => {
      screen.getByText('Jane Doe');
    });
    await act(async () => {
      await user.press(searchboxInput);
      await user.type(searchboxInput, 'Jane');
    });
    screen.getByText('Jane Doe');
  });

  it("should filter friend list, don't contains user", async () => {
    render(<FriendViewPage />);
    const user = userEvent.setup();
    const searchboxInput = screen.getByPlaceholderText('Search for friends...');

    await waitFor(() => {
      screen.getByText('Jane Doe');
    });
    await act(async () => {
      await user.press(searchboxInput);
      await user.type(searchboxInput, 'z');
    });
    expect(screen.queryByText('Jane Doe')).toBeNull();
    screen.getByText('No friends found.');
  });

  it('should render no friend', async () => {
    (DatabaseService.instance.friend.getUserFriends as jest.Mock).mockResolvedValue([]);

    const { getByText } = render(<FriendViewPage />);

    getByText('Your Friends');
    await waitFor(() => {
      getByText('No friends found.');
    });
  });

  it('should open modal', async () => {
    const { getByText } = render(<FriendViewPage />);

    getByText('Your Friends');
    await waitFor(() => {
      getByText('Jane Doe');
    });

    await act(async () => {
      const addButton = screen.getByTestId('add-friend-button');
      fireEvent.press(addButton);
    });

    screen.getByText('Add Friend');
  });

  it('should accept friend request', async () => {
    const { getByText } = render(<FriendViewPage />);
    getByText('Your Friends');
    await waitFor(() => {
      getByText('Pending User');
    });

    await act(async () => {
      const acceptButton = screen.getByTestId(`friend-accept-button-${mockPendingUser.id}`);
      fireEvent.press(acceptButton);
    });
    const mockAcceptReq = DatabaseService.instance.friend.acceptFriendRequest as jest.Mock;
    expect(mockAcceptReq.mock.calls.length).toBe(1);
    expect(mockAcceptReq).toHaveBeenCalledWith(mockPendingUser.id); // the pending userid
  });

  it('should reject friend request', async () => {
    const { getByText } = render(<FriendViewPage />);
    getByText('Your Friends');
    await waitFor(() => {
      getByText('Pending User');
    });

    await act(async () => {
      const rejectButton = screen.getByTestId(`friend-reject-button-${mockPendingUser.id}`);
      fireEvent.press(rejectButton);
    });
    await waitFor(() => {
      expect(DatabaseService.instance.friend.rejectFriendRequest).toHaveBeenCalledTimes(1);
      expect(DatabaseService.instance.friend.rejectFriendRequest).toHaveBeenCalledWith(
        mockPendingUser.id,
      ); // the pending userid
    });
  });

  it('should navigate to friend page', async () => {
    const { getByText, getByTestId } = render(<FriendViewPage />);
    getByText('Your Friends');
    await waitFor(() => {
      getByText(mockUser2.name);
    });
    fireEvent.press(getByTestId('friend-card-' + mockUser2.id));
    expect(router.push).toHaveBeenCalledWith('/friend/' + mockUser2.id);
  });
});
