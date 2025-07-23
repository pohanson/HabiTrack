import AccountPage from '@/app/(app)/(tabs)/account';
import { useUserContext } from '@/context/UserContext';
import { User } from '@/db/schema';
import { DatabaseService } from '@/services';
import { act, render, waitFor } from '@testing-library/react-native';
import { useFocusEffect } from 'expo-router';

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      user: {
        getCurrentUser: jest.fn().mockResolvedValue({
          id: 'asdfqwertyuizxcv',
          name: 'John Doe',
          username: 'johndoe',
          bio: 'This is a test user.',
          profilePictureUrl: null,
        } as Partial<User>),
      },
    },
  },
}));

describe('AccountPage', () => {
  it('should render account details when user is logged in', async () => {
    const { getByText, queryByText } = render(<AccountPage />);

    act(() => {
      const mockUseFocusEffect = useFocusEffect as jest.Mock;
      mockUseFocusEffect.mock.calls[0][0]();
    });

    expect(getByText('User Profile')).toBeTruthy();

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
    (DatabaseService.instance.user.getCurrentUser as jest.Mock).mockResolvedValue(null);

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
});
