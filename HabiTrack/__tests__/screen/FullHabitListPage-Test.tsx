import FullHabitListPage from '@/app/(app)/habit/full-list';
import { mockHabit1 } from '@/mocks/habit';
import { DatabaseService } from '@/services';
import { render, waitFor } from '@testing-library/react-native';

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      habit: {
        getAllHabits: jest.fn(),
      },
    },
  },
}));
describe('FullHabitListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DatabaseService.instance.habit.getAllHabits = jest.fn().mockResolvedValue([mockHabit1]);
  });
  it('should display habit list', async () => {
    const { getByText } = render(<FullHabitListPage />);
    await waitFor(() => {
      getByText(mockHabit1.name);
    });
  });
});
