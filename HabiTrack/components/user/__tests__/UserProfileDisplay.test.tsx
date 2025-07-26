import React from 'react';
import { render } from '@testing-library/react-native';
import { UserProfileDisplay } from '../UserProfileDisplay';
import { User } from '@/db/localSchema';

describe('<UserProfileDisplay />', () => {
  const mockUser: User = {
    id: '1',
    name: 'John',
    username: 'john',
    profilePicture: 'user.jpg',
    password: 'password',
    bio: 'random bio',
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    isDeleted: false,
  };

  const defaultProps = {
    user: mockUser,
  };

  it('displays without crashing', () => {
    const { getByTestId } = render(<UserProfileDisplay {...defaultProps} />);

    expect(getByTestId('user-profile-display')).toBeTruthy();
    expect(getByTestId('user-profile-display-profile-picture')).toBeTruthy();
    expect(getByTestId('user-profile-display-name')).toBeTruthy();
    expect(getByTestId('user-profile-display-username')).toBeTruthy();
  });

  it("displays user's profile picture when available", () => {
    const { getByTestId } = render(<UserProfileDisplay {...defaultProps} />);
    const profilePicture = getByTestId('user-profile-display').findByType('Image');

    expect(profilePicture.props.source.uri).toBe(
      `data:image/png;base64,${mockUser.profilePicture}`,
    );
  });

  it("displays placeholder element if user's profile picture is not available", () => {
    const { getByTestId } = render(
      <UserProfileDisplay user={{ ...mockUser, profilePicture: null }} />,
    );

    expect(getByTestId('user-profile-display')).toBeTruthy();
  });

  it("displays user's name correctly", () => {
    const { getByTestId } = render(<UserProfileDisplay {...defaultProps} />);

    expect(getByTestId('user-profile-display-name').props.children).toBe(mockUser.name);
  });

  it("displays user's username correctly with @ prefix", () => {
    const { getByTestId } = render(<UserProfileDisplay {...defaultProps} />);

    expect(getByTestId('user-profile-display-username').props.children).toEqual([
      '@',
      mockUser.username,
    ]);
  });

  it('handles empty user name properly', () => {
    const userWithoutName: User = { ...mockUser, name: '' };
    const { getByTestId } = render(<UserProfileDisplay user={userWithoutName} />);

    expect(getByTestId('user-profile-display-name').props.children).toBe('');
  });

  it('handles empty username properly', () => {
    const userWithoutUsername: User = { ...mockUser, username: '' };
    const { getByTestId } = render(<UserProfileDisplay user={userWithoutUsername} />);

    expect(getByTestId('user-profile-display-username').props.children).toEqual(['@', '']);
  });

  it('handles missing profile picture', () => {
    const userWithEmptyPicture: User = { ...mockUser, profilePicture: null };
    const { getByTestId, queryByTestId } = render(
      <UserProfileDisplay user={userWithEmptyPicture} />,
    );

    expect(getByTestId('user-profile-display')).toBeTruthy();
    expect(getByTestId('user-profile-display-placeholder-profile-picture')).toBeTruthy();
    expect(queryByTestId('user-profile-display-profile-picture')).toBeFalsy();
  });

  it('handles empty profile picture', () => {
    const userWithEmptyPicture: User = { ...mockUser, profilePicture: '' };
    const { getByTestId, queryByTestId } = render(
      <UserProfileDisplay user={userWithEmptyPicture} />,
    );

    expect(getByTestId('user-profile-display')).toBeTruthy();
    expect(getByTestId('user-profile-display-placeholder-profile-picture')).toBeTruthy();
    expect(queryByTestId('user-profile-display-profile-picture')).toBeFalsy();
  });

  it('handles long usernames and names', () => {
    const longUser: User = {
      ...mockUser,
      name: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      username: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    };

    const { getByTestId } = render(<UserProfileDisplay user={longUser} />);

    expect(getByTestId('user-profile-display-name').props.children).toBe(longUser.name);
    expect(getByTestId('user-profile-display-username').props.children).toEqual([
      '@',
      longUser.username,
    ]);
  });
});
