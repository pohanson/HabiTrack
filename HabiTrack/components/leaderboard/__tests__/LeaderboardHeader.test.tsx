import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { LeaderboardHeader } from '../LeaderboardHeader';
import { useThemeColor } from '@/hooks/useThemeColor';

describe('<LeaderboardHeader />', () => {
  const onSelectionChange = jest.fn();

  const selectedColor = useThemeColor({}, 'blue');
  const deselectedColor = 'gray';

  const selectedTextColor = 'white';
  const deselectedTextColor = 'black';

  it('displays without crashing', () => {
    const { getByTestId } = render(
      <LeaderboardHeader selectionType="Completion Rate" onSelectionChange={onSelectionChange} />,
    );

    expect(getByTestId('leaderboard-header')).toBeTruthy();
    expect(getByTestId('leaderboard-header-completion-rate-button')).toBeTruthy();
    expect(getByTestId('leaderboard-header-completion-rate-button-text')).toBeTruthy();
    expect(getByTestId('leaderboard-header-badges-earned-button')).toBeTruthy();
    expect(getByTestId('leaderboard-header-badges-earned-button-text')).toBeTruthy();
  });

  it('displays completion rate and badges earned button texts correctly', () => {
    const { getByTestId } = render(
      <LeaderboardHeader selectionType="Completion Rate" onSelectionChange={onSelectionChange} />,
    );

    expect(getByTestId('leaderboard-header-completion-rate-button-text')).toHaveTextContent(
      'Completion Rate',
    );
    expect(getByTestId('leaderboard-header-badges-earned-button-text')).toHaveTextContent(
      'Badges Earned',
    );
  });

  it('displays the correct button background colors with completion rate selected', () => {
    const { getByTestId } = render(
      <LeaderboardHeader selectionType="Completion Rate" onSelectionChange={onSelectionChange} />,
    );

    const completionRateButton = getByTestId('leaderboard-header-completion-rate-button');
    const stylesString = JSON.stringify(completionRateButton.props.style);

    expect(stylesString).toContain(`"backgroundColor":"${selectedColor}"`);
    expect(stylesString).toContain(`"borderColor":"${selectedTextColor}"`);
    expect(stylesString).not.toContain(`"backgroundColor":"${deselectedColor}"`);
    expect(stylesString).not.toContain(`"borderColor":"${deselectedTextColor}"`);
  });

  it('displays the correct button background colors with badges earned selected', () => {
    const { getByTestId } = render(
      <LeaderboardHeader selectionType="Badges Earned" onSelectionChange={onSelectionChange} />,
    );

    const badgesEarnedButton = getByTestId('leaderboard-header-badges-earned-button');
    const stylesString = JSON.stringify(badgesEarnedButton.props.style);

    expect(stylesString).toContain(`"backgroundColor":"${selectedColor}"`);
    expect(stylesString).toContain(`"borderColor":"${selectedTextColor}"`);
    expect(stylesString).not.toContain(`"backgroundColor":"${deselectedColor}"`);
    expect(stylesString).not.toContain(`"borderColor":"${deselectedTextColor}"`);
  });

  it('displays the correct button text colors with completion rate selected', () => {
    const { getByTestId } = render(
      <LeaderboardHeader selectionType="Completion Rate" onSelectionChange={onSelectionChange} />,
    );
    const completionRateButtonText = getByTestId('leaderboard-header-completion-rate-button-text');
    const stylesString = JSON.stringify(completionRateButtonText.props.style);
    expect(stylesString).toContain(`"color":"${selectedTextColor}"`);
    expect(stylesString).not.toContain(`"color":"${deselectedTextColor}"`);
  });

  it('displays the correct button text colors with badges earned selected', () => {
    const { getByTestId } = render(
      <LeaderboardHeader selectionType="Badges Earned" onSelectionChange={onSelectionChange} />,
    );
    const badgesEarnedButtonText = getByTestId('leaderboard-header-badges-earned-button-text');
    const stylesString = JSON.stringify(badgesEarnedButtonText.props.style);
    expect(stylesString).toContain(`"color":"${selectedTextColor}"`);
    expect(stylesString).not.toContain(`"color":"${deselectedTextColor}"`);
  });

  it('handles switching selection types correctly', () => {
    const { getByTestId } = render(
      <LeaderboardHeader selectionType="Completion Rate" onSelectionChange={onSelectionChange} />,
    );

    const completionRateButton = getByTestId('leaderboard-header-completion-rate-button');
    fireEvent.press(completionRateButton);
    expect(onSelectionChange).toHaveBeenCalledWith('Completion Rate');

    const badgesEarnedButton = getByTestId('leaderboard-header-badges-earned-button');
    fireEvent.press(badgesEarnedButton);
    expect(onSelectionChange).toHaveBeenCalledWith('Badges Earned');
  });

  it('calls onSelectionChange when completion rate button is pressed', () => {
    const { getByTestId } = render(
      <LeaderboardHeader selectionType="Completion Rate" onSelectionChange={onSelectionChange} />,
    );

    const completionRateButton = getByTestId('leaderboard-header-completion-rate-button');
    fireEvent.press(completionRateButton);
    expect(onSelectionChange).toHaveBeenCalledWith('Completion Rate');
  });

  it('calls onSelectionChange when badges earned button is pressed', () => {
    const { getByTestId } = render(
      <LeaderboardHeader selectionType="Badges Earned" onSelectionChange={onSelectionChange} />,
    );

    const badgesEarnedButton = getByTestId('leaderboard-header-badges-earned-button');
    fireEvent.press(badgesEarnedButton);
    expect(onSelectionChange).toHaveBeenCalledWith('Badges Earned');
  });

  it('handles empty selectionType properly', () => {
    const { getByTestId } = render(
      <LeaderboardHeader selectionType="" onSelectionChange={onSelectionChange} />,
    );

    const completionRateButton = getByTestId('leaderboard-header-completion-rate-button');
    const badgesEarnedButton = getByTestId('leaderboard-header-badges-earned-button');

    const completionStyles = JSON.stringify(completionRateButton.props.style);
    const badgesStyles = JSON.stringify(badgesEarnedButton.props.style);

    expect(completionStyles).toContain(`"backgroundColor":"${deselectedColor}"`);
    expect(badgesStyles).toContain(`"backgroundColor":"${deselectedColor}"`);
  });

  it('handles invalid selectionType properly', () => {
    const { getByTestId } = render(
      <LeaderboardHeader selectionType="Invalid Selection" onSelectionChange={onSelectionChange} />,
    );

    const completionRateButton = getByTestId('leaderboard-header-completion-rate-button');
    const badgesEarnedButton = getByTestId('leaderboard-header-badges-earned-button');

    const completionStyles = JSON.stringify(completionRateButton.props.style);
    const badgesStyles = JSON.stringify(badgesEarnedButton.props.style);

    expect(completionStyles).toContain(`"backgroundColor":"${deselectedColor}"`);
    expect(badgesStyles).toContain(`"backgroundColor":"${deselectedColor}"`);
  });

  it('handles null selectionType properly', () => {
    const { getByTestId } = render(
      <LeaderboardHeader selectionType={null as any} onSelectionChange={onSelectionChange} />,
    );

    expect(getByTestId('leaderboard-header')).toBeTruthy();
  });
});
