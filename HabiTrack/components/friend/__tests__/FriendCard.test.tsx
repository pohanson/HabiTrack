import { User } from '@/db/localSchema';
import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { FriendCard } from '../FriendCard';

describe('<FriendCard />', () => {
  const mockUser1: User = {
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

  const mockUser2: User = {
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

  const mockUser3: User = {
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

  const mockOnAccept = jest.fn();
  const mockOnReject = jest.fn();

  it('displays without crashing', () => {
    const { getByTestId } = render(
      <FriendCard friend={mockUser1} onAccept={mockOnAccept} onReject={mockOnReject} />,
    );

    expect(getByTestId(`friend-card-${mockUser1.id}`)).toBeTruthy();
    expect(getByTestId(`friend-card-container-${mockUser1.id}`)).toBeTruthy();
    expect(getByTestId(`friend-text-info-${mockUser1.id}`)).toBeTruthy();
    expect(getByTestId(`friend-name-${mockUser1.id}`)).toBeTruthy();
    expect(getByTestId(`friend-username-${mockUser1.id}`)).toBeTruthy();
    expect(getByTestId(`friend-buttons-${mockUser1.id}`)).toBeTruthy();
  });

  it('displays friend profile picture correctly when available', () => {
    const { getByTestId, queryByTestId } = render(
      <FriendCard friend={mockUser1} onAccept={mockOnAccept} onReject={mockOnReject} />,
    );

    const profilePicture = getByTestId(`friend-card-${mockUser1.id}`).findByType('Image');
    expect(profilePicture.props.source.uri).toBe(
      `data:image/jpeg;base64,${mockUser1.profilePicture}`,
    );
    expect(queryByTestId(`placeholder-profile-picture-text-${mockUser1.id}`)).toBeFalsy();
  });

  it('displays friend profile picture placeholder when friend profile picture is not available', () => {
    const { getByTestId, queryByTestId } = render(
      <FriendCard
        friend={{ ...mockUser1, profilePicture: null }}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />,
    );

    expect(getByTestId(`placeholder-profile-picture-text-${mockUser1.id}`)).toBeTruthy();
    expect(queryByTestId(`profile-picture-${mockUser1.id}`)).toBeFalsy();
  });

  it('displays friend text information correctly', () => {
    const { getByTestId } = render(
      <FriendCard friend={mockUser2} onAccept={mockOnAccept} onReject={mockOnReject} />,
    );

    expect(getByTestId(`friend-name-${mockUser2.id}`).props.children).toBe(mockUser2.name);
    expect(getByTestId(`friend-username-${mockUser2.id}`).props.children).toEqual(['@', 'user2']);
  });

  it('does not display any buttons when no actions are provided', () => {
    const { queryByTestId } = render(<FriendCard friend={mockUser3} />);

    expect(queryByTestId(`friend-accept-button-${mockUser3.id}`)).toBeFalsy();
    expect(queryByTestId(`friend-reject-button-${mockUser3.id}`)).toBeFalsy();
    expect(queryByTestId(`friend-add-button-${mockUser3.id}`)).toBeFalsy();
  });

  it('displays only accept button when only onAccept is provided', () => {
    const { getByTestId, queryByTestId } = render(
      <FriendCard friend={mockUser1} onAccept={mockOnAccept} onReject={undefined} />,
    );

    expect(getByTestId(`friend-accept-button-${mockUser1.id}`)).toBeTruthy();
    expect(queryByTestId(`friend-reject-button-${mockUser1.id}`)).toBeFalsy();
    expect(queryByTestId(`friend-add-button-${mockUser1.id}`)).toBeFalsy();
  });

  it('displays only reject button when only onReject is provided', () => {
    const { getByTestId, queryByTestId } = render(
      <FriendCard friend={mockUser2} onAccept={undefined} onReject={mockOnReject} />,
    );

    expect(getByTestId(`friend-reject-button-${mockUser2.id}`)).toBeTruthy();
    expect(queryByTestId(`friend-accept-button-${mockUser2.id}`)).toBeFalsy();
    expect(queryByTestId(`friend-add-button-${mockUser2.id}`)).toBeFalsy();
  });

  it('displays add button when onAdd is provided', () => {
    const mockOnAdd = jest.fn();
    const { getByTestId } = render(<FriendCard friend={mockUser3} onAdd={mockOnAdd} />);

    expect(getByTestId(`friend-add-button-${mockUser3.id}`)).toBeTruthy();
  });

  it('displays accept and reject buttons when both onAccept and onReject are provided', () => {
    const { getByTestId, queryByTestId } = render(
      <FriendCard friend={mockUser1} onAccept={mockOnAccept} onReject={mockOnReject} />,
    );

    expect(getByTestId(`friend-accept-button-${mockUser1.id}`)).toBeTruthy();
    expect(getByTestId(`friend-reject-button-${mockUser1.id}`)).toBeTruthy();
    expect(queryByTestId(`friend-add-button-${mockUser1.id}`)).toBeFalsy();
  });

  it('displays all 3 buttons when onAccept, onReject, and onAdd are provided', () => {
    const mockOnAdd = jest.fn();
    const { getByTestId } = render(
      <FriendCard
        friend={mockUser2}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
        onAdd={mockOnAdd}
      />,
    );

    expect(getByTestId(`friend-accept-button-${mockUser2.id}`)).toBeTruthy();
    expect(getByTestId(`friend-reject-button-${mockUser2.id}`)).toBeTruthy();
    expect(getByTestId(`friend-add-button-${mockUser2.id}`)).toBeTruthy();
  });

  it('calls onAccept when accept button is pressed', async () => {
    const { getByTestId } = render(
      <FriendCard friend={mockUser1} onAccept={mockOnAccept} onReject={mockOnReject} />,
    );

    await act(async () => {
      fireEvent.press(getByTestId('friend-accept-button-1'));
    });
    expect(mockOnAccept).toHaveBeenCalled();
  });

  it('calls onReject when reject button is pressed', async () => {
    const { getByTestId } = render(
      <FriendCard friend={mockUser1} onAccept={mockOnAccept} onReject={mockOnReject} />,
    );

    await act(async () => {
      fireEvent.press(getByTestId('friend-reject-button-1'));
    });
    expect(mockOnReject).toHaveBeenCalled();
  });

  it('calls onAdd when add button is pressed', async () => {
    const mockOnAdd = jest.fn();
    const { getByTestId } = render(<FriendCard friend={mockUser1} onAdd={mockOnAdd} />);

    await act(async () => {
      fireEvent.press(getByTestId('friend-add-button-1'));
    });
    expect(mockOnAdd).toHaveBeenCalled();
  });

  it('handles multiple actions correctly', async () => {
    const mockOnAdd = jest.fn();
    const { getByTestId } = render(
      <FriendCard
        friend={mockUser1}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
        onAdd={mockOnAdd}
      />,
    );
    await act(async () => {
      fireEvent.press(getByTestId('friend-accept-button-1'));
      fireEvent.press(getByTestId('friend-reject-button-1'));
      fireEvent.press(getByTestId('friend-add-button-1'));
    });
    expect(mockOnAccept).toHaveBeenCalled();
    expect(mockOnReject).toHaveBeenCalled();
    expect(mockOnAdd).toHaveBeenCalled();
  });

  it('handles long user names properly', () => {
    const userWithLongName = {
      ...mockUser1,
      name: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    };

    const { getByTestId } = render(
      <FriendCard friend={userWithLongName} onAccept={mockOnAccept} onReject={mockOnReject} />,
    );

    expect(getByTestId(`friend-name-${userWithLongName.id}`).props.children).toBe(
      userWithLongName.name,
    );
  });

  it('handles empty user names properly', () => {
    const userWithEmptyName = {
      ...mockUser1,
      name: '',
    };

    const { getByTestId } = render(
      <FriendCard friend={userWithEmptyName} onAccept={mockOnAccept} onReject={mockOnReject} />,
    );

    expect(getByTestId(`friend-name-${userWithEmptyName.id}`).props.children).toBe('');
  });
});
