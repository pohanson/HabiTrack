import EditAccountPage from '@/app/(app)/account/edit/[id]';
import { mockUser1 } from '@/mocks/user';
import { DatabaseService } from '@/services';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      user: {
        getUserById: jest.fn(),
        updateUser: jest.fn(),
      },
    },
  },
}));

describe('EditAccountPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DatabaseService.instance.user.getUserById = jest.fn().mockResolvedValue(mockUser1);
    DatabaseService.instance.user.updateUser = jest.fn().mockResolvedValue(null);
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'asdfqwertyuizxcv' });
    (launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [
        'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII',
      ],
    });
  });

  it('should render the EditAccountPage correctly', async () => {
    const { getByText, getByDisplayValue } = render(<EditAccountPage />);

    await waitFor(() => {
      getByText('Edit Account'); // header
      getByText('Edit Profile Picture');
      getByText('No profile picture'); // The mock user don't have a profile picture
      getByDisplayValue('John Doe'); // name input
      getByDisplayValue('This is a test user.'); // bio input
      getByText('Update');
    });
  });

  it('should display image', async () => {
    DatabaseService.instance.user.getUserById = jest.fn().mockResolvedValue({
      ...mockUser1,
      profilePicture:
        'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII',
    });
    const { getByText, getByDisplayValue, queryByText } = render(<EditAccountPage />);

    await waitFor(() => {
      getByText('Edit Account'); // header
      getByText('Edit Profile Picture');
      getByDisplayValue('John Doe'); // name input
      getByDisplayValue('This is a test user.'); // bio input
      getByText('Update');
    });
    expect(queryByText('No profile picture')).toBeNull();
  });

  it('should go back when userId is missing', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '' });
    render(<EditAccountPage />);
    await waitFor(() => {
      expect(router.back).not.toHaveBeenCalledTimes(0);
    });
  });

  it('should submit successfully', async () => {
    const { getByText, getByDisplayValue } = render(<EditAccountPage />);
    await waitFor(() => {
      getByText('Edit Account'); // header
      getByText('Edit Profile Picture');
      getByText('No profile picture'); // The mock user don't have a profile picture
      getByDisplayValue('John Doe'); // name input
      getByDisplayValue('This is a test user.'); // bio input
    });
    fireEvent.press(getByText('Edit Profile Picture'));
    expect(launchImageLibraryAsync).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.changeText(getByDisplayValue('John Doe'), 'Test User');
      fireEvent.press(getByText('Update'));
    });
    await waitFor(() => {
      expect(DatabaseService.instance.user.updateUser).toHaveBeenCalledTimes(1);
    });
  });
});
