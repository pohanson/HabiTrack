import React from 'react';
import { render } from '@testing-library/react-native';
import PieChart from '../PieChart';

const mockReact = React;

jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: ({ children, testID, ...props }: any) =>
    mockReact.createElement('View', { testID, ...props }, children),
  G: ({ children, testID, ...props }: any) =>
    mockReact.createElement('View', { testID, ...props }, children),
  Circle: ({ testID, ...props }: any) => mockReact.createElement('View', { testID, ...props }),
  Text: ({ children, testID, ...props }: any) =>
    mockReact.createElement('Text', { testID, ...props }, children),
}));

describe('<PieChart />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays without crashing w/ default props', () => {
    const { getByTestId } = render(<PieChart actualNoOfDays={10} expectedNoOfDays={20} />);

    expect(getByTestId('pie-chart-container')).toBeTruthy();
    expect(getByTestId('pie-chart-svg')).toBeTruthy();
    expect(getByTestId('pie-chart-group')).toBeTruthy();
    expect(getByTestId('pie-chart-circle-background')).toBeTruthy();
    expect(getByTestId('pie-chart-circle-foreground')).toBeTruthy();
    expect(getByTestId('pie-chart-percentage-text')).toBeTruthy();
  });

  it('displays correct percentage text for normal values', () => {
    const { getByTestId } = render(<PieChart actualNoOfDays={10} expectedNoOfDays={20} />);

    const percentageText = getByTestId('pie-chart-percentage-text');
    expect(percentageText.props.children).toBe('50%');
  });

  it('displays 100% when actual days > expected days', () => {
    const { getByTestId } = render(<PieChart actualNoOfDays={25} expectedNoOfDays={20} />);

    const percentageText = getByTestId('pie-chart-percentage-text');
    expect(percentageText.props.children).toBe('100%');
  });

  it('displays 0% when expected days === 0', () => {
    const { getByTestId } = render(<PieChart actualNoOfDays={10} expectedNoOfDays={0} />);

    const percentageText = getByTestId('pie-chart-percentage-text');
    expect(percentageText.props.children).toBe('0%');
  });

  it('displays 0% when actual days is 0', () => {
    const { getByTestId } = render(<PieChart actualNoOfDays={0} expectedNoOfDays={20} />);

    const percentageText = getByTestId('pie-chart-percentage-text');
    expect(percentageText.props.children).toBe('0%');
  });

  it('handles decimal percentages correctly by rounding', () => {
    const { getByTestId } = render(<PieChart actualNoOfDays={1} expectedNoOfDays={3} />);

    const percentageText = getByTestId('pie-chart-percentage-text');
    expect(percentageText.props.children).toBe('33.3%');
  });

  it('applies radius prop', () => {
    const radius = 50;
    const { getByTestId } = render(
      <PieChart actualNoOfDays={10} expectedNoOfDays={20} radius={radius} />,
    );

    const svg = getByTestId('pie-chart-svg');
    expect(svg.props.width).toBe(radius * 2);
    expect(svg.props.height).toBe(radius * 2);
  });

  it('applies color prop to circles', () => {
    const color = '#ff2f00ff';
    const { getByTestId } = render(
      <PieChart actualNoOfDays={10} expectedNoOfDays={20} color={color} />,
    );

    const backgroundCircle = getByTestId('pie-chart-circle-background');
    const foregroundCircle = getByTestId('pie-chart-circle-foreground');

    expect(backgroundCircle.props.stroke).toBe(color);
    expect(foregroundCircle.props.stroke).toBe(color);
  });

  it('applies text color prop', () => {
    const color = '#ff2f00ff';
    const { getByTestId } = render(
      <PieChart actualNoOfDays={10} expectedNoOfDays={20} textColor={color} />,
    );

    const percentageText = getByTestId('pie-chart-percentage-text');
    expect(percentageText.props.fill).toBe(color);
  });

  it('calculates correct stroke width based on radius', () => {
    const radius = 45;
    const strokeWidth = radius / 4.5;

    const { getByTestId } = render(
      <PieChart actualNoOfDays={10} expectedNoOfDays={20} radius={radius} />,
    );

    const backgroundCircle = getByTestId('pie-chart-circle-background');
    expect(backgroundCircle.props.strokeWidth).toBe(strokeWidth);
  });

  it('sets correct font size based on radius', () => {
    const radius = 60;
    const fontSize = radius / 2.25;

    const { getByTestId } = render(
      <PieChart actualNoOfDays={10} expectedNoOfDays={20} radius={radius} />,
    );

    const percentageText = getByTestId('pie-chart-percentage-text');
    expect(percentageText.props.fontSize).toBe(fontSize);
  });

  it('handles edge case: 100% completion', () => {
    const { getByTestId } = render(<PieChart actualNoOfDays={20} expectedNoOfDays={20} />);

    const percentageText = getByTestId('pie-chart-percentage-text');
    expect(percentageText.props.children).toBe('100%');
  });

  it('handles edge case: small percentage', () => {
    const { getByTestId } = render(<PieChart actualNoOfDays={1} expectedNoOfDays={1000} />);

    const percentageText = getByTestId('pie-chart-percentage-text');
    expect(percentageText.props.children).toBe('0.1%');
  });
});
