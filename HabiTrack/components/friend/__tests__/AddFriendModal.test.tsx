import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AddFriendModal } from '../AddFriendModal';
import { DatabaseService } from '@/services';

jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: () => '#000',
}));

const mockSetIsAddModalVisible = jest.fn();

const mockGetUserFriends = DatabaseService.instance.friend.getUserFriends as jest.Mock;
const mockSearchUser = DatabaseService.instance.user.searchUser as jest.Mock;
const mockAddFriend = DatabaseService.instance.friend.addFriend as jest.Mock;

jest.mock('@/services', () => ({
  DatabaseService: {
    instance: {
      friend: {
        getUserFriends: jest.fn(),
        addFriend: jest.fn(),
      },
      user: {
        searchUser: jest.fn(),
      },
      userId: '0',
    },
  },
}));

const mockUser1 = {
  id: '1',
  username: 'user1',
  name: 'User 1',
  password: 'password',
  bio: 'user 1 random bio',
  profilePicture: 'profile1.jpg',
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
  isDeleted: false,
};

const mockUser2 = {
  id: '2',
  username: 'user2',
  name: 'User 2',
  password: 'password',
  bio: 'user 2 random bio',
  profilePicture: 'profile2.jpg',
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
  isDeleted: false,
};

const mockUser3 = {
  id: '3',
  username: 'user3',
  name: 'User 3',
  password: 'password',
  bio: 'user 3 random bio',
  profilePicture: 'profile3.jpg',
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
  isDeleted: false,
};

describe('<AddFriendModal />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserFriends.mockResolvedValue([]);
    mockSearchUser.mockResolvedValue([]);
    mockAddFriend.mockResolvedValue(undefined);
  });

  it('displays without crashing', async () => {
    mockGetUserFriends.mockResolvedValue([mockUser1, mockUser2, mockUser3]);
    mockSearchUser.mockResolvedValue([mockUser1, mockUser2]);
    const { getByTestId } = render(
      <AddFriendModal visible={true} setIsAddModalVisible={mockSetIsAddModalVisible} />,
    );

    expect(getByTestId('add-friend-modal')).toBeTruthy();
    expect(getByTestId('add-friend-modal-outer-container')).toBeTruthy();
    expect(getByTestId('add-friend-modal-inner-container')).toBeTruthy();
    expect(getByTestId('add-friend-modal-title')).toBeTruthy();
    expect(getByTestId('add-friend-modal-search-input')).toBeTruthy();
    expect(getByTestId('add-friend-modal-close-button')).toBeTruthy();
  });

  it('displays friend suggestions after search', async () => {
    mockGetUserFriends.mockResolvedValue([mockUser1, mockUser2, mockUser3]);
    mockSearchUser.mockResolvedValue([mockUser1, mockUser2]);
    const { getByTestId, findByTestId, queryByTestId } = render(
      <AddFriendModal visible={true} setIsAddModalVisible={mockSetIsAddModalVisible} />,
    );

    fireEvent.changeText(getByTestId('add-friend-modal-search-input'), 'user');
    await waitFor(() => {
      expect(findByTestId('friend-card-1')).toBeTruthy();
      expect(findByTestId('friend-card-2')).toBeTruthy();
      expect(queryByTestId('friend-card-3')).toBeFalsy();
    });
  });

  it('closes modal when close button is pressed', () => {
    const { getByTestId } = render(
      <AddFriendModal visible={true} setIsAddModalVisible={mockSetIsAddModalVisible} />,
    );
    fireEvent.press(getByTestId('add-friend-modal-close-button'));
    expect(mockSetIsAddModalVisible).toHaveBeenCalledWith(false);
  });

  it('adds friend when add button is pressed', async () => {
    mockGetUserFriends.mockResolvedValue([mockUser1, mockUser2, mockUser3]);
    mockSearchUser.mockResolvedValue([mockUser1, mockUser2]);
    const { getByTestId } = render(
      <AddFriendModal visible={true} setIsAddModalVisible={mockSetIsAddModalVisible} />,
    );

    fireEvent.changeText(getByTestId('add-friend-modal-search-input'), 'user');
    await waitFor(() => {
      expect(getByTestId('friend-card-1')).toBeTruthy();
    });

    fireEvent.press(getByTestId('friend-card-1'));
    expect(mockAddFriend).toHaveBeenCalledWith(mockUser1.id);
  });
});
