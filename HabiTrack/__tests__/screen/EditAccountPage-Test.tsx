import EditAccountPage from '@/app/(app)/account/edit/[id]';
import { User } from '@/db/schema';
import { render, waitFor } from '@testing-library/react-native';

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      user: {
        getUserById: jest.fn().mockResolvedValue({
          id: 'asdfqwertyuizxcv',
          username: 'johndoe',
          name: 'John Doe',
          password: '$2a$10$syT94VQnn/TXIoNiZmMGzejcUpEOUA2aqCjzD2O5fetvBVWeESRnW',
          bio: 'This is a test user.',
          profilePicture: null,
          createdAt: '2025-06-26T19:16:14.823Z',
          modifiedAt: '2025-07-26T19:16:14.823Z',
          isDeleted: false,
        } as User),
      },
    },
  },
}));

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn().mockReturnValue({ id: 'asdfqwertyuizxcv' }),
}));

describe('EditAccountPage', () => {
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
});
