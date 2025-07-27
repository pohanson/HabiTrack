import HabitCirclesPage from '@/app/(app)/habitCircles/view';
import { DatabaseService } from '@/services';
import { render, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native';

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      group: {
        getGroupsByUserIdQuery: jest.fn(),
      },
      user: {
        getUsernameById: jest.fn(),
      },
      userId: 'testUserId',
    },
  },
}));

describe('HabitCirclesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DatabaseService.instance.group.getGroupsByUserIdQuery = jest
      .fn()
      .mockReturnValue([{ group: { id: '1', name: 'Test Group 1', admin_id: 'adminId' } }]);
    DatabaseService.instance.user.getUsernameById = jest.fn().mockResolvedValue('adminUsername');
  });

  it('should render groups correctly', async () => {
    // Test implementation
    const { getByText } = render(<HabitCirclesPage />);
    await waitForElementToBeRemoved(() => getByText('Loading...'));
    getByText('Your Groups');
    getByText('Test Group 1');
    await waitFor(() => {
      getByText('@adminUsername');
    });
  });

  it('should render no groups', async () => {
    DatabaseService.instance.group.getGroupsByUserIdQuery = jest.fn().mockReturnValue([]);
    const { getByText } = render(<HabitCirclesPage />);
    await waitForElementToBeRemoved(() => getByText('Loading...'));
    getByText('You have no Habit Circles yet.', { exact: false });
  });
});
