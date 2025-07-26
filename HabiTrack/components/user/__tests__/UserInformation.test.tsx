import React from 'react';
import { render } from '@testing-library/react-native';
import { UserInformation } from '../UserInformation';
import { User } from '@/db/localSchema';

describe('<UserInformation />', () => {
  const mockUser: User = {
    id: '1',
    name: 'John',
    username: 'john',
    profilePicture: 'user.jpg',
    password: 'password',
    bio: 'This is a mock user bio.',
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    isDeleted: false,
  };

  const defaultProps = {
    user: mockUser,
  };

  it('renders without crashing', () => {
    const { getByTestId } = render(<UserInformation {...defaultProps} />);
    expect(getByTestId('user-information')).toBeTruthy();
    expect(getByTestId('user-information-details')).toBeTruthy();
    expect(getByTestId('user-information-name')).toBeTruthy();
    expect(getByTestId('user-information-username')).toBeTruthy();
    expect(getByTestId('user-information-bio')).toBeTruthy();
  });

  it("displays user's profile picture when available", () => {
    const { getByTestId } = render(<UserInformation {...defaultProps} />);
    const profilePicture = getByTestId('user-information-profile-picture');

    expect(profilePicture.props.source.uri).toBe(
      `data:image/jpeg;base64,${mockUser.profilePicture}`,
    );
  });

  it("displays placeholder element if user's profile picture is not available", () => {
    const { getByTestId, queryByTestId } = render(
      <UserInformation user={{ ...mockUser, profilePicture: null }} />,
    );

    expect(getByTestId('user-information-no-profile-picture')).toBeTruthy();
    expect(queryByTestId('user-information-profile-picture')).toBeFalsy();
  });

  it("displays user's name when available", () => {
    const { getByTestId } = render(<UserInformation {...defaultProps} />);

    expect(getByTestId('user-information-name').props.children).toBe(mockUser.name);
  });

  it("displays loading text when user's name is not available", () => {
    const { getByTestId } = render(<UserInformation user={{ ...mockUser, name: '' }} />);

    expect(getByTestId('user-information-name').props.children).toBe('Loading...');
  });

  it("displays user's username when available with @ prefix", () => {
    const { getByTestId } = render(<UserInformation {...defaultProps} />);

    expect(getByTestId('user-information-username').props.children).toBe(`@${mockUser.username}`);
  });

  it("displays loading text when user's username is not available", () => {
    const { getByTestId } = render(<UserInformation user={{ ...mockUser, username: '' }} />);

    expect(getByTestId('user-information-username').props.children).toBe('Loading...');
  });

  it("displays user's bio when available", () => {
    const { getByTestId } = render(<UserInformation {...defaultProps} />);

    expect(getByTestId('user-information-bio').props.children).toBe(mockUser.bio);
  });

  it("displays default text when user's bio is not available", () => {
    const { getByTestId } = render(<UserInformation user={{ ...mockUser, bio: '' }} />);

    expect(getByTestId('user-information-bio').props.children).toBe('No bio available.');
  });

  it('applies correct styles to the profile picture', () => {
    const { getByTestId } = render(<UserInformation {...defaultProps} />);
    const profilePicture = getByTestId('user-information-profile-picture');
    expect(profilePicture.props.style).toEqual(
      expect.objectContaining({
        width: 100,
        height: 100,
        borderRadius: 50,
      }),
    );
  });

  it('handles missing user data properly', () => {
    const { getByTestId, queryByTestId } = render(<UserInformation user={null} />);

    expect(getByTestId('user-information-no-profile-picture')).toBeTruthy();
    expect(queryByTestId('user-information-profile-picture')).toBeFalsy();
    expect(getByTestId('user-information-name').props.children).toBe('Loading...');
    expect(getByTestId('user-information-username').props.children).toBe('Loading...');
    expect(getByTestId('user-information-bio').props.children).toBe('No bio available.');
  });

  it('handles long usernames and names properly', () => {
    const longUser: User = {
      ...mockUser,
      name: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      username: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    };

    const { getByTestId } = render(<UserInformation user={longUser} />);

    expect(getByTestId('user-information-name').props.children).toBe(longUser.name);
    expect(getByTestId('user-information-username').props.children).toBe(`@${longUser.username}`);
  });
});
