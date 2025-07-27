import EditHabitPage from '@/app/(app)/habit/edit';
import { mockHabit1 } from '@/mocks/habit';
import { DatabaseService } from '@/services';
import {
  act,
  fireEvent,
  render,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(() => ({
    back: jest.fn(),
  })),
  router: {
    back: jest.fn(),
  },
}));

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      habit: {
        getHabitWithReminders: jest.fn(),
        updateHabitWithReminders: jest.fn(),
        deleteHabit: jest.fn(),
      },
      reminder: {
        getRemindersForHabit: jest.fn(),
      },
    },
  },
}));

describe('EditHabitPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DatabaseService.instance.habit.deleteHabit = jest.fn().mockResolvedValue(null);

    DatabaseService.instance.reminder.getRemindersForHabit = jest.fn().mockResolvedValue([
      { day: 0, time: '0800' },
      { day: 5, time: '0800' },
    ]);
    DatabaseService.instance.habit.getHabitWithReminders = jest.fn().mockResolvedValue({
      habit: mockHabit1,
      reminders: [
        { day: 0, time: '0800' },
        { day: 5, time: '0800' },
      ],
    });

    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: mockHabit1.id });
  });
  it('should render correctly', async () => {
    const { getByText, getByTestId } = render(<EditHabitPage />);
    await waitFor(() => {
      getByText('Edit Habit');
    });
    expect(getByTestId('RHFTextInput-name')).toHaveProp('value', mockHabit1.name);
    expect(getByTestId('RHFTextInput-description')).toHaveProp('value', mockHabit1.description);
    expect(getByTestId('RHFToggleInput-Sun')).toHaveProp('accessibilityLabel', 'Sun selected');
    expect(getByTestId('RHFToggleInput-Mon')).toHaveProp('accessibilityLabel', 'Mon not selected');
    expect(getByTestId('RHFToggleInput-Tue')).toHaveProp('accessibilityLabel', 'Tue not selected');
    expect(getByTestId('RHFToggleInput-Wed')).toHaveProp('accessibilityLabel', 'Wed not selected');
    expect(getByTestId('RHFToggleInput-Thu')).toHaveProp('accessibilityLabel', 'Thu not selected');
    expect(getByTestId('RHFToggleInput-Fri')).toHaveProp('accessibilityLabel', 'Fri selected');
    expect(getByTestId('RHFToggleInput-Sat')).toHaveProp('accessibilityLabel', 'Sat not selected');
    getByText('0800');
    getByText('Save Changes');
  });

  it('should edit correctly', async () => {
    const { getByText, getByTestId } = render(<EditHabitPage />);
    await waitFor(() => {
      getByText('Edit Habit');
    });

    expect(getByTestId('RHFTextInput-name')).toHaveProp('value', mockHabit1.name);
    await act(async () => {
      fireEvent.changeText(getByTestId('RHFTextInput-name'), 'Another');
      fireEvent.press(getByText('Save Changes'));
    });
  });

  it('should be able to delete habit', async () => {
    const { getByText } = render(<EditHabitPage />);

    await waitFor(() => {
      getByText('Edit Habit');
    });
    await act(async () => {
      await userEvent.press(getByText('Delete Habit'));
    });
    expect(DatabaseService.instance.habit.deleteHabit).toHaveBeenCalledWith(mockHabit1.id);
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it('should show error editing habit', async () => {
    // Missing Habit
    const { getByText, getByTestId } = render(<EditHabitPage />);

    await waitFor(() => {
      getByText('Edit Habit');
    });

    await act(async () => {
      fireEvent.changeText(getByTestId('RHFTextInput-name'), '');
      await userEvent.press(getByTestId('RHFToggleInput-Sun'));
      await userEvent.press(getByTestId('RHFToggleInput-Fri'));
      fireEvent.press(getByText('Save Changes'));
    });
  });

  it('habit id missing', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: null });
    render(<EditHabitPage />);
    expect(router.back).toHaveBeenCalled();
  });

  it('habit not found', async () => {
    DatabaseService.instance.habit.getHabitWithReminders = jest.fn().mockResolvedValue(null);
    const { getByText } = render(<EditHabitPage />);
    await waitForElementToBeRemoved(() => getByText('Loading...'), { timeout: 5000 });
    expect(router.back).toHaveBeenCalled();
  });

  it('frequency is edited should show popup and not update habit', async () => {
    const spiedAlert = jest.spyOn(Alert, 'alert');
    const { getByText, getByTestId } = render(<EditHabitPage />);
    await waitFor(() => {
      getByText('Edit Habit');
    });

    expect(getByTestId('RHFTextInput-name')).toHaveProp('value', mockHabit1.name);
    expect(spiedAlert).not.toHaveBeenCalled();
    await act(async () => {
      await userEvent.press(getByTestId('RHFToggleInput-Tue'));
      fireEvent.press(getByText('Save Changes'));
    });
    expect(spiedAlert).toHaveBeenCalled();
    expect(DatabaseService.instance.habit.updateHabitWithReminders).not.toHaveBeenCalled();
  });
});
