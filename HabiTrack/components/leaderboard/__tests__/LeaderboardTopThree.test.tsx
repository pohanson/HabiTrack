import React from 'react';
import { render } from '@testing-library/react-native';
import { LeaderboardTopThree } from '../LeaderboardTopThree';
import { User } from '@/db/localSchema';

describe('LeaderboardTopThree', () => {
  const color1 = '#1E88E5'; // (1st place)
  const color2 = '#42A5F5'; // (2nd place)
  const color3 = '#64B5F6'; // (3rd place)

  const podiumNumberSizeFirstPlace = 50;
  const podiumNumberSizeSecondPlace = 40;
  const podiumNumberSizeThirdPlace = 30;

  const mockUser1: User = {
    id: '1',
    name: 'User One',
    username: 'user1',
    profilePicture: 'user1.jpg',
    password: 'password1',
    bio: 'Bio of User One',
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    isDeleted: false,
  };

  const mockUser2: User = {
    id: '2',
    name: 'User Two',
    username: 'user2',
    profilePicture: 'user2.jpg',
    password: 'password1',
    bio: 'Bio of User Two',
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    isDeleted: false,
  };

  const mockUser3: User = {
    id: '3',
    name: 'User Three',
    username: 'user3',
    profilePicture: 'user3.jpg',
    password: 'password1',
    bio: 'Bio of User Three',
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    isDeleted: false,
  };

  it('displays without crashing', () => {
    const { getByTestId } = render(<LeaderboardTopThree />);
    expect(getByTestId('leaderboard-top-three')).toBeTruthy();
  });

  it('displays with first, second, and third user correctly', () => {
    const { getByTestId } = render(
      <LeaderboardTopThree user1={mockUser1} user2={mockUser2} user3={mockUser3} />,
    );
    expect(getByTestId('leaderboard-top-three')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-second-place')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-first-place')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-third-place')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-second-place-card')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-first-place-card')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-third-place-card')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-second-place-user-profile')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-first-place-user-profile')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-third-place-user-profile')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-second-place-number')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-first-place-number')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-third-place-number')).toBeTruthy();
  });

  it('displays without any users correctly', () => {
    const { getByTestId, queryByTestId } = render(<LeaderboardTopThree />);

    expect(getByTestId('leaderboard-top-three')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-second-place')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-first-place')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-third-place')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-second-place-card')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-first-place-card')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-third-place-card')).toBeTruthy();
    expect(queryByTestId('leaderboard-top-three-second-place-user-profile')).toBeFalsy();
    expect(queryByTestId('leaderboard-top-three-first-place-user-profile')).toBeFalsy();
    expect(queryByTestId('leaderboard-top-three-third-place-user-profile')).toBeFalsy();
    expect(getByTestId('leaderboard-top-three-second-place-number')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-first-place-number')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-third-place-number')).toBeTruthy();
  });

  it('displays with only first place user correctly', () => {
    const { getByTestId, queryByTestId } = render(<LeaderboardTopThree user1={mockUser1} />);

    expect(getByTestId('leaderboard-top-three')).toBeTruthy();

    expect(getByTestId('leaderboard-top-three-first-place')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-first-place-card')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-first-place-user-profile')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-first-place-number')).toBeTruthy();

    expect(queryByTestId('leaderboard-top-three-second-place')).toBeTruthy();
    expect(queryByTestId('leaderboard-top-three-second-place-card')).toBeTruthy();
    expect(queryByTestId('leaderboard-top-three-second-place-user-profile')).toBeFalsy();
    expect(queryByTestId('leaderboard-top-three-second-place-number')).toBeTruthy();

    expect(queryByTestId('leaderboard-top-three-third-place')).toBeTruthy();
    expect(queryByTestId('leaderboard-top-three-third-place-card')).toBeTruthy();
    expect(queryByTestId('leaderboard-top-three-third-place-user-profile')).toBeFalsy();
    expect(queryByTestId('leaderboard-top-three-third-place-number')).toBeTruthy();
  });

  it('displays with only first and second place user correctly', () => {
    const { getByTestId, queryByTestId } = render(
      <LeaderboardTopThree user1={mockUser1} user2={mockUser2} />,
    );

    expect(getByTestId('leaderboard-top-three')).toBeTruthy();

    expect(getByTestId('leaderboard-top-three-first-place')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-first-place-card')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-first-place-user-profile')).toBeTruthy();
    expect(getByTestId('leaderboard-top-three-first-place-number')).toBeTruthy();

    expect(queryByTestId('leaderboard-top-three-second-place')).toBeTruthy();
    expect(queryByTestId('leaderboard-top-three-second-place-card')).toBeTruthy();
    expect(queryByTestId('leaderboard-top-three-second-place-user-profile')).toBeTruthy();
    expect(queryByTestId('leaderboard-top-three-second-place-number')).toBeTruthy();

    expect(queryByTestId('leaderboard-top-three-third-place')).toBeTruthy();
    expect(queryByTestId('leaderboard-top-three-third-place-card')).toBeTruthy();
    expect(queryByTestId('leaderboard-top-three-third-place-user-profile')).toBeFalsy();
    expect(queryByTestId('leaderboard-top-three-third-place-number')).toBeTruthy();
  });

  it('displays podium colors correctly', () => {
    const { getByTestId } = render(
      <LeaderboardTopThree user1={mockUser1} user2={mockUser2} user3={mockUser3} />,
    );

    expect(getByTestId('leaderboard-top-three-first-place-card')).toHaveStyle({
      backgroundColor: color1,
    });
    expect(getByTestId('leaderboard-top-three-second-place-card')).toHaveStyle({
      backgroundColor: color2,
    });
    expect(getByTestId('leaderboard-top-three-third-place-card')).toHaveStyle({
      backgroundColor: color3,
    });
  });

  it('displays correct image sources for podium numbers', () => {
    const { getByTestId } = render(
      <LeaderboardTopThree user1={mockUser1} user2={mockUser2} user3={mockUser3} />,
    );

    const firstPlaceNumber = getByTestId('leaderboard-top-three-first-place-number');
    const secondPlaceNumber = getByTestId('leaderboard-top-three-second-place-number');
    const thirdPlaceNumber = getByTestId('leaderboard-top-three-third-place-number');

    expect(firstPlaceNumber.props.source).toEqual(require('@/assets/images/1.png'));
    expect(secondPlaceNumber.props.source).toEqual(require('@/assets/images/2.png'));
    expect(thirdPlaceNumber.props.source).toEqual(require('@/assets/images/3.png'));
  });

  it('displays podium numbers with correct sizes', () => {
    const { getByTestId } = render(
      <LeaderboardTopThree user1={mockUser1} user2={mockUser2} user3={mockUser3} />,
    );

    expect(getByTestId('leaderboard-top-three-first-place-number')).toHaveStyle({
      width: podiumNumberSizeFirstPlace,
      height: podiumNumberSizeFirstPlace,
    });
    expect(getByTestId('leaderboard-top-three-second-place-number')).toHaveStyle({
      width: podiumNumberSizeSecondPlace,
      height: podiumNumberSizeSecondPlace,
    });
    expect(getByTestId('leaderboard-top-three-third-place-number')).toHaveStyle({
      width: podiumNumberSizeThirdPlace,
      height: podiumNumberSizeThirdPlace,
    });
  });

  it('handles users with missing profile pictures properly', () => {
    const userWithoutProfilePic = { ...mockUser1, profilePicture: null };

    const { getByTestId } = render(<LeaderboardTopThree user1={userWithoutProfilePic} />);

    expect(getByTestId('leaderboard-top-three-first-place-user-profile')).toBeTruthy();
  });

  it('handles users with empty names properly', () => {
    const userWithEmptyName = { ...mockUser1, name: '' };

    const { getByTestId } = render(<LeaderboardTopThree user1={userWithEmptyName} />);

    expect(getByTestId('leaderboard-top-three-first-place-user-profile')).toBeTruthy();
  });

  it('handles users with long names properly', () => {
    const userWithLongName = {
      ...mockUser1,
      name: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    };

    const { getByTestId } = render(<LeaderboardTopThree user1={userWithLongName} />);

    expect(getByTestId('leaderboard-top-three-first-place-user-profile')).toBeTruthy();
  });

  it('handles undefined users properly', () => {
    const { getByTestId, queryByTestId } = render(
      <LeaderboardTopThree user1={undefined} user2={undefined} user3={undefined} />,
    );

    expect(getByTestId('leaderboard-top-three')).toBeTruthy();
    expect(queryByTestId('leaderboard-top-three-first-place-user-profile')).toBeFalsy();
    expect(queryByTestId('leaderboard-top-three-second-place-user-profile')).toBeFalsy();
    expect(queryByTestId('leaderboard-top-three-third-place-user-profile')).toBeFalsy();
  });
});
