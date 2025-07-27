import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { User } from '@/db/localSchema';
import { AddGroupMemberCard } from '../AddGroupMemberCard';

describe('<AddGroupMemberCard />', () => {
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

  const mockOnToggle = jest.fn();

  const defaultProps = {
    friend: mockUser1,
    selected: false,
    onToggle: mockOnToggle,
  };

  it('displays without crashing', () => {
    const { getByTestId } = render(<AddGroupMemberCard {...defaultProps} />);

    expect(getByTestId(`add-group-member-card-${mockUser1.id}`)).toBeTruthy();
  });

  it('displays friend profile picture correctly when available', () => {
    const { getByTestId, queryByTestId } = render(<AddGroupMemberCard {...defaultProps} />);

    const profilePicture = getByTestId(`profile-picture-${mockUser1.id}`).findByType('Image');
    expect(profilePicture.props.source.uri).toBe(
      `data:image/jpeg;base64,${mockUser1.profilePicture}`,
    );
    expect(queryByTestId(`placeholder-profile-picture-${mockUser1.id}`)).toBeFalsy();
  });

  it('displays placeholder when profile picture is not available', () => {
    const { getByTestId } = render(
      <AddGroupMemberCard
        friend={{ ...mockUser1, profilePicture: null }}
        selected={false}
        onToggle={mockOnToggle}
      />,
    );

    expect(getByTestId(`placeholder-profile-picture-text-${mockUser1.id}`)).toBeTruthy();
  });

  it('displays friend name and username correctly', () => {
    const { getByTestId } = render(<AddGroupMemberCard {...defaultProps} />);

    expect(getByTestId(`friend-name-${mockUser1.id}`).props.children).toBe(mockUser1.name);
    expect(getByTestId(`friend-username-${mockUser1.id}`).props.children).toEqual([
      '@',
      `${mockUser1.username}`,
    ]);
  });

  it('calls onToggle when card is pressed pressed', async () => {
    const { getByTestId } = render(<AddGroupMemberCard {...defaultProps} />);

    const toggleButton = getByTestId(`${mockUser1.id}-add`);
    await act(async () => {
      fireEvent.press(toggleButton);
    });

    expect(defaultProps.onToggle).toHaveBeenCalled();
  });

  it('handles empty friend name and username properly', () => {
    const userWithoutName: User = { ...mockUser1, name: '' };
    const userWithoutUsername: User = { ...mockUser1, username: '' };

    const { getByTestId } = render(
      <AddGroupMemberCard friend={userWithoutName} selected={false} onToggle={mockOnToggle} />,
    );
    expect(getByTestId(`friend-name-${userWithoutName.id}`).props.children).toBe('');

    const { getByTestId: getByTestId2 } = render(
      <AddGroupMemberCard friend={userWithoutUsername} selected={false} onToggle={mockOnToggle} />,
    );
    expect(getByTestId2(`friend-username-${userWithoutUsername.id}`).props.children).toEqual([
      '@',
      '',
    ]);
  });

  it('handles long friend names and usernames properly', () => {
    const longString =
      'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

    const { getByTestId } = render(
      <AddGroupMemberCard
        friend={{ ...mockUser1, name: longString, username: longString }}
        selected={false}
        onToggle={mockOnToggle}
      />,
    );

    expect(getByTestId(`friend-name-${mockUser1.id}`).props.children).toBe(longString);
    expect(getByTestId(`friend-username-${mockUser1.id}`).props.children).toEqual([
      '@',
      longString,
    ]);
  });
});
