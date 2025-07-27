import { fireEvent, render } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';
import { RHFTimeInput } from '../RHFTimeInput';

import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native';

jest.mock('@react-native-community/datetimepicker', () => jest.fn());
function SimpleForm() {
  const useFormReturn = useForm();
  return <RHFTimeInput label="Time" control={useFormReturn.control} />;
}

describe('<RHFTimeInput />', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (DateTimePicker as jest.Mock).mockImplementation((props) => (
      <TextInput
        testID={'mockdtp'}
        onPress={() => props.onChange({}, new Date('2000-01-01T04:00:00Z'))}
      />
    ));
  });
  it('should render correctly', () => {
    const { getByText } = render(<SimpleForm />);
    expect(getByText('Time')).toBeTruthy();
  });

  it('should show DateTimePicker when pressed, and set correct time', () => {
    const { getByText, getByTestId, queryByText } = render(<SimpleForm />);

    expect(DateTimePicker).not.toHaveBeenCalled();
    getByText('No Reminder');
    fireEvent.press(getByText('Select Time'));
    expect(DateTimePicker).toHaveBeenCalled();

    expect(queryByText('1200')).toBeNull();
    fireEvent.press(getByTestId('mockdtp')); // mock select the time
    expect(queryByText('1200')).toBeTruthy();
    expect(queryByText('No Reminder')).toBeNull();
  });

  it('should clear time when xmark is pressed', () => {
    const { getByText, getByTestId, queryByText } = render(<SimpleForm />);

    // set the time
    fireEvent.press(getByText('Select Time'));
    fireEvent.press(getByTestId('mockdtp'));
    expect(queryByText('1200')).toBeTruthy();

    // clearing the time
    fireEvent.press(getByTestId('xmark-icon-button'));
    expect(queryByText('1200')).toBeNull();
    getByText('No Reminder');
  });
});
