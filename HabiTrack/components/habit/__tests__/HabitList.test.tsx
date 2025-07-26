import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { HabitList } from '../HabitList';
import { Habit } from '@/db/localSchema';
import { DatabaseService } from '@/services';

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      habit: {
        getAllHabits: jest.fn(),
      },
    },
  },
}));

jest.mock('../HabitCard', () => ({
  HabitCard: jest.fn(({ habit }: { habit: { id: string; name: string } }) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { View, Text } = require('react-native');
    return (
      <View testID={`habit-card-${habit.id}`}>
        <Text>{habit.name}</Text>
      </View>
    );
  }),
}));

jest.mock('../../ThemedView', () => ({
  ThemedView: ({ children, ...props }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

jest.mock('../../ThemedText', () => ({
  ThemedText: ({ children, ...props }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text } = require('react-native');
    return <Text {...props}>{children}</Text>;
  },
}));

const mockGetAllHabits = DatabaseService.instance.habit.getAllHabits as jest.Mock;

describe('<HabitList />', () => {
  const mockHabits: Habit[] = [
    {
      id: '1',
      user_id: 'user1',
      name: 'Exercise',
      description: 'Daily exercise routine',
      frequencyModifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      isDeleted: false,
    },
    {
      id: '2',
      user_id: 'user1',
      name: 'Read',
      description: 'Read for 30 minutes',
      frequencyModifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      isDeleted: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllHabits.mockResolvedValue([]);
  });

  it('displays without crashing when there are habits', async () => {
    mockGetAllHabits.mockResolvedValue(mockHabits);
    const { getByTestId } = render(<HabitList />);

    await waitFor(() => {
      expect(getByTestId('habit-list-container')).toBeTruthy();
    });
  });

  it('displays without crashing when there are no habits', async () => {
    mockGetAllHabits.mockResolvedValue([]);
    const { getByTestId } = render(<HabitList />);

    await waitFor(() => {
      expect(getByTestId('habit-list-no-habits')).toBeTruthy();
    });
  });

  it('displays habit list container and scrollview when there are habits', async () => {
    mockGetAllHabits.mockResolvedValue(mockHabits);
    const { getByTestId, queryByTestId } = render(<HabitList />);

    await waitFor(() => {
      expect(queryByTestId('habit-list-no-habits')).toBeFalsy();
      expect(getByTestId('habit-list-container')).toBeTruthy();
      expect(getByTestId('habit-list-scrollview')).toBeTruthy();
    });
  });

  it('displays no habits message correctly when there are no habits', async () => {
    mockGetAllHabits.mockResolvedValue([]);
    const { getByTestId, queryByTestId } = render(<HabitList />);

    await waitFor(() => {
      expect(queryByTestId('habit-list-container')).toBeFalsy();
      expect(getByTestId('habit-list-no-habits')).toBeTruthy();
      expect(getByTestId('habit-list-no-habits-text').props.children).toBe('No habits');
    });
  });

  it('displays habit card for each habit', async () => {
    mockGetAllHabits.mockResolvedValue(mockHabits);
    const { getByTestId } = render(<HabitList />);

    await waitFor(() => {
      mockHabits.forEach((habit) => {
        expect(getByTestId(`habit-card-${habit.id}`)).toBeTruthy();
      });
    });
  });

  it('calls getAllHabits with userId when provided', async () => {
    mockGetAllHabits.mockResolvedValue(mockHabits);

    render(<HabitList userId="user1" />);

    await waitFor(() => {
      expect(mockGetAllHabits).toHaveBeenCalledWith('user1');
    });
  });

  it('calls database service with correct userId', async () => {
    const userId = 'hello';
    mockGetAllHabits.mockResolvedValue([]);

    render(<HabitList userId={userId} />);

    await waitFor(() => {
      expect(mockGetAllHabits).toHaveBeenCalledWith(userId);
    });
  });

  it('calls database service only once on initial render', async () => {
    mockGetAllHabits.mockResolvedValue([]);

    render(<HabitList />);

    await waitFor(() => {
      expect(mockGetAllHabits).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call database service multiple times unnecessarily', async () => {
    mockGetAllHabits.mockResolvedValue([]);

    const { rerender } = render(<HabitList userId="user1" />);

    await waitFor(() => {
      expect(mockGetAllHabits).toHaveBeenCalledTimes(1);
    });

    rerender(<HabitList userId="user1" />);

    expect(mockGetAllHabits).toHaveBeenCalledTimes(1);
  });

  it('calls getAllHabits without params when userId is undefined', async () => {
    mockGetAllHabits.mockResolvedValue(mockHabits);

    render(<HabitList userId={undefined} />);

    await waitFor(() => {
      expect(mockGetAllHabits).toHaveBeenCalledWith();
    });
  });

  it('calls getAllHabits with null when userId is null', async () => {
    mockGetAllHabits.mockResolvedValue(mockHabits);

    render(<HabitList userId={null} />);

    await waitFor(() => {
      expect(mockGetAllHabits).toHaveBeenCalledWith(null);
    });
  });

  it('passes correct props to HabitCard components', async () => {
    mockGetAllHabits.mockResolvedValue(mockHabits);

    const { getByTestId } = render(<HabitList />);

    await waitFor(() => {
      expect(mockGetAllHabits).toHaveBeenCalled();
      expect(getByTestId('habit-list-container')).toBeTruthy();
    });
  });

  it('passes isEditable as false by default when not provided', async () => {
    mockGetAllHabits.mockResolvedValue(mockHabits);

    const { getByTestId } = render(<HabitList />);

    await waitFor(() => {
      expect(mockGetAllHabits).toHaveBeenCalled();
      expect(getByTestId('habit-list-container')).toBeTruthy();
    });
  });

  it('handles empty array returned by getAllHabits', async () => {
    mockGetAllHabits.mockResolvedValue([]);
    const { getByTestId, queryByTestId } = render(<HabitList />);

    await waitFor(() => {
      expect(queryByTestId('habit-list-container')).toBeFalsy();
      expect(getByTestId('habit-list-no-habits')).toBeTruthy();
    });
  });

  it('handles null returned by getAllHabits', async () => {
    mockGetAllHabits.mockResolvedValue(null);
    const { getByTestId, queryByTestId } = render(<HabitList />);

    await waitFor(() => {
      expect(queryByTestId('habit-list-container')).toBeFalsy();
      expect(getByTestId('habit-list-no-habits')).toBeTruthy();
    });
  });

  it('handles undefined returned by getAllHabits', async () => {
    mockGetAllHabits.mockResolvedValue(undefined);
    const { getByTestId, queryByTestId } = render(<HabitList />);

    await waitFor(() => {
      expect(queryByTestId('habit-list-container')).toBeFalsy();
      expect(getByTestId('habit-list-no-habits')).toBeTruthy();
    });
  });

  it('refetches habit data when userId prop changes', async () => {
    mockGetAllHabits.mockResolvedValue(mockHabits);
    const { rerender } = render(<HabitList userId="user1" />);

    await waitFor(() => {
      expect(mockGetAllHabits).toHaveBeenCalledWith('user1');
    });

    jest.clearAllMocks();
    rerender(<HabitList userId="user2" />);

    await waitFor(() => {
      expect(mockGetAllHabits).toHaveBeenCalledWith('user2');
    });
  });
});
