import CreateHabitScreen from '@/app/(app)/habit/create';
import { DatabaseService } from '@/services';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      habit: {
        createHabitWithReminders: jest.fn().mockResolvedValue('1'),
      },
      habitMilestone: {
        createMilestone: jest.fn().mockResolvedValue(null),
      },
    },
  },
}));

describe('CreateHabitScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should submit form data and create habit', async () => {
    const { getByText, getByTestId } = render(<CreateHabitScreen />);
    await waitFor(() => {
      expect(getByText('Create Habit')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.changeText(getByTestId('RHFTextInput-name'), 'Test Habit');
      fireEvent.changeText(getByTestId('RHFTextInput-description'), 'Testing');
      fireEvent.press(getByTestId('RHFToggleInput-Mon'));
      fireEvent.press(getByText('Submit'));
    });
    expect(DatabaseService.instance.habit.createHabitWithReminders).toHaveBeenCalledWith({
      name: 'Test Habit',
      description: 'Testing',
      frequency: [1],
      time: null,
    });
  });

  it('should not submit form data and show error', async () => {
    const { getByText } = render(<CreateHabitScreen />);
    await waitFor(() => {
      expect(getByText('Create Habit')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByText('Submit'));
    });
    expect(DatabaseService.instance.habit.createHabitWithReminders).toHaveBeenCalledTimes(0);
    getByText('Habit Name is required');
    getByText('At least one day must be selected');
  });

  it('should not submit form data and show for name only', async () => {
    const { getByText, getByTestId, queryByText } = render(<CreateHabitScreen />);
    await waitFor(() => {
      expect(getByText('Create Habit')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.changeText(getByTestId('RHFTextInput-description'), 'Testing');
      fireEvent.press(getByTestId('RHFToggleInput-Mon'));
      fireEvent.press(getByText('Submit'));
    });
    expect(DatabaseService.instance.habit.createHabitWithReminders).toHaveBeenCalledTimes(0);
    getByText('Habit Name is required');
    expect(queryByText('At least one day must be selected')).toBeNull();
  });
});
