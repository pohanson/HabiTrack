import React from 'react';
import { render } from '@testing-library/react-native';
import { LeaderboardElement } from '../LeaderboardElement';
import type { User } from '@/db/localSchema';

describe('<LeaderboardElement />', () => {
  const mockUser: User = {
    id: '1',
    name: 'John',
    username: 'john',
    profilePicture: 'https://imgur.com/gallery/profile-MBSb2uh#/t/profile',
    password: 'password',
    bio: 'random bio',
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    isDeleted: false,
  };

  const defaultProps = {
    selectionType: 'Completion Rate',
    rank: 1,
    user: mockUser,
    quantity: 85,
    isUser: true,
  };

  it('displays without crashing', () => {
    const { getByTestId } = render(<LeaderboardElement {...defaultProps} />);

    expect(getByTestId('leaderboard-element-1')).toBeTruthy();
    expect(getByTestId('leaderboard-element-1-rank-container')).toBeTruthy();
    expect(getByTestId('leaderboard-element-1-rank-icon')).toBeTruthy();
    expect(getByTestId('leaderboard-element-1-rank-number')).toBeTruthy();
    expect(getByTestId('leaderboard-element-1-user-profile')).toBeTruthy();
    expect(getByTestId('leaderboard-element-1-user-name')).toBeTruthy();
    expect(getByTestId('leaderboard-element-1-username')).toBeTruthy();
    expect(getByTestId('leaderboard-element-1-quantity-container')).toBeTruthy();
    expect(getByTestId('leaderboard-element-1-quantity-text')).toBeTruthy();
  });

  it('displays first place with gold medal emoji', () => {
    const { getByText } = render(<LeaderboardElement {...defaultProps} rank={1} />);

    expect(getByText('🥇')).toBeTruthy();
    expect(getByText('1')).toBeTruthy();
  });

  it('displays second place with silver medal emoji', () => {
    const { getByText } = render(<LeaderboardElement {...defaultProps} rank={2} />);

    expect(getByText('🥈')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
  });

  it('displays third place with bronze medal emoji', () => {
    const { getByText } = render(<LeaderboardElement {...defaultProps} rank={3} />);

    expect(getByText('🥉')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
  });

  it('displays 4th place and below without any medal emoji', () => {
    const { getByText, queryByText } = render(<LeaderboardElement {...defaultProps} rank={4} />);

    expect(getByText('4')).toBeTruthy();
    expect(queryByText('🥇')).toBeFalsy();
    expect(queryByText('🥈')).toBeFalsy();
    expect(queryByText('🥉')).toBeFalsy();
  });

  it('displays with white border for current user', () => {
    const { getByTestId } = render(<LeaderboardElement {...defaultProps} isUser={true} />);

    const stylesString = JSON.stringify(getByTestId('leaderboard-element-1').props.style);

    expect(stylesString).toContain('"borderWidth":3');
    expect(stylesString).toContain('"borderColor":"white"');
  });

  it('displays without white border for non-current user', () => {
    const { getByTestId } = render(<LeaderboardElement {...defaultProps} isUser={false} />);

    const styleString = JSON.stringify(getByTestId('leaderboard-element-1').props.style);

    expect(styleString).toContain('"borderWidth":0');
    expect(styleString).not.toContain('"borderWidth":3');
  });

  it('displays with correct background color for first place', () => {
    const { getByTestId } = render(<LeaderboardElement {...defaultProps} rank={1} />);

    const stylesString = JSON.stringify(getByTestId('leaderboard-element-1').props.style);

    expect(stylesString).toContain('"backgroundColor":"#fff700ff"');
  });

  it('displays with correct background color for second place', () => {
    const { getByTestId } = render(<LeaderboardElement {...defaultProps} rank={2} />);

    const stylesString = JSON.stringify(getByTestId('leaderboard-element-2').props.style);

    expect(stylesString).toContain('"backgroundColor":"#ffd900ff"');
  });

  it('displays with correct background color for third place', () => {
    const { getByTestId } = render(<LeaderboardElement {...defaultProps} rank={3} />);

    const stylesString = JSON.stringify(getByTestId('leaderboard-element-3').props.style);

    expect(stylesString).toContain('"backgroundColor":"#ffb700ff"');
  });

  it('displays with default background color for 4th place and below', () => {
    const { getByTestId } = render(<LeaderboardElement {...defaultProps} rank={4} />);

    const stylesString = JSON.stringify(getByTestId('leaderboard-element-4').props.style);

    expect(stylesString).toContain('"backgroundColor":"#f4f4f4"'); // Assuming theme.card is #f0f0f0
  });

  it('displays user name and username', () => {
    const { getByText } = render(<LeaderboardElement {...defaultProps} />);

    expect(getByText('John')).toBeTruthy();
    expect(getByText('@john')).toBeTruthy();
  });

  it('formats completion rate properly ["%" suffix]', () => {
    const { getByText } = render(
      <LeaderboardElement {...defaultProps} selectionType="Completion Rate" quantity={75} />,
    );

    expect(getByText('75%')).toBeTruthy();
  });

  it('formats badges earned properly ["Badges" suffix]', () => {
    const { getByText } = render(
      <LeaderboardElement {...defaultProps} selectionType="Badges Earned" quantity={12} />,
    );

    expect(getByText('12 Badges')).toBeTruthy();
  });

  it('formats unknown selection type properly ["Unknown Type" suffix]', () => {
    const { getByText } = render(
      <LeaderboardElement {...defaultProps} selectionType="Unknown Type" quantity={42} />,
    );

    expect(getByText('42 Unknown Type')).toBeTruthy();
  });

  it('handles empty user name', () => {
    const userWithEmptyName = { ...mockUser, name: '' };
    const { getByText } = render(<LeaderboardElement {...defaultProps} user={userWithEmptyName} />);

    expect(getByText('')).toBeTruthy();
    expect(getByText('@john')).toBeTruthy();
  });

  it('handles long username', () => {
    const userWithLongUsername = { ...mockUser, username: 'xxxxxxxxxxxxxxxxxxxxxxxxx' };
    const { getByText } = render(
      <LeaderboardElement {...defaultProps} user={userWithLongUsername} />,
    );

    expect(getByText('@xxxxxxxxxxxxxxxxxxxxxxxxx')).toBeTruthy();
  });

  it('handles 0 quantity', () => {
    const { getByText } = render(
      <LeaderboardElement {...defaultProps} quantity={0} selectionType="Completion Rate" />,
    );

    expect(getByText('0%')).toBeTruthy();
  });

  it('handles negative quantity', () => {
    const { getByText } = render(
      <LeaderboardElement {...defaultProps} quantity={-5} selectionType="Badges Earned" />,
    );

    expect(getByText('-5 Badges')).toBeTruthy();
  });

  it('handles large quantities', () => {
    const { getByText } = render(
      <LeaderboardElement {...defaultProps} quantity={9999999} selectionType="Badges Earned" />,
    );

    expect(getByText('9999999 Badges')).toBeTruthy();
  });

  it('handles 0 rank', () => {
    const { getByText } = render(<LeaderboardElement {...defaultProps} rank={0} />);

    expect(getByText('0')).toBeTruthy();
  });

  it('handles negative rank', () => {
    const { getByText } = render(<LeaderboardElement {...defaultProps} rank={-1} />);

    expect(getByText('-1')).toBeTruthy();
  });

  it('handles high rank', () => {
    const { getByText } = render(<LeaderboardElement {...defaultProps} rank={1000} />);

    expect(getByText('1000')).toBeTruthy();
  });
});
