import CreateGroupPage from '@/app/(app)/habitCircles/create';
import { mockUser2 } from '@/mocks/user';
import { DatabaseService } from '@/services';
import { fireEvent, act, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      group: {
        createGroup: jest.fn(),
      },
      friend: {
        getUserFriends: jest.fn(),
      },
    },
  },
}));

describe('CreateGroupPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DatabaseService.instance.group.createGroup = jest.fn().mockResolvedValue('groupid');
    DatabaseService.instance.friend.getUserFriends = jest.fn().mockResolvedValue([mockUser2]);
  });

  it('should render correctly', async () => {
    const { getByText, getAllByText } = render(<CreateGroupPage />);
    expect(getAllByText('Create Group')).not.toHaveLength(0);
    await waitFor(() => {
      getByText(mockUser2.name);
    });
  });

  it('should submit successfully', async () => {
    const { getByText, getByTestId } = render(<CreateGroupPage />);
    await waitFor(() => {
      getByText(mockUser2.name);
    });
    await act(async () => {
      fireEvent.changeText(getByTestId('RHFTextInput-name'), 'Tester Group');
      fireEvent.press(getByTestId(`${mockUser2.id}-add`));
      fireEvent.press(getByTestId('Create Group-button'));
    });
    expect(DatabaseService.instance.group.createGroup).toHaveBeenCalledWith({
      name: 'Tester Group',
      memberIds: [mockUser2.id],
    });
    expect(router.back).toHaveBeenCalled();
  });

  it('should have error submitting', async () => {
    const { getByText, getByTestId } = render(<CreateGroupPage />);
    await waitFor(() => {
      getByText(mockUser2.name);
    });
    await act(async () => {
      fireEvent.press(getByTestId(`${mockUser2.id}-add`));
      fireEvent.press(getByTestId('Create Group-button'));
    });
    getByText('Group Name is required');
    expect(DatabaseService.instance.group.createGroup).not.toHaveBeenCalled();
    expect(router.back).not.toHaveBeenCalled();
  });
});
