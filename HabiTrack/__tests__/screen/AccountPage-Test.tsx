import AccountPage from '@/app/(app)/(tabs)/account';
import { useUserContext } from '@/context/UserContext';
import { mockUser1 } from '@/mocks/user';
import { DatabaseService } from '@/services';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { router, useFocusEffect } from 'expo-router';

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      user: {
        getCurrentUser: jest.fn(),
        signoutUser: jest.fn(),
      },
    },
  },
}));

describe('AccountPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    router.push = jest.fn();
    DatabaseService.instance.user.getCurrentUser = jest.fn().mockResolvedValue(mockUser1);
    DatabaseService.instance.user.signoutUser = jest.fn().mockResolvedValue(null);
  });

  it('should render account details when user is logged in', async () => {
    const { getByText, queryByText } = render(<AccountPage />);

    act(() => {
      const mockUseFocusEffect = useFocusEffect as jest.Mock;
      mockUseFocusEffect.mock.calls[0][0]();
    });

    expect(getByText('Your Profile')).toBeTruthy();

    await waitFor(() => {
      // ensure the usercontext is set
      expect((useUserContext as jest.Mock).mock.calls.length).toBeGreaterThan(0);
      getByText('John Doe');
      getByText('@johndoe');
      getByText('This is a test user.');
      expect(queryByText('No user found. Please logout and relogin.')).toBeNull();
    });
  });

  it("should show 'No user found' when no user is logged in", async () => {
    DatabaseService.instance.user.getCurrentUser = jest.fn().mockResolvedValue(null);

    const { getByText, queryByText } = render(<AccountPage />);

    act(() => {
      const mockUseFocusEffect = useFocusEffect as jest.Mock;
      mockUseFocusEffect.mock.calls[0][0]();
    });

    await waitFor(() => {
      // ensure the usercontext is set
      expect((useUserContext as jest.Mock).mock.calls.length).toBeGreaterThan(0);
      getByText('User Profile');
      getByText('No user found. Please logout and relogin.');
      expect(queryByText('John Doe')).toBeNull();
      expect(queryByText('@johndoe')).toBeNull();
      expect(queryByText('This is a test user.')).toBeNull();
    });
  });

  it('should navigate to edit profile page', async () => {
    const { getByText } = render(<AccountPage />);

    act(() => {
      const mockUseFocusEffect = useFocusEffect as jest.Mock;
      mockUseFocusEffect.mock.calls[0][0]();
    });
    await waitFor(() => {
      getByText(mockUser1.name);
    });
    act(() => {
      fireEvent.press(getByText('Edit Profile'));
    });

    expect(router.push).toHaveBeenCalledWith(`/account/edit/${mockUser1.id}`);
  });

  it('should signout user when clicked', async () => {
    const { getByText } = render(<AccountPage />);

    act(() => {
      const mockUseFocusEffect = useFocusEffect as jest.Mock;
      mockUseFocusEffect.mock.calls[0][0]();
    });
    await waitFor(() => {
      getByText(mockUser1.name);
    });
    act(() => {
      fireEvent.press(getByText('Log Out'));
    });

    expect(DatabaseService.instance.user.signoutUser).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/signin');
    });
  });
});
