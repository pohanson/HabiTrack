/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';
const green = '#1be600';
const red = '#e60000';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#f4f4f4',
    tint: tintColorLight,
    icon: 'white',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#000000',
    card: '#fff',
    header: '#005e7d',
    blue: '#009ec9',
    lightGray: '#bababa',
    green: green,
    red: red,
    progressBarIncomplete: '#878787',
  },
  dark: {
    text: '#ECEDEE',
    background: '#0f0f0f',
    tint: tintColorDark,
    icon: '##38403f',
    tabIconDefault: '#798A89',
    tabIconSelected: tintColorDark,
    border: '#888',
    card: '#1f1f1f',
    header: '#00d5ff',
    blue: '#00b3ff',
    lightGray: 'dimgray',
    green: green,
    red: red,
    progressBarIncomplete: '#5c5c5c',
  },
};
