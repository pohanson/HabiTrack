/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

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
  },
};
